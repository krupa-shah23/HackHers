import mongoose from "mongoose";

const refillSchema = new mongoose.Schema(
  {
    medicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medication",
      required: true,
      unique: true, // one refill state per medication
    },

    daysRemaining: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["ok", "low", "requested"],
      default: "ok",
    },

    lastRequestedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Refill = mongoose.model("Refill", refillSchema);

export default Refill;
