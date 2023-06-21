from fastapi import (Depends, FastAPI, Request, Query, WebSocket,
                     WebSocketException, WebSocketDisconnect, HTTPException)
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from auth import login_user, start_signup_user, finish_signup_user, start_reset_pwd, finish_reset_pwd, email_from_uuid, gen_hash, get_user, set_pwd
from schools import start_register_school, finish_register_school, list_all_schools
from users import multi_get, multi_set, valid_keys, valid_fields
from chats import (list_chats, create_chatroom, InitChatRoomData,
                   usr_in_chatroom, add_user_to_chatroom,
                   on_user_leave_chatroom, join_chatroom_user_event_loop,
                   on_user_join_chatroom)
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

def update_password(pwd: str, new_pwd: str, uuid: str) -> bool:
    email = email_from_uuid(uuid)
    ahash: str = gen_hash(email + pwd)
    user: CredsSchema = get_user(ahash)
    if user and user.email == email:
        set_pwd(email, new_pwd, uuid)
        return True
    else:
        return False

@api.post('/signup')
async def start_signup(fields: dict, success: bool = Depends(start_signup_user)):
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
async def change_password(fields: dict, uuid: str = Depends(oauth_uuid)):
    success: bool = update_password(fields["pwd"], fields["new_pwd"], uuid)
    if success:
        return success
    else:
        raise HTTPException(status_code=401,
                            detail='Incorrect Password')

# Just get a list of all schools
@api.get('/schools')
async def ret_list_schools():
    return {'schools': list_all_schools()}

@api.post('/login')
async def login(req: Request, fd: OAuth2PasswordRequestForm = Depends()):
    token = login_user(fd.username, fd.password, req.client.host)
    if not token:
        raise HTTPException(status_code=401,
                            detail='Incorrect username or password')
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



# We'll only be using this for chat room, God willing,
# So, it's OK to integrate both token authentication
# and authentication for if the given UUID is allowed in a certain chat_room
# To get permission to be allowed, they'll have to PATCH /chats
async def ws_uuid(ws: WebSocket, cid: str, token: str):
    uuid = SIDValidity(token, ws.client.host)
    if not uuid or not usr_in_chatroom(uuid, cid):
        raise WebSocketException(code=1008)
    return (cid, uuid)


@api.websocket('/chats/{cid}')
async def tmpchatroom(ws: WebSocket, cid_uuid=Depends(ws_uuid)):
    (cid, uuid) = cid_uuid  # Tried putting (cid, uuid) in params; won't work?
    await on_user_join_chatroom(cid, uuid, ws)
    try:
        try:
            while True:
                await join_chatroom_user_event_loop(uuid, cid)
        except WebSocketDisconnect:
            await on_user_leave_chatroom(uuid, cid)
    except e:
        print(e)


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
