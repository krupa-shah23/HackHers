import mongoose from "mongoose";
import Medication from "../models/medicationModel.js";

// Create medication
// Create medication
export const createMedication = async (req, res) => {
  try {
    console.log("Create Medication Body:", req.body);
    // console.log("Create Medication File:", req.file); // Optional log

    let { careProfileId, name, type, dosage, schedule, notes, contextTags } = req.body;
    let imageUrl = '';

    // Default to user's first care profile if not provided
    if (!careProfileId || careProfileId === "undefined") {
        const CareProfile = (await import("../models/careProfileModel.js")).default;
        const defaultProfile = await CareProfile.findOne({ createdBy: req.user._id });
        if (defaultProfile) {
            careProfileId = defaultProfile._id;
        } else {
             // AUTO-CREATE PROFILE
             const newProfile = await CareProfile.create({
                 name: "My Care Profile",
                 relation: "Self",
                 createdBy: req.user._id
             });
             careProfileId = newProfile._id;
             console.log("Auto-created Care Profile:", careProfileId);
        }
    }

    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // STRICT Parse schedule
    let parsedSchedule;
    if (typeof schedule === 'string') {
        try {
            parsedSchedule = JSON.parse(schedule);
        } catch (error) {
           console.error("Parsed schedule error:", error);
           return res.status(400).json({ message: "Invalid schedule format (valid JSON required)" });
        }
    } else {
        parsedSchedule = schedule;
    }
    
    // Parse contextTags
     let parsedContextTags = contextTags;
     if (typeof contextTags === 'string') {
         try {
             parsedContextTags = JSON.parse(contextTags);
         } catch {
             // If JSON fails, assume it's CSV or just wrap single
             parsedContextTags = contextTags.includes(',') ? contextTags.split(',') : [contextTags];
         }
     } else if (!contextTags) {
         parsedContextTags = [];
     }


    const medication = await Medication.create({
        careProfileId,
        name,
        type,
        dosage,
        strength: dosage, 
        imageUrl,
        schedule: parsedSchedule,
        notes,
        contextTags: parsedContextTags
    });
    
    res.status(201).json(medication);
  } catch (error) {
    console.error("Error creating medication:", error);
    // Check for validation errors specifically
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(400).json({ message: error.message });
  }
};

// Get all medications for a care profile
export const getMedicationsByCareProfile = async (req, res) => {
  try {
    const { careProfileId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(careProfileId)) {
        return res.status(400).json({ message: "Invalid Care Profile ID" });
    }

    const medications = await Medication.find({
      careProfileId,
      active: true,
    }).sort({ createdAt: -1 });

    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single medication
export const getMedicationById = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }

    res.json(medication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update medication
export const updateMedication = async (req, res) => {
  try {
    const medication = await Medication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }

    res.json(medication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Soft delete (deactivate, not complete delete)
export const deactivateMedication = async (req, res) => {
  try {
    const medication = await Medication.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }

    res.json({ message: "Medication deactivated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check for medications due soon (e.g. within 6 minutes)
// Used by frontend polling for Pop-up/Sound
export const getDueSoon = async (req, res) => {
    try {
        const CareProfile = (await import("../models/careProfileModel.js")).default;
        
        // 1. Find profiles managed by this user
        // (Assuming user manages their own or others. We check ALL linked profiles)
        // If user is elder, their profile is likely linked.
        const profiles = await CareProfile.find({
            $or: [{ createdBy: req.user._id }, { _id: { $in: req.user.linkedCareProfiles } }]
        });
        const profileIds = profiles.map(p => p._id);

        const now = new Date();
        const meds = await Medication.find({ 
            careProfileId: { $in: profileIds },
            active: true
        });

        const dueMeds = [];

        for (const med of meds) {
            // Simplified frequency check (assuming daily for MVP)
            if (med.schedule.frequency !== 'daily' && med.schedule.frequency !== 'custom') {
                 // skip complex logic for now
            }

            if (med.schedule.times && med.schedule.times.length > 0) {
                for (const timeStr of med.schedule.times) {
                    let [h, m] = [0, 0];
                    const cleanTime = timeStr.toLowerCase().replace(/\s/g, '');
                    
                    if (cleanTime.includes('pm')) {
                        const parts = cleanTime.replace('pm', '').split(':');
                        h = parseInt(parts[0]);
                        if (h < 12) h += 12;
                        m = parseInt(parts[1]);
                    } else if (cleanTime.includes('am')) {
                        const parts = cleanTime.replace('am', '').split(':');
                        h = parseInt(parts[0]);
                        if (h === 12) h = 0;
                        m = parseInt(parts[1]);
                    } else {
                        const parts = cleanTime.split(':');
                        h = parseInt(parts[0]);
                        m = parseInt(parts[1]);
                    }

                    const targetDate = new Date();
                    targetDate.setHours(h, m, 0, 0);

                    // If target is earlier today by a lot, ignore. 
                    // If target is in future ~5 mins or just passed ~1 min (tolerant)
                    const diffMs = targetDate - now;
                    const diffMins = diffMs / 60000;

                    // Due window: -1 min (just passed) to +6 mins (upcoming)
                    if (diffMins > -1 && diffMins <= 6) {
                        dueMeds.push({
                            ...med.toObject(),
                            dueTime: timeStr,
                            dueTimestamp: targetDate
                        });
                    }
                }
            }
        }

        res.json(dueMeds);

    } catch (error) {
        console.error("UE soon check error:", error);
        res.status(500).json({ message: error.message });
    }
};
