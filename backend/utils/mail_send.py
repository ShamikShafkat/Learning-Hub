from fastapi import HTTPException
from starlette.responses import JSONResponse
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr, BaseModel
from typing import List
from dotenv import load_dotenv
import os
import smtplib
from utils.mail_checker import verify_email_address

load_dotenv()

YOUR_GOOGLE_EMAIL = os.getenv("GOOGLE_ACCOUNT")  # The email you setup to send the email using app password
YOUR_GOOGLE_EMAIL_APP_PASSWORD = os.getenv("GOOGLE_ACCOUNT_PASSWORD")  # The app password you generated

async def password_send(email: str, password: str):
        if(not verify_email_address(email)):
                return False
        
        smtpserver = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        smtpserver.ehlo()
        smtpserver.login(YOUR_GOOGLE_EMAIL, YOUR_GOOGLE_EMAIL_APP_PASSWORD)

        # Email subject
        subject = "DNCC Waste Management Account Password"

        # Email body
        email_text = f'Subject: {subject}\n\n'
        email_text += f'Your password for DNCC Waste Management account is {password}. Please log in with this and change with your perferable one.'

        # Send email
        result_dict = smtpserver.sendmail(YOUR_GOOGLE_EMAIL, email, email_text)

        # Close the connection
        smtpserver.close()
        
        
        if len(result_dict.keys())!=0:
                return False
        
        return True
    
async def verification_code_send(email: str, code: str):
        if(not verify_email_address(email)):
                return False
        
        
        smtpserver = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        smtpserver.ehlo()
        smtpserver.login(YOUR_GOOGLE_EMAIL, YOUR_GOOGLE_EMAIL_APP_PASSWORD)

        # Email subject
        subject = "DNCC Waste Management Account Password Reset Code"

        # Email body
        email_text = f'Subject: {subject}\n\n'
        email_text += f'Your code for password reset is {code}. It will expire in 5 minutes.'

        # Send email
        result_dict = smtpserver.sendmail(YOUR_GOOGLE_EMAIL, email, email_text)
        
        # Close the connection
        smtpserver.close()
        
        
        if len(result_dict.keys())!=0:
                return False
        
        return True

async def email_verification_code_send(email: str, code: str):
        # if(not verify_email_address(email)):
        #         return False
        
        
        smtpserver = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        smtpserver.ehlo()
        smtpserver.login(YOUR_GOOGLE_EMAIL, YOUR_GOOGLE_EMAIL_APP_PASSWORD)

        # Email subject
        subject = "LearningHub Email Verification"

        # Email body
        email_text = f'Subject: {subject}\n\n'
        email_text += f'Your code for email verification is {code}. It will expire in 5 minutes.'

        # Send email
        result_dict = smtpserver.sendmail(YOUR_GOOGLE_EMAIL, email, email_text)
        
        # Close the connection
        smtpserver.close()
        
        
        if len(result_dict.keys())!=0:
                return False
        
        return True


async def forget_password_verification_code_send(email: str, code: str):
        if(not verify_email_address(email)):
                return False
        
        
        smtpserver = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        smtpserver.ehlo()
        smtpserver.login(YOUR_GOOGLE_EMAIL, YOUR_GOOGLE_EMAIL_APP_PASSWORD)

        # Email subject
        subject = "LearningHub Password Recovery Code"

        # Email body
        email_text = f'Subject: {subject}\n\n'
        email_text += f'Your code for password reset is {code}. It will expire in 5 minutes.'

        # Send email
        result_dict = smtpserver.sendmail(YOUR_GOOGLE_EMAIL, email, email_text)
        
        # Close the connection
        smtpserver.close()
        
        
        if len(result_dict.keys())!=0:
                return False
        
        return True

    
async def role_assign_confirmation_send(email: str,role_name:str):
        if(not verify_email_address(email)):
                return False
        
        
        
        smtpserver = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        smtpserver.ehlo()
        smtpserver.login(YOUR_GOOGLE_EMAIL, YOUR_GOOGLE_EMAIL_APP_PASSWORD)

        # Email subject
        subject = "DNCC Waste Management Role Assignment"

        # Email body
        email_text = f'Subject: {subject}\n\n'
        email_text += f'You have been assigned role {role_name} in DNCC. Please start working accordingly.'

        # Send email
        result_dict = smtpserver.sendmail(YOUR_GOOGLE_EMAIL, email, email_text)

        # Close the connection
        smtpserver.close()
        
        
        if len(result_dict.keys())!=0:
                return False

        
        return True