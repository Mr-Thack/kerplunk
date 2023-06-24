from dblib import db
from dataclasses import dataclass, field
from pydantic import BaseModel
from os import environ
from mail import gen_code, send_register_email


@dataclass
class SchoolSchema():
    name: str
    altnames: list[str]
    email: str
    teachers: [str] = field(default_factory=list)  # Hold their UUIDs
    students: [str] = field(default_factory=list)  # Hold their UUIDs
    # Later, we can add support for things like the prinicipals name
    # phone number, country, state, district, and more
    
    def sanitize(self):
        return {
            "name": self.name,
            "altnames": self.altnames,
            "email": self.email
        }


# schoolID (int): SchoolSchema
# later on, we might use a UUID instead of just a plain integer
# but we should be fine for the first few thousand schools  
school_data: db = db("SchoolData", SchoolSchema, read_json='schools.json')

def get_school(schid: int):
    """This is only for functions in external modules"""
    return school_data.get(schid)

def retrieve_school(schid: int, uuid: str) -> None | SchoolSchema:
    """This is only to be used for the API, not for other modules."""
    if str(schid) in school_data.keys():
        school = school_data[schid]  # This requires 1 less read than using school_data[schid] twice
        if uuid in school.students or uuid in school.teachers:
            return school_data[schid]
        else:
            return school_data[schid].sanitize()

def is_email_used(email: str):
    # This is for schools
    for schid, school in school_data:
        if school.email == email:
            return True
    return False

def is_valid_schid(schid: int):
    return schid < len(school_data)

class RegisterData(BaseModel):
    name: str
    altnames: list[str]
    email: str


waiting_users = {}


async def start_register_school(data: RegisterData) -> str:
    if not is_email_used(data.email):
        code = gen_code()
        waiting_users[code] = data
        await send_register_email(data.email, data.name, code)

        return code

def finish_register_school(code: str) -> bool:
    if code.upper() in waiting_users:
        data = waiting_users[code.upper()]
        
        schid = len(school_data)  # school id
        school_data[schid] = SchoolSchema(data.name, data.email, data.altnames)
        
        del waiting_users[code.upper()]
        return True
    
def add_person(uuid: str, schid: int, is_student: bool):
    """Add a person to a school. Deals with both students and teachers."""
    school = school_data[schid]
    
    if is_student:
        school.students.append(uuid)
    else:
        school.teachers.append(uuid)
    
    school_data[schid] = school
    return True
         

# The stuff below is specificially for searching for a school when registering

@dataclass
class SchoolSearchInfo():
    name: str
    id: int
    altnames: [str]


def list_all_schools() -> [SchoolSearchInfo]:
    return [SchoolSearchInfo(school.name, schid, school.altnames) for schid, school in school_data]
    