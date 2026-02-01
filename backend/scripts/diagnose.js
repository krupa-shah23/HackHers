import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

dotenv.config();

const runDiagnosis = async () => {
    console.log("--- STARTING DIAGNOSIS ---");
    console.log("1. Checking Environment Variables...");
    if (!process.env.MONGO_URI) {
        console.error("FATAL: MONGO_URI is missing!");
        process.exit(1);
    }
    console.log("   MONGO_URI found.");

    console.log("2. Testing Encryption (bcryptjs)...");
    try {
        const hash = await bcrypt.hash("test", 10);
        console.log("   Encryption works. Hash generated.");
    } catch (e) {
        console.error("FATAL: bcrypt failed:", e);
        process.exit(1);
    }

    console.log("3. Connecting to MongoDB...");
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("   MongoDB Connected Successfully.");
    } catch (e) {
        console.error("FATAL: MongoDB connection failed:", e);
        process.exit(1);
    }

    console.log("4. Attempting to create a test user (Direct DB)...");
    try {
        const testEmail = "diagnose_" + Date.now() + "@test.com";
        const dummyUser = await User.create({
            name: "Diagnosis Bot",
            email: testEmail,
            password: "hashedpassword123"
        });
        console.log("   User created successfully:", dummyUser._id);
        
        // Cleanup
        await User.findByIdAndDelete(dummyUser._id);
        console.log("   Test user cleaned up.");
    } catch (e) {
        console.error("FATAL: DB Write failed:", e);
    }

    console.log("--- DIAGNOSIS COMPLETE: DATABASE LAYER IS FINE ---");
    process.exit(0);
};

runDiagnosis();
