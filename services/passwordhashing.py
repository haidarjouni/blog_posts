import bcrypt

def hash_password(password):
     password_bytes = password.encode('utf-8')
     hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
     return hashed_password.decode('utf-8')

def verify_password(stored_hash, password):
     password_bytes = password.encode('utf-8')
     stored_hash_bytes = stored_hash.encode('utf-8')
     is_correct = bcrypt.checkpw(password_bytes, stored_hash_bytes)
     return is_correct