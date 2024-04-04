from cryptography.fernet import Fernet

# Generate a key for symmetric encryption
def generate_key():
    return Fernet.generate_key()

# Encrypt data using the key
def encrypt_message(message, key):
    fernet = Fernet(key)
    encrypted_message = fernet.encrypt(message.encode())
    return encrypted_message

# Decrypt data using the key
def decrypt_message(encrypted_message, key):
    fernet = Fernet(key)
    decrypted_message = fernet.decrypt(encrypted_message).decode()
    return decrypted_message

# User Authentication
def authenticate():
    # This key should be kept secret and never shared
    key = generate_key()

    # Simulated user database (username, password)
    users = {
        "alice": "password123",
        "bob": "qwerty456",
        "charlie": "letmein789"
    }

    username = input("Enter username: ")
    password = input("Enter password: ")

    if username in users and password == users[username]:
        print("Authentication successful!")
        encrypted_username = encrypt_message(username, key)
        encrypted_password = encrypt_message(password, key)
        return encrypted_username, encrypted_password, key
    else:
        print("Authentication failed!")
        return None, None, None

# Main function
if __name__ == "__main__":
    print("User Authentication Program using Symmetric Encryption")

    encrypted_username, encrypted_password, key = authenticate()

    if encrypted_username and encrypted_password and key:
        print("Encrypted username:", encrypted_username)
        print("Encrypted password:", encrypted_password)

        decrypted_username = decrypt_message(encrypted_username, key)
        decrypted_password = decrypt_message(encrypted_password, key)

        print("Decrypted username:", decrypted_username)
        print("Decrypted password:", decrypted_password)
