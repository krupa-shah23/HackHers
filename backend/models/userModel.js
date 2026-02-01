import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    contact: {
      type: String, // optional phone
    },

    role: {
      type: String,
      enum: ["self", "caregiver", "both"],
      default: "self",
    },

    linkedCareProfiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CareProfile",
      },
    ],
    
    otp: {
      type: String,
    },

    otpExpiresAt: {
      type: Date,
    },

  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
