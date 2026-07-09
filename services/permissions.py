from fastapi import HTTPException

from models.user import User

def require_login(user: User):
     if not user:
          raise HTTPException(status_code=401, detail="You must be logged in to perform this action")
     
def require_admin(user: User):
     if not user.is_admin:
          raise HTTPException(status_code=403, detail="You do not have permission to perform this action")

def require_auth_or_admin(target_user_id: int, current_user: User):
     if current_user.id != target_user_id and not current_user.is_admin:
          raise HTTPException(status_code=403, detail="You do not have permission to perform this action")
     
