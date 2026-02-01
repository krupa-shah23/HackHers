import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testSignup() {
  console.log("Testing Signup...");
  try {
    const res = await axios.post(`${API_URL}/auth/signup`, {
      name: "Test User",
      email: "testuser_" + Date.now() + "@example.com",
      password: "password123"
    });
    console.log("Signup Success:", res.data);
  } catch (err) {
    console.error("Signup Failed Status:", err.response?.status);
    console.error("Signup Failed Data:", err.response?.data);
  }
}

async function testMe() {
  console.log("\nTesting Get Me (expecting 401 without token)...");
  try {
    const res = await axios.get(`${API_URL}/users/me`);
    console.log("Get Me Success:", res.data);
  } catch (err) {
    console.error("Get Me Failed Status:", err.response?.status);
    console.error("Get Me Failed Data:", err.response?.data);
  }
}

async function testForgotPassword(email) {
  console.log("\nTesting Forgot Password (OTP)...");
  try {
    const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    console.log("Forgot Password Success:", res.data);
  } catch (err) {
    console.error("Forgot Password Failed Status:", err.response?.status);
    console.error("Forgot Password Failed Data:", err.response?.data);
  }
}

async function run() {
  const email = "testuser_" + Date.now() + "@example.com";
  
  // Signup first so user exists for forgot password
  console.log("Testing Signup...");
  try {
    const res = await axios.post(`${API_URL}/auth/signup`, {
      name: "Test User",
      email: email,
      password: "password123"
    });
    console.log("Signup Success:", res.data);
  } catch (err) {
    console.error("Signup Failed Status:", err.response?.status);
    console.error("Signup Failed Data:", err.response?.data);
    return; // Stop if signup fails
  }

  await testMe();
  await testForgotPassword(email);
}

run();
