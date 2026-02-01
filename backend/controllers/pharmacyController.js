import Pharmacy from "../models/pharmacyModel.js";
import Medication from "../models/medicationModel.js";

// Get nearby pharmacies with optional medication filter
export const getNearbyPharmacies = async (req, res) => {
    try {
        const { lat, lng, medicationName, radius = 5 } = req.query;

        // For demo, return all pharmacies (in production, use geospatial query)
        let query = {};

        const pharmacies = await Pharmacy.find(query);

        // If medication name provided, filter by inventory
        let results = pharmacies;
        if (medicationName) {
            results = pharmacies.map(pharmacy => {
                const inventoryItem = pharmacy.inventory.find(
                    item => item.medicationName.toLowerCase().includes(medicationName.toLowerCase())
                );
                return {
                    ...pharmacy.toObject(),
                    matchedMedication: inventoryItem || null,
                    hasStock: !!inventoryItem?.inStock
                };
            }).filter(p => p.matchedMedication);
        }

        // Sort by distance (simplified - using lat/lng difference)
        if (lat && lng) {
            results = results.map(p => ({
                ...p,
                distance: Math.sqrt(
                    Math.pow(p.location.lat - parseFloat(lat), 2) +
                    Math.pow(p.location.lng - parseFloat(lng), 2)
                ) * 111 // Rough km conversion
            })).sort((a, b) => a.distance - b.distance);
        }

        res.json(results);
    } catch (error) {
        console.error("Error fetching pharmacies:", error);
        res.status(500).json({ message: error.message });
    }
};

// Request a refill
export const requestRefill = async (req, res) => {
    try {
        const { medicationId, deliveryMethod = 'pickup' } = req.body;

        const medication = await Medication.findById(medicationId);
        if (!medication) {
            return res.status(404).json({ message: "Medication not found" });
        }

        // Add to refill history
        medication.refillHistory.push({
            requestedAt: new Date(),
            status: 'pending',
            deliveryMethod
        });

        await medication.save();

        // In production, this would send notification to pharmacy
        res.status(201).json({
            message: "Refill request submitted successfully!",
            refillRequest: medication.refillHistory[medication.refillHistory.length - 1]
        });
    } catch (error) {
        console.error("Error requesting refill:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get refill status for a medication
export const getRefillStatus = async (req, res) => {
    try {
        const { medicationId } = req.params;

        const medication = await Medication.findById(medicationId);
        if (!medication) {
            return res.status(404).json({ message: "Medication not found" });
        }

        res.json({
            pillsRemaining: medication.pillsRemaining,
            daysRemaining: Math.floor(medication.pillsRemaining / (medication.pillsPerDose * medication.schedule.times.length)),
            autoRefill: medication.autoRefill,
            pharmacy: medication.pharmacy,
            refillHistory: medication.refillHistory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle auto-refill
export const toggleAutoRefill = async (req, res) => {
    try {
        const { medicationId } = req.params;
        const { autoRefill } = req.body;

        const medication = await Medication.findByIdAndUpdate(
            medicationId,
            { autoRefill },
            { new: true }
        );

        if (!medication) {
            return res.status(404).json({ message: "Medication not found" });
        }

        res.json({
            message: `Auto-refill ${autoRefill ? 'enabled' : 'disabled'}`,
            autoRefill: medication.autoRefill
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Seed demo pharmacies (for development)
export const seedPharmacies = async (req, res) => {
    try {
        const demoPharmacies = [
            {
                name: "Apollo Pharmacy",
                phone: "1800-123-4567",
                address: "123 MG Road, Bangalore",
                location: { lat: 12.9716, lng: 77.5946 },
                isConnected: true,
                deliveryAvailable: true,
                deliveryFee: 30,
                inventory: [
                    { medicationName: "Lisinopril", genericName: "ACE Inhibitor", price: 120, inStock: true, quantity: 50 },
                    { medicationName: "Metformin", genericName: "Diabetes", price: 85, inStock: true, quantity: 100 },
                    { medicationName: "Amlodipine", genericName: "BP Medicine", price: 95, inStock: true, quantity: 30 }
                ]
            },
            {
                name: "MedPlus",
                phone: "1800-234-5678",
                address: "45 Brigade Road, Bangalore",
                location: { lat: 12.9750, lng: 77.6066 },
                isConnected: false,
                deliveryAvailable: true,
                deliveryFee: 25,
                inventory: [
                    { medicationName: "Lisinopril", genericName: "ACE Inhibitor", price: 135, inStock: true, quantity: 25 },
                    { medicationName: "Metformin", genericName: "Diabetes", price: 80, inStock: true, quantity: 60 },
                    { medicationName: "Omeprazole", genericName: "Acid Reducer", price: 65, inStock: true, quantity: 45 }
                ]
            },
            {
                name: "Netmeds Store",
                phone: "1800-345-6789",
                address: "78 Indiranagar, Bangalore",
                location: { lat: 12.9784, lng: 77.6408 },
                isConnected: true,
                deliveryAvailable: true,
                deliveryFee: 0,
                inventory: [
                    { medicationName: "Lisinopril", genericName: "ACE Inhibitor", price: 110, inStock: true, quantity: 100 },
                    { medicationName: "Amlodipine", genericName: "BP Medicine", price: 88, inStock: false, quantity: 0 },
                    { medicationName: "Vitamin D3", genericName: "Supplement", price: 150, inStock: true, quantity: 80 }
                ]
            },
            {
                name: "1mg Pharmacy",
                phone: "1800-456-7890",
                address: "22 Koramangala, Bangalore",
                location: { lat: 12.9352, lng: 77.6245 },
                isConnected: true,
                deliveryAvailable: true,
                deliveryFee: 20,
                inventory: [
                    { medicationName: "Metformin", genericName: "Diabetes", price: 78, inStock: true, quantity: 200 },
                    { medicationName: "Omeprazole", genericName: "Acid Reducer", price: 58, inStock: true, quantity: 150 },
                    { medicationName: "Vitamin D3", genericName: "Supplement", price: 140, inStock: true, quantity: 120 }
                ]
            }
        ];

        await Pharmacy.deleteMany({}); // Clear existing
        await Pharmacy.insertMany(demoPharmacies);

        res.json({ message: "Demo pharmacies seeded successfully!", count: demoPharmacies.length });
    } catch (error) {
        console.error("Error seeding pharmacies:", error);
        res.status(500).json({ message: error.message });
    }
};
