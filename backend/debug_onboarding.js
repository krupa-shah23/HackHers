import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function run() {
    try {
        // 1. Signup a temp user
        const email = `debug_${Date.now()}@test.com`;
        const password = 'password123';
        console.log(`1. Creating user ${email}...`);
        
        // Note: Check what /signup returns. 
        // Based on authRoute.js, it calls signup controller.
        // Assuming it returns a token or we need to login. 
        // Let's try to just login immediately if signup doesn't return token.
        
        try {
            await axios.post(`${BASE_URL}/auth/signup`, {
                name: 'Debug User',
                email,
                password
            });
        } catch (e) {
            console.log("Signup might have failed or user exists (if using fixed email). Continuing to login.");
        }

        // 2. Login
        console.log("2. Logging in...");
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email,
            password
        });
        
        const token = loginRes.data.token;
        console.log("   Got token:", token ? "Yes" : "No");

        // 3. Patch /users/me (The failing step)
        console.log("3. Sending PATCH /users/me...");
        const payload = {
            role: "caregiver",
            careFor: "parent",
            comfortLevel: "medium",
            priorities: ["meds"],
            onboardingCompleted: true
        };

        const patchRes = await axios.patch(`${BASE_URL}/users/me`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("SUCCESS! Response:", patchRes.data);

    } catch (error) {
        console.error("FAILED!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error:", error.message);
        }
    }
}

run();
