import mongoose from "mongoose";

const medicationLogSchema = new mongoose.Schema(
  {
    medicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medication",
      required: true,
    },

    careProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareProfile",
      required: true,
    },

    date: {
      type: String, // "2026-01-31"
      required: true,
    },

    status: {
      type: String,
      enum: ["taken", "missed", "skipped"],
      required: true,
    },

    takenAt: {
      type: Date, // optional, only if taken
    },
  },
  { timestamps: true }
);

// One log per medication per day
medicationLogSchema.index(
  { medicationId: 1, date: 1 },
  { unique: true }
);

const MedicationLog = mongoose.model(
  "MedicationLog",
  medicationLogSchema
);

export default MedicationLog;
