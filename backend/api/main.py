from fastapi import (Depends, FastAPI, Request, Query, WebSocket,
                     WebSocketException, WebSocketDisconnect, HTTPException)
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware


from auth import (login_user, start_signup_user, finish_signup_user,
                  start_reset_pwd, finish_reset_pwd, UpdatePwdData, update_pwd)
from schools import start_register_school, finish_register_school, list_all_schools
from users import multi_get, multi_set, valid_keys, valid_fields
from chats import (list_chats, create_chatroom, InitChatRoomData,
                   usr_in_chatroom, add_user_to_chatroom, read_msgs, post_msg,
                   IncMsg, read_msgs_as_stream)
from sse_starlette.sse import EventSourceResponse
from sid import SIDValidity
from os import path


api = FastAPI(title='api')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')


def oauth_uuid(req: Request, token: str = Depends(oauth2_scheme)):
    """Check if logged in for HTTP"""
    uuid = SIDValidity(token, req.client.host)
    if uuid:
        return uuid
    else:
        raise HTTPException(status_code=401, detail='Token Invalid/Expired')

def url_uuid(req: Request, token: str):
    """Check if logged in for HTTP, but using query params over headers in OAuth"""
    uuid = SIDValidity(token, req.client.host)
    if uuid:
        return uuid
    else:
        raise HTTPException(status_code=401, detail='Token Invalid/Expired')

@api.post('/signup')
async def start_signup(success: bool = Depends(start_signup_user)):
    if success:
        return success
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


@api.get('/register')
def finish_register(success: bool = Depends(finish_register_school)):
    if success:
        return success
    else:
        raise HTTPException(status_code=401,
                            detail='Code Not Found')


# This is registration for schools
@api.post('/register')
async def register(success: bool = Depends(start_register_school)):
    if success:
        return success
    else:
        raise HTTPException(status_code=401,
                            detail='Email already in use!')

@api.post('/reset')
async def start_reset_password(success: bool = Depends(start_reset_pwd)):
    if success:
        return success
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
def retrive_a_school(schid: int, uuid = Depends(oauth_uuid)):
    school = retrieve_school(schid, uuid)
    if school:
        return school
    else:
        raise HTTPException(status_code=401,
                            detail='You are not from this school or are not logged in.')

@api.post('/login')
async def login(req: Request, fd: OAuth2PasswordRequestForm = Depends()):
    token = login_user(fd.username, fd.password, req.client.host)
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
async def ret_list_chats():
    return {'chatrooms': list_chats()}


@api.post('/chats')
async def open_chatroom(room_data: InitChatRoomData,
                        uuid: str = Depends(oauth_uuid)):
    cid = create_chatroom(room_data, uuid)
    if cid:
        return {'cid': cid}
    else:
        raise HTTPException(status_code=400, detail='Chatroom name in use')


@api.patch('/chats')
async def user_join_chatroom(name: str, pwd: str | None = None,
                             uuid: str = Depends(oauth_uuid)):
    room_data = await add_user_to_chatroom(uuid, name, pwd)
    if room_data:
        return room_data
    else:
        raise HTTPException(status_code=403,
                            detail='Invalid chatroom name or pwd')



async def chatids(req: Request, cid: str, uuid = Depends(oauth_uuid)):
    """Get Chat ID and UUID from Query and Path Params"""
    if not uuid or not usr_in_chatroom(uuid, cid):
        raise HTTPException(status_code=403,
                            detail='Invalid token or CID')
    return (cid, uuid)



async def chatids_url(req: Request, cid: str, uuid = Depends(url_uuid)):
    """Get Chat ID and UUID from Query and Path Params"""
    if not uuid or not usr_in_chatroom(uuid, cid):
        raise HTTPException(status_code=403,
                            detail='Invalid token or CID')
    return (cid, uuid)


@api.get('/chats/{cid}')
def get_new_text_messages(start: int,
                          end: int = None,
                          cid_uuid=Depends(chatids)):
    (cid, uuid) = cid_uuid  # Tried putting (cid, uuid) in params; won't work?
    r = read_msgs(cid, start, end)
    if not len(r):
        raise HTTPException(status_code=403,
                            detail='The end index is probably too high')
    else:
        return r

    
@api.post('/chats/{cid}')
async def post_message(msg: IncMsg, cid_uuid=Depends(chatids)):
    (cid, uuid) = cid_uuid
    return await post_msg(cid, uuid, msg)


@api.get('/streamchats/{cid}')
async def get_messages_from_stream(req: Request,
                             start: int,
                             end: int = None,
                             cid_uuid=Depends(chatids_url)):
    (cid, uuid) = cid_uuid  # Tried putting (cid, uuid) in params; won't work?
    return EventSourceResponse(read_msgs_as_stream(req, cid, start, end)) #, media_type="text/event-stream")


app = FastAPI(title='main')
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
