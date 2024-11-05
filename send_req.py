import requests
import time

# Base URL for the API
BASE_URL = 'http://localhost:8000'

# Register a new user
def register(username, password, name, email):
    url = f'{BASE_URL}/register'
    payload = {
        'username': username,
        'password': password,
        'name': name,
        'email': email
    }
    response = requests.post(url, json=payload)
    return response

# Login to get the JWT
def login(username, password):
    url = f'{BASE_URL}/login'
    payload = {
        'username': username,
        'password': password
    }
    response = requests.post(url, json=payload)
    return response

# Get the user profile using the JWT
def get_profile(token):
    url = f'{BASE_URL}/admin/users'
    headers = {
        'Authorization': f'Bearer {token}'
    }
    response = requests.get(url, headers=headers)
    return response

# Main function to execute the workflow
def main():
    # Step 1: Register a new user
    register_response = register("john_doe", "securePassword123", "John Doe", "john@example.com")
    print("Register Response:", register_response.text)

    # Step 2: Login to obtain JWT
    login_response = login("john_doe", "securePassword123")
    print("Login Response:", login_response.json())

    if login_response.status_code == 200:
        token = login_response.json().get('token')
        print(token)

        # Step 3: Use JWT to get the profile
        profile_response = get_profile(token)
        print("Profile Response:", profile_response.json())
    else:
        print("Login failed.")

if __name__ == "__main__":
    main()
