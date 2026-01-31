import Medication from "../models/medicationModel.js";

// Create medication
export const createMedication = async (req, res) => {
  try {
    const medication = await Medication.create(req.body);
    res.status(201).json(medication);
  } catch (error) {
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
