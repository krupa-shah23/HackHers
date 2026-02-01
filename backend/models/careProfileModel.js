import mongoose from "mongoose";

const careProfileSchema = new mongoose.Schema({
  name: {
    type: String
  },

  relation: {
    type: String // dad, mom, self, etc.
  },

  techComfort: {
    type: String,
    enum: ["low", "high"],
    default: "low"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  caregivers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  permissions: {
    view: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    edit: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    notify: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  }
});

export default mongoose.model("CareProfile", careProfileSchema);
