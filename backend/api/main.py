from fastapi import Depends, FastAPI, Request, Query, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, FileResponse
from sse_starlette.sse import EventSourceResponse

from auth import (login_user, start_signup_user, finish_signup_user,
                  start_reset_pwd, finish_reset_pwd, UpdatePwdData, update_pwd)
from schools import (start_register_school, finish_register_school,
                     list_all_schools, retrieve_school)
from users import multi_get, multi_set, valid_keys, valid_fields
from conversations import (list_chat_rooms, create_convo, InitConvoData,
                           usr_in_convo, add_user_to_chatroom,
                           add_user_to_classroom, read_msgs, post_msg, IncMsg,
                           read_msgs_as_stream, get_convo, set_convo,
                           delete_convo, like_msg,
                           read_notifications_as_stream)
from sid import SIDValidity
from os import path, environ
from poll import get_questions, write_resp, get_poll_results
from typing import List
from etc import PrettyJSONResponse

# Tell us that we're on production
is_production = environ.get('ISPRODUCTION') in ("true", "True", "TRUE")
print("You " + ("ARE" if is_production else "are NOT") + " on production!")

api = FastAPI(title='api')
if is_production:
    @api.get('/')
    def go_back_to_where_you_came_from():
        return RedirectResponse('https://kerplunk.xyz')

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')


def oauth_uuid(req: Request, token: str = Depends(oauth2_scheme)):
    """Check if logged in for HTTP"""
    uuid = SIDValidity(token, req.client.host)
    if uuid:
        return uuid
    else:
        raise HTTPException(status_code=401, detail='Token Invalid/Expired')


def url_uuid(req: Request, token: str):
    """Check if logged (HTTP) but using query params over headers in OAuth"""
    uuid = SIDValidity(token, req.client.host)
    if uuid:
        return uuid
    else:
        raise HTTPException(status_code=401, detail='Token Invalid/Expired')


@api.post('/signup')
async def start_signup(code: str = Depends(start_signup_user)):
    if code:
        if not is_production:
            print("Signup code is:", code)
        return True
    else:
        raise HTTPException(status_code=401,
                            detail='Email already in use!')


@api.get('/signup')
def finish_signup(success: bool = Depends(finish_signup_user)):
    if success:
        return success
    else:
        raise HTTPException(status_code=401,
                            detail='Code Not Found')


# This is registration for schools
@api.post('/register')
async def register(code: str = Depends(start_register_school)):
    if code:
        if not is_production:
            print('Register code is:', code)
        return True
    else:
        raise HTTPException(status_code=401,
                            detail='Email already in use!')


@api.get('/register')
def finish_register(success: bool = Depends(finish_register_school)):
    if success:
        return success
    else:
        raise HTTPException(status_code=401,
                            detail='Code Not Found')


@api.post('/reset')
async def start_reset_password(code: str = Depends(start_reset_pwd)):
    if code:
        if not is_production:
            print("Reset code is:", code)
        return True
    else:
        raise HTTPException(status_code=401,
                            detail='Email Not Found')


@api.get('/reset')
async def finish_reset_password(success: bool = Depends(finish_reset_pwd)):
    if success:
        return success
    else:
        raise HTTPException(status_code=401,
                            detail='Invalid Reset Code')


@api.post('/update_pwd')
def update_password(data: UpdatePwdData, uuid: str = Depends(oauth_uuid)):
    success: bool = update_pwd(data, uuid)
    if success:
        return success
    else:
        raise HTTPException(status_code=401,
                            detail='Incorrect Password')


# Get a list of all schools
@api.get('/schools')
async def ret_list_schools():
    return {'schools': list_all_schools()}


# Get a specific school
@api.get('/schools/{schid}')
def retrive_a_school(schid: int, uuid=Depends(oauth_uuid)):
    school = retrieve_school(schid, uuid)
    if school:
        return school
    else:
        raise HTTPException(status_code=401,
                            detail='Not in this school or not logged in.')


@api.post('/login')
async def login(req: Request, fd: OAuth2PasswordRequestForm = Depends()):
    token = login_user(fd.username.lower(), fd.password, req.client.host)
    if not token:
        raise HTTPException(status_code=401,
                            detail='Incorrect email or password')
    return {'access_token': token, 'token_type': 'bearer'}


@api.get('/userme')
async def user_get_field(uuid: str = Depends(oauth_uuid),
                         fields: list[str] = Query()):
    if not valid_keys(fields, True):
        raise HTTPException(status_code=400, detail='Invalid Fields')
    return multi_get(uuid, fields)


@api.post('/userme')
async def user_set_field(fields: dict, uuid: str = Depends(oauth_uuid)):
    if not valid_fields(fields):
        raise HTTPException(status_code=400, detail='Invalid Fields')
    return {'changed': multi_set(uuid, fields)}


@api.get('/chats')
async def return_a_list_of_chatrooms():
    return {'chatrooms': list_chat_rooms()}


@api.get('/convos/{cid}/info')
def get_conversation(cid: str, uuid: str = Depends(oauth_uuid)):
    """Get Information about a conversation"""
    convo = get_convo(uuid, cid)
    if convo:
        return convo
    else:
        raise HTTPException(status_code=400,
                            detail="CID doesn't exist or not in the convo.")


@api.post('/convos/{cid}/info')
def set_conversation_info(cid: str, fields: dict,
                          uuid: str = Depends(oauth_uuid)):
    convo = set_convo(uuid, fields, cid)
    if convo:
        return convo
    else:
        raise HTTPException(status_code=400,
                            detail="CID doesn't exist or not in the convo.")


@api.post('/convos')
async def open_conversation(data: InitConvoData,
                            uuid: str = Depends(oauth_uuid)):
    success = create_convo(data, uuid)
    if success:
        return True
    else:
        raise HTTPException(status_code=400, detail='Name already in use.')


# If we join a chatroom, we need both name and pwd (or no pwd if no pwd)
@api.patch('/chats')
async def user_join_chatroom(name: str, pwd: str | None = None,
                             uuid: str = Depends(oauth_uuid)):
    data = await add_user_to_chatroom(uuid, name, pwd)
    if data:
        return data
    else:
        raise HTTPException(status_code=403,
                            detail='Invalid conversation name or pwd')


# If we join a chatroom, we need both name and pwd (or no pwd if no pwd)
@api.patch('/classes')
async def user_join_classroom(code: str | None = None,
                              uuid: str = Depends(oauth_uuid)):
    data = await add_user_to_classroom(uuid, code.upper())
    if data:
        return data
    else:
        raise HTTPException(status_code=403,
                            detail='Invalid conversation name or pwd')


async def convoids(req: Request, cid: str, uuid=Depends(oauth_uuid)):
    """Get Convo ID and UUID from Path Params and Headers"""
    if not uuid or not usr_in_convo(uuid, cid):
        raise HTTPException(status_code=403,
                            detail='Invalid token or CID')
    return (cid, uuid)


async def convoids_url(req: Request, cid: str, uuid=Depends(url_uuid)):
    """Get Convo ID and UUID from Query and Path Params"""
    if not uuid or not usr_in_convo(uuid, cid):
        raise HTTPException(status_code=403,
                            detail='Invalid token or CID')
    return (cid, uuid)


@api.get('/convos/{cid}')
def get_new_text_messages(start: int,
                          end: int = None,
                          cid_uuid=Depends(convoids)):
    (cid, uuid) = cid_uuid  # Tried putting (cid, uuid) in params; won't work?
    r = read_msgs(cid, uuid, start)
    if not len(r):
        raise HTTPException(status_code=403,
                            detail='ERROR! The end index is probably too high')
    else:
        return r


@api.post('/convos/{cid}')
async def post_message(msg: IncMsg, cid_uuid=Depends(convoids)):
    (cid, uuid) = cid_uuid
    return await post_msg(cid, uuid, msg)


@api.get('/convos/{cid}/delete')
async def delete_conversation(cid_uuid=Depends(convoids)):
    (cid, uuid) = cid_uuid
    return delete_convo(cid)


@api.patch('/convos/{cid}/{mid}')
def like_message(mid: int, cid_uuid=Depends(convoids)):
    (cid, uuid) = cid_uuid
    return like_msg(cid, uuid, mid)


@api.get('/stream_convos/{cid}')
async def get_messages_from_stream(req: Request,
                                   start: int | None,
                                   cid_uuid=Depends(convoids_url)):
    """If there is no start, it will read from last read message"""
    (cid, uuid) = cid_uuid
    return EventSourceResponse(read_msgs_as_stream(req, cid, uuid, start))


@api.get('/notifications')
async def get_notifications_from_stream(req: Request, uuid=Depends(url_uuid)):
    return EventSourceResponse(read_notifications_as_stream(req, uuid))


@api.get('/poll')
def return_questions():
    return {'questions': get_questions()}


@api.post('/poll')
def write_response(rz: List[int]):
    write_resp(rz)


@api.get('/results-file')
def return_results_file():
    return FileResponse("../data/poll.csv")


@api.get('/results', response_class=PrettyJSONResponse)
def return_results():
    return get_poll_results()


app = api if is_production else FastAPI(title='main')
# Enable Cross Origin Resource Sharing,
# Since we don't have a domain and the IP keeps shifting,
# We need this
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

if not is_production:
    app.mount('/api/', api)

    # Static frontend files
    STATICDIR = '../../kerplunk-frontend'
    # User could've renamed it to 'frontend' due to old system
    if not path.isdir(STATICDIR):
        STATICDIR = '../../frontend'

    STATICDIR = STATICDIR + "/build"

    # Check if this exists
    if not path.isdir(STATICDIR):
        print('WARNING!')
        print("THIS IS ONLY HARMLESS IN DEVELOPMENT!")
        print("Run \"cd ../../frontend; npm run build\" in the terminal!")
        print("YOU ARE MISSING COMPILED FRONTEND CODE.")
    else:
        app.mount('/', StaticFiles(directory=STATICDIR,
                                   html=True), 'ui')
