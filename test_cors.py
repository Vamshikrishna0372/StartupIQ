import requests

def test_saved():
    try:
        url = "http://127.0.0.1:8000/ideas/saved/"
        headers = {"Origin": "http://localhost:8080"}
        response = requests.options(url, headers=headers)
        print(f"OPTIONS Status: {response.status_code}")
        print(f"OPTIONS Headers: {response.headers}")
        
        # Test actual GET (without token, should be 401)
        response = requests.get(url, headers=headers)
        print(f"GET Status: {response.status_code}")
        print(f"GET Headers: {response.headers}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_saved()
