import getSettings from '$lib/settings';
import { get, post, endpoint } from '$lib/endpoint';




export type User  = {
  email: string;
  student: boolean;
  photo: string;
  name: string
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


export async function sendMessage(cid: string, token: string, text: string, replyTo?: string) {
  await post(`convos/${cid}`, {
    'text': text,
    'reply_to': replyTo
  }, token);
}

export async function getChatInfo(cid: string, token: string) {
  return (await get(`convos/${cid}/info`, {}, token)).data;
}

export async function getMessages(cid: string, token: string) {
  return (await get(`convos/${cid}`, {
    'start': 0
  // @ts-ignore
  }, token))
  .data.map(data => new Message(data));
}

export function subscribeEventStream(cid: string, token: string, fn: (m:Message) => void, start: number = 0) {
  const eventStream = new EventSource(`http://${endpoint('stream_convos')}/${cid}?token=${token}&start=${start}`)
  eventStream.onmessage = function (event) {
    fn(new Message(JSON.parse(event.data)));
  };
}