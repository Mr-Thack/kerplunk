from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from random import choices
from string import ascii_letters, digits


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

async def send_email(subject: str, recipient: str, data: dict, template: str):
    msg = MessageSchema(
        subject=subject,
        recipients=[recipient],
        template_body=data,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(msg, template_name=template)

async def send_signup_email(email: str, uname: str, code: str):
    await send_email(
        'Signup for Kerplunk',
        email,
        {
            'username': uname,
            'usercode': code
        },
        'signup.html'
    )

# This is for schools
async def send_register_email(email: str, school_name: str, code: str):
    await send_email(
        'Register for Kerplunk',
        email,
        {
            'school_name': school_name,
            'registration_code': code
        },
        'register.html'
    )


def gen_code(length: int = 12):
    return ''.join(choices(ascii_letters + digits, k=length))

