import { get, post, patch, endpoint } from '$lib/endpoint';
import type Alerter from '$lib/alerter';
import { userDataStore } from '$lib/stores';
import { dev } from '$app/environment';
import { getToastStore } from '@skeletonlabs/skeleton';



export type User  = {
  email: string;
  student: boolean;
  photo: string;
  name: string
}

export type Users = { [name: string]: User; }


export async function getUsers(cid: string) : Promise<{users: Users; name: string}> {
  const chatInfo = await getConvoInfo(cid);
  return {
    users: chatInfo.users,
    name: chatInfo.name
  }
}


export type Class = {
  name: string;
  public: boolean;
  chatroom: boolean;
  owner: string;
  users: Users; 
  cid?: string;
}

export type Chat = {
  name: string;
  public: boolean;
  chatroom: boolean;
  owner: string;
  users: Users;
  cid?: string;
}

// This is for displaying a chatroom
export type Chatroom = {
    name: string;
    isPwd: boolean;
    users: number;
}


export class Message {
  text: string;
  author: string;
  replyTo: number;
  time: string;
  replies: Array<number>;
  likes: number;
  mid: number;
  
  public constructor(data: {text: string, author: string, reply_to: number, time: string, replies: Array<number>, likes: number, mid:number}) {
    this.text = data.text;
    this.author = data.author;
    this.replyTo = data.reply_to;
    this.time = data.time;
    this.replies = data.replies;
    this.likes = data.likes;
    this.mid = data.mid;
  }

  public humanTime(): string {
    let d = new Date(this.time);
    // [TODO]: Check if the user uses 12 hour or 24 hour time
    let h = d.getHours();
    let m = d.getMinutes();
    if (true) {  // User uses 12 hour time
      return (h > 12? h - 12:(h==0?12:h)) + ':' + (m < 10? '0' + m: m) + ' ' + (h>12?'P.M.':'A.M.');
    } else {
      return h + ':' + m;
    }
  }

  public elapsedTime() : string {
    let msgDate = new Date(this.time);
    // [TODO] : TIMEZONE
    let curDate = new Date();
    const diffSeconds = Math.round((curDate.getTime() - msgDate.getTime()) / 1000)
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);
    const diffWeeks = Math.round(diffDays / 7);
    // const diffMonths = Math.round(diffDays / 30);  // Good enough
    // const diffYears = Math.round(diffDays / 365);

    const options:Array<[number, string]> = [
      // Years and months aren't on here
      [diffWeeks, 'w'],
      [diffDays, 'd'],
      [diffHours, 'h'],
      [diffMinutes, 'm'],
      [diffSeconds, 's']
    ];

    // Return the first one which is more than or equal to 1
    for (const option of options) {
      if (option[0] >= 1) {
        return option[0] + option[1];
      }
    }

    // mm/dd/yy
    return (msgDate.getUTCMonth() + 1) + '/' + msgDate.getUTCDate() + '/' + (msgDate.getUTCFullYear() - 2000);
  }

  public unixTime() : number {
    return Math.floor(new Date(this.time).getTime() / 1000)
  }
}


export async function sendMessage(cid: string, text: string, replyTo?: number) {
  await post(`convos/${cid}`, {
    'text': text,
    'reply_to': replyTo
  }, userDataStore.get().token);
}

export async function getConvoInfo(cid: string) : Promise<Class | Chat> {
    let token: string = userDataStore.get().token;
    const convoInfo = (await get(`convos/${cid}/info`, {}, token)).data;
  
    const tmp: Users = {};
    convoInfo.users.forEach((u: User) => {tmp[u.name] = u});
    let tmp2: Class | Chat = {
        users: tmp,
        name: convoInfo.name,
        public: convoInfo.public,
        chatroom: convoInfo.chatroom,
        owner: convoInfo.owner
    };
    return tmp2;
}

export async function getMessages(cid: string) : Promise<Array<Message>> {
  return (await get(`convos/${cid}`, {
    'start': 0
  }, userDataStore.get().token)).data.map((d: {
        reply_to: number,
        text: string,
        author: string,
        time: string,
        replies: Array<number>,
        likes: number,
        mid: number
    }) => new Message(d));
}

export function subscribeEventStream(cid: string, fn: (m:Message) => void | Promise<void>, start: number = 0) {
  const eventStream = new EventSource(`${dev? "http":"https"}://${endpoint('stream_convos')}/${cid}?token=${userDataStore.get().token}&start=${start}`)
  eventStream.onmessage = function (event) {
    // Promise.resolve() will resolve a promise even if it's not a promise
    Promise.resolve(fn(new Message(JSON.parse(event.data))));
  };
}


export function subscribeNotificationStream(): boolean {
    // if this has already been run once, quit
    if (Object.hasOwn(window, 'mqueue')) {
        return false;
    }
    window.mqueue = [];
    // window.nqueue = [];
    // I think I need to make these global, even though I really don't think that's a good idea...
    // Don't have much of an option
    const eventStream = new EventSource(`${dev? "http":"https"}://${endpoint('notifications')}?token=${userDataStore.get().token}`)
    eventStream.onmessage = (event) => {
        // Promise.resolve() will resolve a promise even if it's not a promise
        const data = JSON.parse(event.data)
        if (data[0] == userDataStore.get().cid) {
            window.mqueue.push(new Message(data[1])); 
        } else {
            getToastStore().trigger({
                message: data[1].author + ": " + data[1].text,
                timeout: 3000
            })
        // window.nqueue.push([ data[0], new Message(data[1]) ]);
        }
    };
    return true;
}

export async function joinChat(alerter: Alerter, room: string, pwd: string = '') : Promise<boolean> {
    const r = await patch('chats', {}, {'name': room, 'pwd': pwd}, userDataStore.get().token);
    if (r.error) {
        alerter.salert(`JOIN ERROR: ${r.data.detail}`);
        console.log(r);
    } else {
        userDataStore.write('cid', r.data.cid);
    }
    return !r.error;
}

export async function joinClass(alerter: Alerter, code: string) : Promise<boolean> {
    const r = await patch('classes', {}, {'code': code}, userDataStore.get().token);
    if (r.error) {
        alerter.salert(`JOIN ERROR: ${r.data}`);
        console.log(r);
    } else {
        userDataStore.write('cid', r.data.cid);
    }
    return !r.error;
}

export async function makeConvo(alerter: Alerter, name: string, pwd: string, isChatroom: boolean) : Promise<boolean> {
    const data = {
        name: name,
        pwd: pwd,
        public: (pwd === ""),
        chatroom: isChatroom 
    }
    const r = await post('convos', data, userDataStore.get().token);
    if (r.error) {
        alerter.salert(`ERROR OPENING CONVO: ${r.data.detail}`);
        console.log(r);
    }
    return !r.error;
}

export async function likeMsg(cid: string, mid: number) : Promise<boolean> {
    const r = await patch(`convos/${cid}/${mid}`, {}, {}, userDataStore.get().token)
    return r.data;
}

export async function getChatrooms(): Promise<Array<Chatroom>> {
    const chats: Array<[string, boolean, number]> = (await get('chats')).data.chatrooms;
    const chatrooms: Array<Chatroom> = [];
    chats.forEach(chat => {
        chatrooms.push({
            name: chat[0],
            isPwd: chat[1],
            users: chat[2]
        });
    });
    return chatrooms;
}

