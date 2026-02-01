import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
  {
    careProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareProfile",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Tablet", "Capsule", "Syrup", "Injection", "Inhaler"],
      required: true,
    },

    dosage: {
      type: String,
      required: true,
      trim: true,
    },

    strength: {
        type: String, // Keeping for backward compatibility if needed, but dosage is primary
        trim: true
    },

    imageUrl: {
      type: String,
    },

    notes: {
      type: String,
      trim: true,
    },

    contextTags: [String],

    schedule: {
      times: {
        type: [String],
        required: true
      },

      frequency: {
        type: String,
        enum: ["daily", "every-other-day", "specific-days", "custom"],
        default: "daily",
      },
      
      startDate: {
        type: Date,
        default: Date.now,
      },
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Medication = mongoose.model("Medication", medicationSchema);

export default Medication;
