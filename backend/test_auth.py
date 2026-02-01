import requests
import json

BASE_URL = "http://localhost:5000/api/auth"

def test_signup(email, password, name):
    print(f"Testing Signup for {email}...")
    try:
        res = requests.post(f"{BASE_URL}/signup", json={
            "email": email,
            "password": password,
            "name": name
        })
        print(f"Status: {res.status_code}")
        print(f"Response: {res.text}")
        return res.status_code == 201 or "User already exists" in res.text
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_login(email, password):
    print(f"Testing Login for {email}...")
    try:
        res = requests.post(f"{BASE_URL}/login", json={
            "email": email,
            "password": password
        })
        print(f"Status: {res.status_code}")
        print(f"Response: {res.text}")
        return res.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    email = "testuser@example.com"
    password = "password123"
    name = "Test User"
    
    if test_signup(email, password, name):
        test_login(email, password)
    else:
        print("Signup failed, skipping login test.")
