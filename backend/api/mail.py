from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from random import choices
from string import ascii_uppercase, ascii_lowercase, digits
from os import environ


isTesting = False  # unittests.py will modify this

conf = ConnectionConfig(
    MAIL_USERNAME    =    "mr_thack",  #"Kerplunk",
    MAIL_PASSWORD    =    "xiblzilspycvevsf",  #"Kerplunk123$School",
    MAIL_FROM        =    "mr_thack@yahoo.com",
    MAIL_PORT        =    "465",
    MAIL_SERVER      =    "smtp.mail.yahoo.com",
    MAIL_FROM_NAME   =    "Kerplunk Team",
    MAIL_STARTTLS    =    False,
    MAIL_SSL_TLS     =    True,
    USE_CREDENTIALS  =    True,
    VALIDATE_CERTS   =    True,
    TEMPLATE_FOLDER  =    "../templates"
)

fm = FastMail(conf)

async def send_email(subject: str, recipient: str, data: dict, template: str):
    headers = {}
    if isTesting:
        headers = data
       
    msg = MessageSchema(
        subject=subject,
        recipients=[recipient],
        template_body=data,
        subtype=MessageType.html,
        headers=headers
    )
    await fm.send_message(msg, template_name=template)

async def send_signup_email(email: str, uname: str, code: str):
    await send_email(
        'Signup for Kerplunk',
        email,
        {
            'uname': uname,
            'code': code
        },
        'signup.html'
    )

# This is for schools
async def send_register_email(email: str, school_name: str, code: str):
    await send_email(
        'Register for Kerplunk',
        email,
        {
            'name': school_name,
            'code': code
        },
        'register.html'
    )

async def send_reset_email(email: str, uname: str, pwd: str, code: str):
    await send_email(
        'Reset Password for Kerplunk',
        email,
        {
            'uname': uname,
            'code': code
        },
        'reset.html'
    )


# The characters o, l, 0, and 1 could be easily confused, so we don't use them 
POSSIBLE_CHARACTERS = ascii_uppercase.replace('L','').replace('I','') + ascii_lowercase.replace('l', '').replace('o', '') + digits.replace('01', '')

def gen_code(length: int = 12):
    return ''.join(choices(POSSIBLE_CHARACTERS, k=length))

