from users import get_field
from pydantic import BaseModel
from dataclasses import dataclass, field
from secrets import token_urlsafe
from dblib import db
from fastapi import Request
from asyncio import sleep, CancelledError
from events import events
from datetime import datetime
from json import dumps

class InitChatRoomData(BaseModel):
    name: str
    public: bool
    pwd: str | None = None


class ChatRoom(InitChatRoomData):
    owner: str  # This is a UUID str
    cid: str
    chatters: list[str] = []


# This is specifically for an incoming message
@dataclass
class IncMsg():
    text: str
    reply_to: int | None = None


# This is specifically for a message in the db, or something we're sending to the user
@dataclass
class Message():
    text: str
    author: str
    reply_to: int | None = None
    time: str | None = None

    def __post_init__(self):
        if not self.time:
            self.time = datetime.now().isoformat()

    def sanitize(self):
        return {
            'text': self.text,
            'author': self.author if self.author == 'SYSTEM' else get_field(self.author, 'name'),
            'reply_to': self.reply_to,
            'time': self.time
        }
"""
In the chatroom environement, we'll have a subdatabase for each chat.
This one will hold the info on all the chatrooms, but not the actualy texts,
because the info will be accessed constantly, whereas the texts aren't.
So, only when required we'll open up the subdb holding the texts.
For simplicity, we'll just call the subdb for each chat by it's chat id (cid)
"""
chats = db('ChatRoomsInfo', ChatRoom, chat=True)
opened_chats: dict = {}


def is_chat_name_taken(name: str):
    return True if name in [chat.name for (cid, chat) in chats] else False


def list_chats() -> str:
    """List all chats by their display name"""
    return [chat.name for (cid, chat) in chats]


def open_chat(cid: str):
    if cid not in opened_chats.keys():
        opened_chats[cid] = db(cid, Message, chat=True)
    return opened_chats[cid]


def create_chatroom(data: InitChatRoomData, owner: str):
    # We take owner as a UUID str
    if not is_chat_name_taken(data.name):
        cid = token_urlsafe(32)
        new_chatrm = ChatRoom(cid=cid,
                              owner=owner, **data.__dict__)
        chats[new_chatrm.cid] = new_chatrm  # Write info to the db
        chat_data = open_chat(cid)  # Open a fresh new one
        chat_data[0] = Message(text=f"User {get_field(owner, 'name')} has created chatroom {new_chatrm.name}!", author='SYSTEM')
        return new_chatrm.cid


async def add_user_to_chatroom(uuid: str, name: str, pwd: str | None) -> dict | None:
    cid = None
    for curcid, chat in chats:
        if chat.name == name:
            cid = curcid
      
    if not cid:
        return

    chat = chats[cid]  # Instead of accessing the dict over and over again, we're gonna do this
    if not chat.pwd or (pwd and chat.pwd == pwd):
        # If this UUID isn't recognized
        if uuid not in chat.chatters:
            chat.chatters.append(uuid)
            chats[cid] = chat  # In the previous line, we only updated our copy in memory
            # This line puts it back into the dict and then the db
            
            name = get_field(uuid, 'name')
            msg = Message(text=f"{name} has joined the chat!",
                          author='SYSTEM')
                          # [NOTE]: 'SYSTEM' messages
            write_msg(cid, msg)  # write to db
        # We return it in the human friendly version, with name instead of their UUID
        # Later, we might have to return more information
        return {
            'cid': cid,
            'owner': get_field(chats[cid].owner, 'name'),
            'chatters': [get_field(chatter, 'name') for chatter in chats[cid].chatters]
        }


def usr_in_chatroom(uuid: str, cid: str):
    """Check if user is in given chatroom"""
    chat = chats[cid]
    return chat and uuid in chat.chatters


# We'll take the user's uuid, the msg, and chatroom
def write_msg(cid: str, msg: Message):
    # TODO: Check for problems in txt msg or smth
    chat = open_chat(cid)

    if msg:
        chat[len(chat)] = msg
        # Since indices start at 0, len() will return 1 + the last index
        return True


def read_msgs(cid: str, start: int, end: int | None) -> [str]:
    """Read all messages from start index to end index, inclusive."""
    chat = open_chat(cid)
    if end and len(chat) <= end:
        return []  # Since having nothing is nonsensical, this is an error
    return [chat[i].sanitize() for i in range(start, len(chat) if not end else 1 + end)]

opencids = {}

async def read_msgs_as_stream(req: Request, cid: str, start: int, end: int | None):
    """Read all the messages from start to end, in a stream"""
    """end=None signifies read forever"""
    # This function could probably be cleaned up a bit

    
    # Keep track of the number of people reading this
    if not cid in opencids:
        opencids[cid] = 0
    opencids[cid] = opencids[cid] + 1

    chat = open_chat(cid)
    
    if end and end >= len(chat):
        opencids[cid] = opencids[cid] - 1
        return


    event = events.get_event(cid)
    eid = await event.sub()  # Event ID

    # yield all messages from start to end
    for i in range(start, len(chat) if not end else end + 1):
        yield {
            "event": "message",
            "id": i,
            "data": dumps(chat[i].sanitize())
        }

    # If there was a definite end, quit
    if end:
        print("END")
        event.unsub(eid)
        opencids[cid] = opencids[cid] - 1
        return
    
    while True:
        msg = await event.get(eid)
        yield {
            "event": "message",
            "data": dumps(msg.sanitize())
        }
            
    event.unsub(eid)
    opencids[cid] = opencids[cid] - 1

async def post_msg(cid: str, uuid: str, msg: IncMsg) -> bool:
    if not events.does_exist(cid):
        events.add_event(cid)
    msg = Message(text=msg.text,
                  reply_to=msg.reply_to,
                  author=uuid)
    await events.send_msg(cid, msg)
    return write_msg(cid, msg)
