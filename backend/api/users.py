from dblib import db
from uuid import uuid1
from dataclasses import dataclass


@dataclass
class UserSchema():
    email: str
    fname: str
    lname: str
    schid: int
    student: bool
    photo: str = ""
    accent: str = "red"
    theme: int = 0

# These are things that they shouldn't be able to change easily, or at all
RESTRICTED = ('schid', 'student')

# Eventually hold uuid: email, username, fname+lname, phone#, school, classes, photo
user_data: db = db("UserData", UserSchema)


def is_email_used(email: str) -> bool:
    for uuid, user in user_data:
        if user.email == email:
            return True


def make_user(email: str, fname: str, lname: str, schid: int, student: bool) -> str:
    uuid: str = str(uuid1())
    user_data[uuid] = UserSchema(email, fname, lname, schid, student)
    return uuid


def print_users():
    for (uuid, user) in user_data:
        print(f'UUID: {uuid} and USER: {user}')


def valid_keys(fields: list[str], is_get: bool = False) -> bool:
    # is_get is when we're doing a get operation
    cmp_list = list(UserSchema.__annotations__.keys())
    if is_get:
        cmp_list.append('name')
    
    return set(fields) <= set(cmp_list)


def valid_fields(vals: dict, is_get: bool = False) -> bool:
    """Returns empty string on success, str if failure"""
    # is_get is for telling us whether we are judging for get or not
    if valid_keys(vals, is_get):
        return True


def get_field(uuid: str, field: str):
    if field == "name":
        return user_data[uuid, 'fname'] + ' ' + user_data[uuid, 'lname']
    return user_data[uuid, field]


def set_field(uuid: str, field: str, val) -> bool:
    if field not in RESTRICTED:
        user_data[uuid, field] = val
        return True


def multi_get(uuid: str, fs: list[str]) -> dict:  # Takes fields as "fs"
    r = {}
    for f in fs:
        r[f] = get_field(uuid, f)
    return r


def multi_set(uuid: str, fs: dict) -> str:
    r = []
    for k, v in fs.items():
        set_field(uuid, k, v)
        r.append(k)
    return ' '.join(r)
