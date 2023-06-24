#!/usr/bin/python3
import unittest
from dataclasses import dataclass, field
import mail
from shutil import rmtree
from os import mkdir
from starlette.testclient import TestClient, WebSocketTestSession as WebSocket
from main import app



# Test User Fields supported by backend
supported_fields = ('schid', 'fname', 'lname', 'photo', 'email', 'student', 'accent', 'theme')

@dataclass
class User:
    fname: str
    lname: str
    photo: str
    schid: int
    pwd: str
    student: bool
    email: str
    accent: str
    theme: int
    sid: str = None
    chat_log: [str] = None
    # Current copy of chatlog, we test if is same in each joined user

    def name(self) -> str:
        return self.fname + ' ' + self.lname


@dataclass
class Convo:
    name: str
    chatroom: bool = True
    pwd: str = ''
    cid: str = ''
    owner: str = ''
    participants: list = field(default_factory=lambda: [])


@dataclass
class School:
    name: str
    email: str
    altnames: [str]

user1: User = User('FName1', 'LName1','', 0, 'password1', False, 'test1@test.com', "red", 0)
# alt vals is used in Test02-test110
# Whenever supported_fields is updated,
# this should also be updated (On New Features)
altvals = {
    'schid': 1,
    'pwd': "AltPassword"
}

# This is a second user
user2: User = User('FName2', 'LName2','', 0, 'password2', True, 'test2@test.com', "green", 1)
users = (user1, user2)
school1: School = School('Test School', 'contacts@test.org', ['tst', 'schl'])
schools = (school1,)
convo1: Convo = Convo('Testing')
convos = (convo1, )


def genhed(user: User):
    return {
        'Authorization': 'Bearer ' + user.sid
    }


def signup_user(user: User):
    r = []
    with mail.fm.record_messages() as outbox:                        
        r.append(client.post('/api/signup', json={
            'fname': user.fname,
            'lname': user.lname,
            'student': user.student,
            'pwd': user.pwd,
            'email': user.email,
            'schid': user.schid
        }))
        # [BUG] [NOTE]
        # It might complain about an incorrect email
        # when you actually have an incorrect schid
        if not len(outbox):
            return r
        code = dict(outbox[-1]._headers)['code']
        r.append(client.get('/api/signup', params={
            'code': code
        }))
    return r
        


def get_user_sid(user: User):
    con = {
        'grant_type': '',
        # We sign in with email, bcz that doesn't change often
        'username': user.email,
        'password': user.pwd,
        'scope': '',
        'client_id': '',
        'client_secret': ''
    }
    r = client.post('/api/login', data=con).json()
    return r['access_token']

def join_convo(user: User, convo: Convo):
    return client.patch('/api/convos', params={
        'name': convo.name
    }, headers=genhed(user))

def get_msgs(user: User, convo: Convo):
    baseuri = f'/api/convos/{convo.cid}'
    user.chat_log = client.get(baseuri, params={
        'start': 0
    }, headers=genhed(user)).json()

def post_msg(user: User, convo: Convo, msg: str, reply_to: int = None):
    baseuri = f'/api/convos/{convo.cid}'
    resp = client.post(baseuri, json={
        'text': msg,
        'reply_to': reply_to
    }, headers=genhed(user))
    return resp


class Test005_schools(unittest.TestCase):
    def test010_make_school(self):
        result = client.get('/api/schools')
        self.no_of_schools = len(result.json()['schools'])
        with mail.fm.record_messages() as outbox:
            result = client.post('/api/register', json={
                'name': school1.name,
                'altnames': school1.altnames,
                'email': school1.email
            })
            self.assertEqual(result.status_code, 200)
            self.assertEqual(len(outbox), 1)
            
            code = dict(outbox[-1]._headers)['code']
            result = client.get('/api/register', params={
                'code': code
            })

            self.assertEqual(result.status_code, 200)

    def test020_get_schools(self):
        result = client.get('/api/schools')
        self.assertEqual(len(result.json()['schools']), self.no_of_schools+1)
        self.assertEqual(result.status_code, 200)


class Test010_auth(unittest.TestCase):
    def test010_make_user(self):
        """Sign up test user"""
        rez = signup_user(user1)
        self.assertEqual(len(rez), 2)  # We want 2 entries
        for r in rez:
            self.assertEqual(r.status_code, 200)
        
    def test015_test_used_email(self):
        """Test against used email being signed up for"""
        rez = signup_user(user1)
        self.assertEqual(len(rez), 1)  # We want the 2nd to fail since we're giving it bad data
        for r in rez:
            self.assertNotEqual(r.status_code, 200)

    def test020_get_sid(self):
        """
        Generate an SID, Must be done after we
        get the salt in test020_get_salt above
        """
        sid = get_user_sid(user1)
        self.assertIsNotNone(sid)
        user1.sid = sid

    def test030_login_second_user(self):
        signup_user(user2)
        sid = get_user_sid(user2)
        self.assertIsNotNone(sid)
        user2.sid = sid

    def test100_reset_password(self):
        """Now, we'll try to reset the 1st users's password """
        with mail.fm.record_messages() as outbox:                        
            r1 = client.post('/api/reset', json={
                'pwd': altvals['pwd'],
                'email': user1.email,
            })
            self.assertEqual(r1.status_code, 200)
            
            if not len(outbox):
                return r
            
            code = dict(outbox[-1]._headers)['code']
            r2 = client.get('/api/reset', params={
                'code': code
            })

            self.assertEqual(r2.status_code, 200)
            user1.pwd = altvals['pwd']

class Test020_User_Data(unittest.TestCase):
    def test010_get_lastname(self):
        """Check if test user's last name is correctly registered"""
        r = client.get('/api/userme', params={
            'fields': ['lname']
            }, headers=genhed(user1)).json()
        self.assertIn('lname', r)
        self.assertEqual(r['lname'], user1.lname)

    def test020_get_fullname(self):
        """See if the user's full name is properly returned"""
        r = client.get('/api/userme', params={'fields': 'name'},
                        headers=genhed(user1)).json()
        self.assertIn('name', r)
        self.assertEqual(r['name'], user1.name())

    # Need another school first
    #def test030_set_schid(self):
    #    """See if the users's schid can be modified"""
    #    r = client.post('/api/userme', json={'schid': altvals['schid']})
        
    def test100_multiget(self, key=user1, auth_user=user1):
        """
        Check if getting all values at once works.
        The key is what will be used as benchmark for the returned values.
        test120_check_multipost will set key to altvals
        """
        # We need key to be a dictionary, eventually
        if isinstance(key, User):
            key = key.__dict__
        r = client.get('/api/userme', params={
            'fields': supported_fields
            }, headers=genhed(auth_user)).json()
        for f in supported_fields:
            # Class.__dict__ is a quick way to get it done, apparently
            self.assertEqual(r[f], key[f])

    #def test110_multipost(self):
    #    """Change all values"""
    #    r = client.post('/api/userme', json=altvals, headers=genhed(user1)).json()
    #    self.assertIn('changed', r)
    #    self.assertSetEqual(set(supported_fields),
    #                        set(r['changed'].split(' ')))

    # There's nothing to change but schid
    #def test120_check_multiget(self):
    #    """Check if all new values are properly set, after 110_multipost"""
    #    self.test100_multiget(key=altvals)
    #    user1.fname = altvals['fname']
    #    user1.lname = altvals['lname']


class Test030_Convos(unittest.TestCase):
    def test010_open__chat_room(self):
        """Check if API can create chat rooms"""
        chat: Convo = convos[0]
        js = {
            'name': chat.name,
            'pwd': chat.pwd,
            'chatroom': chat.chatroom,
            'public': True
        }
        r = client.post('/api/convos', json=js, headers=genhed(user1)).json()
        self.assertIn('cid', r)
        chat.cid = r['cid']

    def test020_list_chat_rooms(self):
        """Check if API returns correct list of chat rooms"""
        # No SID required because this doesn't really need authentication
        # And no parameters required
        r = client.get('/api/chats').json()
        self.assertEqual(r['chatrooms'], [convos[0].name])

    def test030_first_user_join_chat(self):
        """Check what data is being given back from the
        first time a user joins the chat"""
        chat: Convo = convos[0]
        r = join_convo(user1, chat)
        self.assertEqual(r.status_code, 200)

        r = r.json()
        self.assertEqual(r['owner'], user1.name())
        self.assertEqual(r['cid'], chat.cid)
        self.assertListEqual(r['users'], [user1.name()])
        chat.owner = r['owner']
        chat.pwd = ''
        # Now we'll connect to the websocket port and get our messages so far
        # join_wschat(user1, chat)
        # self.assertTrue(user1.chat_log)

    def test040_1st_user_send_msg(self):
        """Check sending & recieving message"""
        chat = convos[0]
        baseuri = f'/api/convos/{chat.cid}'
        msg = 'Hello from owner!'
        
        get_msgs(user1, chat)
        self.assertTrue(user1.chat_log)
        self.assertIsInstance(user1.chat_log, list)
        
        resp = post_msg(user1, chat, msg)    
        self.assertEqual(resp.status_code, 200)

    
    def test050_2nd_user_join_chat(self):
        """Check if users other than the owner can join"""
        chat: Chat = convos[0]
        r = join_convo(user2, chat).json()
        self.assertEqual(r['users'], [user1.name(), user2.name()])

    def test060_2nd_user_send_and_recv_msg(self):
        """Check if 2nd user has received the 1st msg, and sending a 2nd"""
        chat = convos[0]
        msg = 'Hello Back!'
        get_msgs(user2, chat)
        # User1's chat log should have everything except the last 2  messages ("Hello from owner" and "User2 Joined Chat")
        self.assertListEqual(user1.chat_log, user2.chat_log[:-2])
        resp = post_msg(user2, chat, msg)
        self.assertTrue(resp.json())

        # Now, they should be the same, excluding the final message
        get_msgs(user1, chat)
        self.assertListEqual(user1.chat_log[:-1], user2.chat_log)


# Clear data directory
print("Clearing Data")
rmtree('../data/')
mkdir('../data/')
    
mail.isTesting = True
mail.fm.config.SUPPRESS_SEND = 1

client = TestClient(app)

unittest.main()
