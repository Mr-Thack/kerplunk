from pydantic import BaseModel
from bcrypt import hashpw
from sid import makeSID
from users import make_user, is_email_used, get_field, set_field
from dblib import db
from dataclasses import dataclass
from mail import send_signup_email, send_reset_email, gen_code
from os import environ
from schools import is_valid_schid

@dataclass
class CredsSchema():
    uuid: str
    email: str


creds = db('Credentials', CredsSchema)
"""
creds only holds enough information for authentication.
Actual user data is stored elsewhere
Data is stored as:
ahash: uuid1 + ' ' + email
The ahash is used after the pwd is hashed.
uuid1 is used internally as the user's id
is used so that on login we can check if the email provided is right
It should be noted that UUID1 has one problem. It uses our MAC address.
This could become a privacy concern if we get hacked. However,
I'm using UUID1 because UUID1 also provides a timestamp, which we can later use
in order to retrieve when the user signed up. So basically, if we're already
storing stuff, why don't we just kill 2 birds with 1 stone?
"""

HASH_SALT = b'$2b$12$lDGmZwBbuqU9DYMFxGRWRe'


def uuid_from_email(email: str) -> str:
    for (ahash, user) in creds:
        if user.email == email:
            return user.uuid
    return ''

def email_from_uuid(uuid: str) -> str:
    for (ahash, user) in creds:
        if user.uuid == uuid:
            return user.email
    return ''

# We want a username and a hash of their pwd and email on signup
class SignUpData(BaseModel):
    pwd: str
    email: str
    schid: int
    student: bool
    fname: str
    lname: str

def get_user(ahash: str) -> list[str, str]:
    data = creds[ahash]
    if data:
        return data


def gen_hash(pwd: str) -> str:
    return hashpw(pwd.encode('utf-8'), HASH_SALT).decode('utf-8')


def login_user(email: str, pwd: str, ip: str):
    ahash: str = gen_hash(email + pwd)
    user: CredsSchema = get_user(ahash)
    if user and user.email == email:
        # This won't work when running behind a proxy
        return makeSID(user.uuid, ip)
        # req.client = (client_ip_addr, client_port)


# These users are waiting to be signed up
waiting_users = {}

def set_pwd(email: str, pwd: str, uuid: str):
    # We combine the email and password for security
    ahash: str = gen_hash(email + pwd)
    creds[ahash] = CredsSchema(uuid, email)


async def start_signup_user(data: SignUpData) -> bool:
    if is_valid_schid(data.schid) and not is_email_used(data.email):
        code = gen_code()
        waiting_users[code] = data    
        
        await send_signup_email(data.email, data.fname + ' ' + data.lname, code)
        # This will be continued in finish_signup_user
        
        return True

def finish_signup_user(code: str) -> bool:
    if code.upper() in waiting_users:
        data = waiting_users[code.upper()]

        uuid = make_user(data.email, data.fname, data.lname, data.schid, data.student)
        set_pwd(data.email, data.pwd, uuid)
        
        return True


class ResetData(BaseModel):
    email: str
    pwd: str
    

async def start_reset_pwd(data: ResetData):
    uuid = uuid_from_email(data.email)
    if uuid:
        code = gen_code()
        waiting_users[code] = data
        await send_reset_email(data.email, get_field(uuid, 'name'), code)
        return True

def finish_reset_pwd(code: str):
    if code.upper() in waiting_users:
        data = waiting_users[code.upper()]
        uuid = uuid_from_email(data.email)
        set_pwd(data.email, data.pwd, uuid)
        return True


class UpdatePwdData(BaseModel):
    pwd: str
    new_pwd: str

def update_pwd(data: UpdatePwdData, uuid: str) -> bool:
    email: str = email_from_uuid(uuid)

    # We use get_user with this ahash to see if the current pasword is correct
    ahash: str = gen_hash(email + data.pwd)
    user: CredsSchema = get_user(ahash)
    
    if email and user and user.email == email:
        set_pwd(email, data.new_pwd, uuid)
        return True
