import Refill from "../models/refillModel.js";

// Create or update refill info
export const upsertRefill = async (req, res) => {
  try {
    const {
      medicationId,
      daysRemaining,
      status,
    } = req.body;

    const refill = await Refill.findOneAndUpdate(
      { medicationId },
      {
        medicationId,
        daysRemaining,
        status,
        lastRequestedAt:
          status === "requested" ? new Date() : null,
      },
      { upsert: true, new: true }
    );

    res.status(201).json(refill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get refill by medication
export const getRefillByMedication = async (req, res) => {
  try {
    const { medicationId } = req.params;

    const refill = await Refill.findOne({ medicationId });

    if (!refill) {
      return res
        .status(404)
        .json({ message: "Refill info not found" });
    }

    res.json(refill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update days remaining (daily decrement use-case)
export const updateDaysRemaining = async (req, res) => {
  try {
    const { medicationId } = req.params;
    const { daysRemaining } = req.body;

    const status =
      daysRemaining <= 3
        ? "low"
        : "ok";

    const refill = await Refill.findOneAndUpdate(
      { medicationId },
      { daysRemaining, status },
      { new: true }
    );

    if (!refill) {
      return res
        .status(404)
        .json({ message: "Refill info not found" });
    }

    res.json(refill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
