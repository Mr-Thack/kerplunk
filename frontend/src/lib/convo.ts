import getSettings from '$lib/settings';
import { get, post, patch, endpoint } from '$lib/endpoint';
import { salert, falert } from '$lib/alerts';
import { goto } from '$app/navigation';
import { userDataStore } from '$lib/stores';

export type User  = {
  email: string;
  student: boolean;
  photo: string;
  name: string
}

export type Class = {
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
  replyTo: number;
  time: string;
    
  public constructor(data: {text: string, author: string, replyTo: number, time: string}) {
    this.text = data.text;
    this.author = data.author;
    this.replyTo = data.replyTo;
    this.time = data.time;
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
}


export async function sendMessage(cid: string, text: string, replyTo?: string) {
  await post(`convos/${cid}`, {
    'text': text,
    'reply_to': replyTo
  }, userDataStore.readonce('token'));
}

export async function getConvoInfo(cid: string) {
  return (await get(`convos/${cid}/info`, {}, userDataStore.readonce('token'))).data;
}

export async function getMessages(cid: string) : Promise<Array<Message>> {
  return (await get(`convos/${cid}`, {
    'start': 0
  // @ts-ignore
  }, userDataStore.readonce('token')))
  .data.map(d => new Message(d));
}

export function subscribeEventStream(cid: string, fn: (m:Message) => void, start: number = 0) {
  const eventStream = new EventSource(`http://${endpoint('stream_convos')}/${cid}?token=${userDataStore.readonce('token')}&start=${start}`)
  eventStream.onmessage = function (event) {
    fn(new Message(JSON.parse(event.data)));
  };
}


export async function joinConvo(room: string) : Promise<boolean> {
  const r = await patch('convos', {}, {'name': room}, userDataStore.readonce('token'));
  if (r.error) {
    salert(`JOIN ERROR: ${r.data}`);
    console.log(r);
    return false;
  } else {
    // @ts-ignore
    userDataStore.write('cid', r.data.cid);
    return true;
  }
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
    salert(`ERROR OPENING CONVO: ${r.data}`);
    console.log(r);
    return false;
  } else {
    return true;
  }
}
