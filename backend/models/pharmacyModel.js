import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        },

        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        },

        isConnected: {
            type: Boolean,
            default: false // True if pharmacy has API integration
        },

        inventory: [{
            medicationName: { type: String, required: true },
            genericName: { type: String },
            price: { type: Number, required: true },
            inStock: { type: Boolean, default: true },
            quantity: { type: Number }
        }],

        deliveryAvailable: {
            type: Boolean,
            default: true
        },

        deliveryFee: {
            type: Number,
            default: 0
        },

        operatingHours: {
            open: { type: String, default: "08:00" },
            close: { type: String, default: "22:00" }
        }
    },
    { timestamps: true }
);

// Index for geospatial queries
pharmacySchema.index({ "location.lat": 1, "location.lng": 1 });

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);

export default Pharmacy;
