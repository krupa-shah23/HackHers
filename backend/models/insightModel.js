import mongoose from "mongoose";

const insightSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // or CareProfile depending on usage
        required: true
    },
    type: {
        type: String, // e.g., 'late_pattern', 'adherence_milestone', 'weekend_skip'
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    suggestion: {
        type: String
    },
    patternData: {
        type: mongoose.Schema.Types.Mixed // Flexible for storage
    },
    actionType: {
        type: String // e.g., 'adjust_time'
    },
    medicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medication"
    },
    priority: {
        type: Number,
        default: 2
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'dismissed'],
        default: 'pending'
    }
}, { timestamps: true });

export default mongoose.model("Insight", insightSchema);
