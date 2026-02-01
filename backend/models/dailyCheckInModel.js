import mongoose from "mongoose";

const dailyCheckInSchema = new mongoose.Schema(
  {
    careProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareProfile",
      required: true,
    },

    date: {
      type: String, // "2026-01-31"
      required: true,
    },

    mood: {
      type: String,
      enum: ["happy", "okay", "sad"],
      required: true,
    },
  },
  { timestamps: true }
);

// One check-in per care profile per day
dailyCheckInSchema.index(
  { careProfileId: 1, date: 1 },
  { unique: true }
);

const DailyCheckIn = mongoose.model(
  "DailyCheckIn",
  dailyCheckInSchema
);

export default DailyCheckIn;
