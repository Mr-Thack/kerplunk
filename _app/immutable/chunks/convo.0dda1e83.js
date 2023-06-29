import{u as s}from"./stores.88811b96.js";import{g as f,e as h,p as l,a as c}from"./endpoint.cd1d59d5.js";import{s as i}from"./alerts.73a0c392.js";import"./paths.0f2a60c7.js";class d{constructor(e){this.text=e.text,this.author=e.author,this.replyTo=e.reply_to,this.time=e.time,this.replies=e.replies,this.likes=e.likes,this.mid=e.mid}humanTime(){let e=new Date(this.time),t=e.getHours(),n=e.getMinutes();return(t>12?t-12:t==0?12:t)+":"+(n<10?"0"+n:n)+" "+(t>12?"P.M.":"A.M.")}elapsedTime(){let e=new Date(this.time);const n=parseInt((new Date-e)/1e3),a=parseInt(n/60),u=parseInt(a/60),m=parseInt(u/24),p=[[parseInt(m/7),"w"],[m,"d"],[u,"h"],[a,"m"],[n,"s"]];for(const r of p)if(r[0]>=1)return r[0]+r[1];return e.getUTCMonth()+1+"/"+e.getUTCDate()+"/"+e.getUTCFullYear()-2e3}}async function y(o,e,t){await l(`convos/${o}`,{text:e,reply_to:t},s.readonce("token"))}async function I(o){const e=(await f(`convos/${o}/info`,{},s.readonce("token"))).data,t={};return e.users.forEach(n=>{t[n.name]=n}),{users:t,name:e.name,public:e.public,chatroom:e.chatroom,owner:e.owner}}async function D(o){return(await f(`convos/${o}`,{start:0},s.readonce("token"))).data.map(e=>new d(e))}function M(o,e,t=0){const n=new EventSource(`http://${h("stream_convos")}/${o}?token=${s.readonce("token")}&start=${t}`);n.onmessage=function(a){Promise.resolve(e(new d(JSON.parse(a.data))))}}async function O(o,e=""){const t=await c("chats",{},{name:o,pwd:e},s.readonce("token"));return t.error?(i(`JOIN ERROR: ${t.data}`),console.log(t)):s.write("cid",t.data.cid),!t.error}async function R(o){const e=await c("classes",{},{code:o},s.readonce("token"));return e.error?(i(`JOIN ERROR: ${e.data}`),console.log(e)):s.write("cid",e.data.cid),!e.error}async function C(o,e,t){const a=await l("convos",{name:o,pwd:e,public:e==="",chatroom:t},s.readonce("token"));return a.error&&(i(`ERROR OPENING CONVO: ${a.data}`),console.log(a)),!a.error}async function E(o,e){return(await c(`convos/${o}/${e}`,{},{},s.readonce("token"))).data}export{D as a,y as b,R as c,I as g,O as j,E as l,C as m,M as s};
