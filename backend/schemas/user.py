from models.user import User as UserModel

def create_user_class_to_dict(user : UserModel):
    if user.email_verification_code is not None:
        user.email_verification_code = vars(user.email_verification_code)
    if user.forget_password_verification_code is not None:
        user.forget_password_verification_code = vars(user.forget_password_verification_code)
    if user.third_party_auth is not None:
        user.third_party_auth = vars(user.third_party_auth)
    return vars(user)

def user_individual_serializer(user) -> dict:
    return {
        "_id" : str(user["_id"]),
        "name" : user["name"],
        "email" : user["email"],
        "phone_number" : user["phone_number"],
        "image" : user["image"],
        "role" : user["role"]
    }

def user_group_serializer(users)->list[dict]:
    return [user_individual_serializer(user) for user in users]