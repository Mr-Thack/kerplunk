from users import get_field, set_field
from pydantic import BaseModel
from dataclasses import dataclass, field
from secrets import token_urlsafe
from dblib import db
from fastapi import Request
from asyncio import sleep, CancelledError
from events import events
from datetime import datetime
from json import dumps


class InitConvoData(BaseModel):
    name: str
    public: bool
    chatroom: bool  # Is this a chatroom or a feed?
    pwd: str | None = None



class Convo(BaseModel):
    name: str
    public: bool
    chatroom: bool
    owner: str  # This is a UUID str
    pwd: str | None = None
    users: list[str] = []

    def sanitize(self, mid: int):
        return {
            'name': self.name,
            'mid': mid,
            'public': self.public,
            'chatroom': self.chatroom,
            'owner': get_field(self.owner, 'name'),
            'users': [get_field(user, 'sanitized') for user in self.users]
        }


# This is specifically for an incoming message
@dataclass
class IncMsg():
    text: str
    reply_to: int | None = None


# This is specifically for a message in the db, or something we're sending to the user
@dataclass
class Message():
    author: str
    text: str
    reply_to: int | None = None
    time: str | None = None
    replies: [int] = field(default_factory=list)
    likers: [str] = field(default_factory=list)

    def __post_init__(self):
        if not self.time:
            self.time = datetime.now().isoformat()

    def sanitize(self):
        return {
            'text': self.text,
            'author': self.author if self.author == 'SYSTEM' else get_field(self.author, 'name'),
            'reply_to': self.reply_to,
            'time': self.time,
            'replies': self.replies,
            'likes': len(self.likers)
        }
"""
In the conversation environement, we'll have a subdatabase for each conversation.
This one will hold the info on all the conversations, but not the actualy messages,
because the info will be accessed constantly, whereas the texts aren't.
So, only when required we'll open up the subdb holding the texts.
For simplicity, we'll just call the subdb for each convo by it's convo id (cid)
"""
# Holds cid: Convo
convos = db('ConvosInfo', Convo, conversation=True)
opened_convos: dict = {}


def is_name_taken(name: str) -> bool:
    for (cid, convo) in convos:
        if name == convo.name:
            return True

def list_chat_rooms() -> [str]:
    """List all chat rooms by their display name"""
    return [convo.name for (cid, convo) in convos if convo.chatroom]

def open_convo(cid: str):
    if cid not in opened_convos:
        opened_convos[cid] = db(cid, Message, conversation=True)
    return opened_convos[cid]


def add_convo_to_user_data(uuid: str, cid: str):
    """Add this convo to the user's list"""
    user_convos = get_field(uuid, 'convos')
    if not cid in user_convos:
        user_convos.append(cid)
        set_field(uuid, 'convos', user_convos)
    

def create_convo(data: InitConvoData, owner: str):
    # We take owner as a UUID str
    if not is_name_taken(data.name):
        cid = token_urlsafe(32)
        new_convo = Convo(owner=owner, **data.__dict__)
        convos[cid] = new_convo  # Write info to the db
        convo_data = open_convo(cid)  # Open a fresh new one

        add_convo_to_user_data(owner, cid)
        
        text: str
        if data.chatroom:
            text = f"User {get_field(owner, 'name')} has created chatroom {new_convo.name}!"
        else:
            text = f"Welcome to {new_convo.name}!"
            
        convo_data[0] = Message(text=text, author='SYSTEM')
        return cid


async def add_user_to_convo(uuid: str, name: str, pwd: str | None) -> dict | None:
    cid = None
    for curcid, convo in convos:
        if convo.name == name:
            cid = curcid

    if not cid:
        return

    convo = convos[cid]  # Instead of accessing the dict over and over again, we're gonna do this
    if not convo.pwd or (pwd and convo.pwd == pwd) or convo.owner == uuid:
        # If this UUID isn't recognized
        if uuid not in convo.users:
            
            # Add this convo to the user's list
            add_convo_to_user_data(uuid, cid)
            
            # Add this user to the convo's list
            convo.users.append(uuid)
            convos[cid] = convo  # In the previous line, we only updated our copy in memory
            # This line puts it back into the dict and then the db
            
            name = get_field(uuid, 'name')
            if convo.chatroom:
                msg = Message(text=f"{name} has joined the chat!",
                              author='SYSTEM')
                              # [NOTE]: 'SYSTEM' messages
                await write_msg(cid, msg)  # write to db
        return {
            'cid': cid,
            'owner': get_field(convo.owner, 'name'),
            'users': [get_field(user, 'name') for user in convo.users]
        }


def usr_in_convo(uuid: str, cid: str):
    """Check if user is in given conversation"""
    convo = convos[cid]
    return convo and uuid in convo.users or uuid == convo.owner

def get_convo(uuid: str, cid: str):
    if usr_in_convo(uuid, cid):
        return convos[cid].sanitize()
        

async def write_msg(cid: str, msg: Message) -> bool:
    # TODO: Check for problems in txt msg or smth
    convo = open_convo(cid)


    if not events.does_exist(cid):
        events.add_event(cid)

    if convo and msg:
        id = len(convo)
        convo[id] = msg
        if msg.reply_to:
            replied = convo[msg.reply_to]
            replied.replies.append(id)
            convo[msg.reply_to] = replied
        await events.send_msg(cid, msg)
        # Since indices start at 0, len() will return 1 + the last index
        return True

def like_msg(cid: str, uuid: str, mid: int) -> bool:
    convo = open_convo(cid)

    if convo and usr_in_convo(uuid, cid) and len(convo) > mid:
        likers = convo[mid, 'likers']
        if uuid not in likers:
            likers.append(uuid)
            convo[mid, 'likers'] = likers
            return True


def read_msgs(cid: str, start: int, end: int | None) -> [str]:
    """Read all messages from start index to end index, inclusive."""
    convo = open_convo(cid)
    if end and len(convo) <= end:
        return []  # Since having nothing is nonsensical, this should be interpreted as an error
    return [convo[i].sanitize(i) for i in range(start, len(convo) if not end else 1 + end)]

opencids = {}

async def read_msgs_as_stream(req: Request, cid: str, start: int, end: int | None):
    """Read all the messages from start to end, in a stream"""
    """end=None signifies read forever"""
    # This function should be used on chats.
    # Threads should use long polling.

    
    # Keep track of the number of people reading this
    if not cid in opencids:
        opencids[cid] = 0
    opencids[cid] = opencids[cid] + 1

    convo = open_convo(cid)
    
    if end and end >= len(convo):
        opencids[cid] = opencids[cid] - 1
        return


    event = events.get_event(cid)
    eid = await event.sub()  # Event ID

    # yield all messages from start to end
    for i in range(start, len(convo) if not end else end + 1):
        yield {
            "event": "message",
            "id": i,
            "data": dumps(convo[i].sanitize())
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
    if not len(msg.text) or len(msg.text) > 250:
        return False
    msg = Message(text=msg.text,
                  reply_to=msg.reply_to,
                  author=uuid)
    return await write_msg(cid, msg)   