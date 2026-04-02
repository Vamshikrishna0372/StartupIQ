import requests

BASE_URL = "http://127.0.0.1:8002"

def test_login():
    data = {
        "username": "admin@example.com",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/auth/login", data=data)
    print(f"Status: {response.status_code}")
    print(f"Body: {response.text}")

if __name__ == "__main__":
    test_login()
