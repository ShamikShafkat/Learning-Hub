from enum import Enum

class VerificationCode : 
    expiry_time : float
    token : str
    
    def __init__(self,token,expiry_time):
        self.token = token
        self.expiry_time = expiry_time

class UserType(str,Enum):
    ADMIN = "ADMIN"
    USER = "USER"

class ThirdPartyAuthType:
    name : str 
    provider_details : object

class User:
    name : str
    email : str
    password : str
    image : str
    phone_number : str
    is_email_verified : bool = False
    email_verification_code : VerificationCode = None
    forget_password_verification_code : VerificationCode = None
    role : UserType = UserType.USER
    third_party_auth : ThirdPartyAuthType = None
    refresh_token : str = None
    
    def __init__(self,name,email,password,image,phone_number,is_email_verified=False,email_verification_code=None,forget_password_verification_code=None,role=UserType.USER,
                 third_party_auth = None,refresh_token = None):
        self.name = name
        self.email = email
        self.password = password
        self.image = image 
        self.phone_number = phone_number
        self.is_email_verified = is_email_verified
        self.email_verification_code = email_verification_code
        self.forget_password_verification_code = forget_password_verification_code
        self.role = role
        self.third_party_auth = third_party_auth 
        self.refresh_token = refresh_token