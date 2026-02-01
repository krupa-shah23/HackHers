import MedicationLog from "../models/medicationLogModel.js";

// Create or update a log (mark taken / missed / skipped)
export const upsertMedicationLog = async (req, res) => {
  try {
    const {
      medicationId,
      careProfileId,
      date,
      status,
    } = req.body;

    const log = await MedicationLog.findOneAndUpdate(
      { medicationId, date },
      {
        medicationId,
        careProfileId,
        date,
        status,
        takenAt: status === "taken" ? new Date() : null,
      },
      { upsert: true, new: true }
    );

    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get logs for a care profile (dashboard)
export const getLogsByCareProfile = async (req, res) => {
  try {
    const { careProfileId } = req.params;

    const logs = await MedicationLog.find({ careProfileId })
      .populate("medicationId", "name nickname")
      .sort({ date: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logs for a medication (trends)
export const getLogsByMedication = async (req, res) => {
  try {
    const { medicationId } = req.params;

    const logs = await MedicationLog.find({ medicationId })
      .sort({ date: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
