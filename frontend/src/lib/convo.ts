import getSettings from '$lib/settings';
import { get as hget, post, patch, endpoint } from '$lib/endpoint';
import { salert, falert } from '$lib/alerts';
import { userDataStore } from '$lib/stores';
import { dev } from '$app/environment';
import { Modal, modalStore } from '@skeletonlabs/skeleton';
import { goto } from '$app/navigation'
import { page } from '$app/stores';
import { get } from 'svelte/store';
import { toastStore } from '@skeletonlabs/skeleton';



export type User  = {
  email: string;
  student: boolean;
  photo: string;
  name: string
}

export type Users = { [name: string]: User; }


export async function getUsers(cid: string) : Promise<{users: Users; name: string}> {
  const chatInfo = await getConvoInfo(cid);
  // @ts-ignore
  const tmp: Users = {}
  // @ts-ignore
  chatInfo.users.forEach((u: User) => {tmp[u.name] = u});
  return {
    users: tmp,
    // @ts-ignore
    name: chatInfo.name
  }
}


export type Class = {
  name: string;
  public: boolean;
  chatroom: boolean;
  owner: string;
  users: Array<string>;
  cid?: string;
}

export type Chat = {
  name: string;
  public: boolean;
  chatroom: boolean;
  owner: string;
  users: Array<string>;
  cid?: string;
}


export class Message {
  text: string;
  author: string;
  replyTo: Integer;
  time: string;
  replies: Array<Integer>;
  likes: number;
  mid: number;
  
  public constructor(data: {text: string, author: string, replyTo: number, time: string, replies: Array<Number>, likes: number, mid:number}) {
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
    const diffSeconds = parseInt((curDate - msgDate) / 1000)
    const diffMinutes = parseInt(diffSeconds / 60);
    const diffHours = parseInt(diffMinutes / 60);
    const diffDays = parseInt(diffHours / 24);
    const diffWeeks = parseInt(diffDays / 7);
    const diffMonths = parseInt(diffDays / 30);  // Good enough
    const diffYears = parseInt(diffDays / 365);

    const options = [
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
    return msgDate.getUTCMonth() + 1 + '/' + msgDate.getUTCDate() + '/' + msgDate.getUTCFullYear() - 2000;
  }

  public unixTime() : number {
    return Math.floor(new Date(this.time).getTime() / 1000)
  }
}


export async function sendMessage(cid: string, text: string, replyTo?: number) {
  await post(`convos/${cid}`, {
    'text': text,
    'reply_to': replyTo
  }, userDataStore.readonce('token'));
}

export async function getConvoInfo(cid: string) {
  const convoInfo = (await hget(`convos/${cid}/info`, {}, userDataStore.readonce('token'))).data;
  const tmp: Users = {};
  // @ts-ignore
  convoInfo.users.forEach((u: User) => {tmp[u.name] = u});
  return {
    users: tmp,
    // @ts-ignore
    name: convoInfo.name,
    // @ts-ignore
    public: convoInfo.public,
    // @ts-ignore
    chatroom: convoInfo.chatroom,
    // @ts-ignore
    owner: convoInfo.owner
  }
}

export async function getMessages(cid: string) : Promise<Array<Message>> {
  return (await hget(`convos/${cid}`, {
    'start': 0
  // @ts-ignore
  }, userDataStore.readonce('token')))
  .data.map(d => new Message(d));
}

export function subscribeEventStream(cid: string, fn: (m:Message) => void | Promise<void>, start: number = 0) {
  const eventStream = new EventSource(`${dev? "http":"https"}://${endpoint('stream_convos')}/${cid}?token=${userDataStore.readonce('token')}&start=${start}`)
  eventStream.onmessage = function (event) {
    // Promise.resolve() will resolve a promise even if it's not a promise
    Promise.resolve(fn(new Message(JSON.parse(event.data))));
  };
}


export function subscribeNotificationStream() {
  // if this has already been run once, quit
  if (window.mqueue) {
    return false;
  }
  window.mqueue = [];
  // window.nqueue = [];
  // I think I need to make these global, even though I really don't think that's a good idea...
  // Don't have much of an option
  const eventStream = new EventSource(`${dev? "http":"https"}://${endpoint('notifications')}?token=${userDataStore.readonce('token')}`)
  eventStream.onmessage = (event) => {
    // Promise.resolve() will resolve a promise even if it's not a promise
    const data = JSON.parse(event.data)
    if (data[0] == userDataStore.readonce('cid')) {
      window.mqueue.push(new Message(data[1])); 
    } else {
      console.log(data);
      toastStore.trigger({
        message: data[1].author + ": " + data[1].text,
        timeout: 3000
      })
      
      // window.nqueue.push([ data[0], new Message(data[1]) ]);
    }
  };
  return true;
}

export async function joinChat(room: string, pwd: string = '') : Promise<boolean> {
  const r = await patch('chats', {}, {'name': room, 'pwd': pwd}, userDataStore.readonce('token'));
  if (r.error) {
    salert(`JOIN ERROR: ${r.data.detail}`);
    console.log(r);
  } else {
    // @ts-ignore
    userDataStore.write('cid', r.data.cid);
  }
  return !r.error;
}

export async function joinClass(code: string) : Promise<boolean> {
  const r = await patch('classes', {}, {'code': code}, userDataStore.readonce('token'));
  if (r.error) {
    salert(`JOIN ERROR: ${r.data}`);
        console.log(r);
  } else {
    // @ts-ignore
    userDataStore.write('cid', r.data.cid);
  }
  return !r.error;
}

export async function makeConvo(name: string, pwd: string, isChatroom: boolean) : Promise<boolean> {
  const data = {
    name: name,
    pwd: pwd,
    public: (pwd === ""),
    chatroom: isChatroom 
  }
  const r = await post('convos', data, userDataStore.readonce('token'));
  if (r.error) {
    salert(`ERROR OPENING CONVO: ${r.data.detail}`);
    console.log(r);
  }
  return !r.error;
}

export async function likeMsg(cid: string, mid: number) : Promise<boolean> {
  const r = await patch(`convos/${cid}/${mid}`, {}, {}, userDataStore.readonce('token'))
  return r.data;
}