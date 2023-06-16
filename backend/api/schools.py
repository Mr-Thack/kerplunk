from dblib import db
from dataclasses import dataclass
from pydantic import BaseModel

@dataclass
class SchoolSchema():
    name: str
    altnames: list[str]
    email: str
    # Later, we can add support for things like the prinicipals name
    # phone number, country, state, district, and more


# schoolID (int): SchoolSchema
# later on, we might use a UUID instead of just a plain integer
# but we should be fine for the first few thousand schools  
school_data: db = db("SchoolData", SchoolSchema)

def is_email_used(email: str):
    # This is for schools
    for schid, school in school_data:
        if school.email == email:
            return True
    return False

class RegisterData(BaseModel):
    name: str
    altnames: list[str]
    email: str

def register_school(data: RegisterData) -> bool:
    if not is_email_used(data.email):
        schid = len(school_data)  # school id
        school_data[schid] = SchoolSchema(data.name, data.email, data.altnames)
        return True


# The stuff below is specificially for searching for a school when registering

@dataclass
class SchoolSearchInfo():
    name: str
    id: int
    altnames: [str]

def list_all_schools() -> [SchoolSearchInfo]:
    return [SchoolSearchInfo(school.name, schid, school.altnames) for schid, school in school_data]

    