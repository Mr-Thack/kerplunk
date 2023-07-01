from dblib import db
from uuid import uuid1
from dataclasses import dataclass, field
from schools import add_person
from PIL import Image
from io import BytesIO
import base64


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
    convos: [str] = field(default_factory=list)

    @property
    def name(self):
        return self.fname + ' ' + self.lname
    
    def sanitize(self):
        return {
            'email': self.email,
            'name': self.name,
            'student': self.student,
            'photo': self.photo
        }

    @property
    def sanitized(self):
        return self.sanitize()

# These are things that they shouldn't be able to change easily, or at all
RESTRICTED = ('schid', 'student')

# Eventually hold uuid: email, username, fname+lname, phone#, school, classes, photo
user_data: db = db("UserData", UserSchema)


def is_email_used(email: str) -> bool:
    for uuid, user in user_data:
        if user.email == email:
            return True

def user_exists(uuuid: str) -> bool:
    for uuid in user_data:
        if uuid == uuuid:
            return True


def make_user(email: str, fname: str, lname: str, schid: int, student: bool) -> str:
    uuid: str = str(uuid1())
    user_data[uuid] = UserSchema(email, fname, lname, schid, student)
    add_person(uuid, schid, student)
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
        if k == "photo":
            img = Image.open(BytesIO(base64.b64decode(v.split(",")[1])))
            img.thumbnail((128,128), Image.Resampling.LANCZOS)
            buffer = BytesIO()
            img.save(buffer,format="png")
            myimage = buffer.getvalue()                     
            v = "data:image/png;base64,"+base64.b64encode(myimage).decode()
        set_field(uuid, k, v)
        r.append(k)
    return ' '.join(r)
