import requests

token = input("Enter the token: ")

url = 'http://localhost:8000/profile'
headers = {
        'Authorization': f'Bearer {token}'
    }
response = requests.get(url, headers=headers)

print(response.json())