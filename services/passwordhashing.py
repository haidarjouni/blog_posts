from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

def hash_password(password):
    return password_hash.hash(password)

def verify_password(stored_hash, plain_password):
    return password_hash.verify(plain_password, stored_hash)