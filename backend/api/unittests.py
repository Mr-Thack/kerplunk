#!/usr/bin/python3
import unittest
from dataclasses import dataclass, field
import mail
from shutil import rmtree
from os import mkdir
from starlette.testclient import TestClient, WebSocketTestSession as WebSocket
from main import app



# Test User Fields supported by backend
supported_fields = ('uname', 'lname')

@dataclass
class User:
    uname: str
    pwd: str
    email: str
    sid: str
    lname: str
    ws: WebSocket = None
    chat_log: [str] = None
    # Current copy of chatlog, we test if is same in each joined user


@dataclass
class Chat:
    name: str
    pwd: str = ''
    cid: str = ''
    owner: str = ''
    participants: list = field(default_factory=lambda: [])


user1: User = User('test', 'abcd', 'test@test.com', '', 'Newton,Newtonson')
# alt vals is used in Test02-test110
# Whenever supported_fields is updated,
# this should also be updated (On New Features)
altvals = {
    'uname': 'tester',
    'lname': 'Norm,Normski'
}

# This is a second user
user2: User = User('test2', 'seconduser', 'test2@test.com', '', 'Slepy,Sleper')
users = (user1, user2)
chat1: Chat = Chat('Testing')
chat_rooms = (chat1, )


def genhed(user: User):
    return {
        'Authorization': 'Bearer ' + user.sid
    }


def signup_user(user: User):
    r = []
    with mail.fm.record_messages() as outbox:                        
        r.append(client.post('/api/signup', json={
            'uname': user.uname,
            'pwd': user.pwd,
            'email': user.email,
            'schid': 0
        }))
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
    return client.post('/api/login', data=con).json()['access_token']


class Test005_schools(unittest.TestCase):
    def test010_make_school(self):
        with mail.fm.record_messages() as outbox:
            result = client.post('/api/register', json={
                'name': 'Test School',
                'altnames': ['tst', 'schl'],
                'email': 'test@school.org'
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
        self.assertEqual(len(result.json()['schools']), 1)
        self.assertEqual(result.status_code, 200)


class Test010_auth(unittest.TestCase):
    def test010_make_user(self):
        """Sign up test user"""
        rez = signup_user(user1)
        self.assertEqual(len(rez), 2)  # We want 2 entries
        for r in rez:
            self.assertEqual(r.status_code, 200)
        
    def test015_test_username(self):
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


class Test020_User_Data(unittest.TestCase):
    def test010_get_username(self):
        """Check if test user's username is correctly registered"""
        r = client.get('/api/userme', params={
            'fields': ['uname']
            }, headers=genhed(user1)).json()
        self.assertIn('uname', r)
        self.assertEqual(r['uname'], user1.uname)

    def test020_set_legalname(self):
        """Set lname value in db"""
        r = client.post('/api/userme', json={'lname': user1.lname},
                        headers=genhed(user1)).json()
        self.assertIn('changed', r)
        self.assertEqual(r['changed'], 'lname')

    def test030_get_legalname(self):
        """Check if lname value in db is correct"""
        r = client.get('/api/userme', params={
            'fields': 'lname'
            }, headers=genhed(user1)).json()
        self.assertEqual(r['lname'], user1.lname)

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

    def test110_multipost(self):
        """Change all values"""
        r = client.post('/api/userme', json=altvals, headers=genhed(user1)).json()
        self.assertIn('changed', r)
        self.assertSetEqual(set(supported_fields),
                            set(r['changed'].split(' ')))

    def test120_check_multipost(self):
        """Check if all new values are properly set, after 110_multipost"""
        self.test100_multiget(key=altvals)
        user1.uname = altvals['uname']
        user1.lname = altvals['lname']


class Test030_Chat_Rooms(unittest.TestCase):
    def test010_open_chat_room(self):
        """Check if API can create chat rooms"""
        chat: Chat = chat_rooms[0]
        js = {
            'name': chat.name,
            'pwd': chat.pwd,
            'public': True,
            'temp': True
        }
        r = client.post('/api/chats', json=js, headers=genhed(user1)).json()
        self.assertIn('cid', r)
        chat.cid = r['cid']

    def test020_list_chat_rooms(self):
        """Check if API returns correct list of chat rooms"""
        # No SID required because this doesn't really need authentication
        # And no parameters required
        r = client.get('/api/chats').json()
        self.assertEqual(r['chatrooms'], chat_rooms[0].name)

    def test030_first_user_join_chat(self):
        """Check what data is being given back from the
        first time a user joins the chat"""
        chat: Chat = chat_rooms[0]
        r = client.patch('/api/chats', params={
            'name': chat.name
            }, headers=genhed(user1))
        self.assertEqual(r.status_code, 200)

        r = r .json()
        self.assertEqual(r['owner'], user1.uname)
        self.assertEqual(r['cid'], chat.cid)
        self.assertListEqual(r['joiners'], [user1.uname])
        chat.owner = r['owner']
        chat.pwd = ''
        # Now we'll connect to the websocket port and get our messages so far
        # join_wschat(user1, chat)
        # self.assertTrue(user1.chat_log)

    def test040_2nd_user_join_chat(self):
        """Check if users other than the owner can join"""
        chat: Chat = chat_rooms[0]
        r = client.patch('/api/chats', params={
            'name': chat.name}, headers=genhed(user2)).json()
        self.assertEqual(r['joiners'], [user1.uname, user2.uname])

    def test050_1st_user_send_msg(self):
        """Check sending & recieving message"""
        chat = chat_rooms[0]
        baseuri = f'/api/chats/{chat.cid}?token='
        msg = 'Hello from owner!'
        with client.websocket_connect(baseuri + user1.sid) as ws:
            user1.chat_log = ws.receive_text().split('\x1e')
            ws.send_text(msg)
            resp = ws.receive_text()
            self.assertTrue(resp)
            self.assertTrue(user1.chat_log)
            user1.chat_log.append(msg)

    def test060_2nd_user_send_and_recv_msg(self):
        """Check if 2nd user has received the 1st msg, and sending a 2nd"""
        chat = chat_rooms[0]
        baseuri = f'/api/chats/{chat.cid}?token='
        msg = 'Hello Back!'
        with client.websocket_connect(baseuri + user2.sid) as ws:
            user2.chat_log = ws.receive_text().split('\x1e')
            # User1's chat log should have everything but the last 2 messages
            # the ones that say "User1 left" and "User2 joined"
            self.assertListEqual(user1.chat_log, user2.chat_log[:-2])
            ws.send_text(msg)
            resp = ws.receive_text()
            self.assertIsNotNone(resp)
            user2.chat_log.append(msg)
        with client.websocket_connect(baseuri + user1.sid) as ws:
            txt = ws.receive_text().split('\x1e')
            # Now we're checking if that was received
            # A potentially really helpful performance fix could be to
            # only send what's been changed instead of sending all
            # I don't think it will matter for now,
            # but this should be top prioerity;
            # It's probably the largest performance killer we've got
            user1.chat_log = txt
            self.assertListEqual(user1.chat_log[:-2], user2.chat_log)


if __name__ == '__main__':
    # Clear data directory
    rmtree('../data/')
    mkdir('../data/')
    
    mail.isTesting = True
    mail.fm.config.SUPPRESS_SEND = 1

    client = TestClient(app)

    unittest.main()
