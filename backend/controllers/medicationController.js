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
