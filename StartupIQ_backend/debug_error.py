import requests
import json

body = {'name': 'NewTestUser3', 'email': 'newtestABC@startupiq.com', 'password': 'Test1234!'}
r = requests.post('http://127.0.0.1:8003/auth/register', json=body)
data = r.json()
detail = data.get('detail', '')

with open('error_output.txt', 'w') as f:
    f.write(detail)

print("Written to error_output.txt")
print("First 200 chars:", detail[:200])
