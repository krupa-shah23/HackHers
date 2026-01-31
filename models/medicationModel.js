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

    nickname: {
      type: String,
      trim: true,
    },

    imageUrl: {
      type: String,
    },

    strength: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    contextTags: [
      {
        type: String,
        trim: true,
      },
    ],

    schedule: {
      times: [
        {
          type: String, // "08:00", "21:00"
          required: true,
        },
      ],

      frequency: {
        type: String,
        enum: ["daily", "weekly", "custom"],
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
