
const testSignup = async () => {
    try {
        console.log("Testing Signup Endpoint...");
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test Script User",
                email: "script_test_" + Date.now() + "@test.com",
                password: "password123"
            })
        });

        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Raw Response Body:", text);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
};

testSignup();
