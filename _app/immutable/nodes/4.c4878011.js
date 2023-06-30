import{s as U,f as g,a as C,g as v,h as M,T as x,c as S,d as p,j as k,i as y,u as b,C as Y,K as T,I as q,o as z,X as A,p as K,e as H,R as V,l as D,m as I,n as W}from"../chunks/scheduler.2996579b.js";import{e as N}from"../chunks/each.4e61ef43.js";import{S as X,i as F}from"../chunks/index.00b56f8c.js";import{g as G}from"../chunks/endpoint.4b649916.js";import{u as Q}from"../chunks/stores.88811b96.js";import{g as j}from"../chunks/navigation.89f88307.js";import{p as O,c as Z,s as P}from"../chunks/alerts.73a0c392.js";import{j as $,m as tt}from"../chunks/convo.b82e986b.js";import{b as R}from"../chunks/paths.68928830.js";function B(r,t,n){const e=r.slice();return e[12]=t[n],e}function et(r){let t,n="There aren't any yet! Make one!";return{c(){t=g("h2"),t.textContent=n,this.h()},l(e){t=v(e,"H2",{class:!0,["data-svelte-h"]:!0}),x(t)!=="svelte-ourse3"&&(t.textContent=n),this.h()},h(){k(t,"class","h2 text-center")},m(e,a){y(e,t,a)},p:T,d(e){e&&p(t)}}}function at(r){let t,n=N(r[0]),e=[];for(let a=0;a<n.length;a+=1)e[a]=E(B(r,n,a));return{c(){for(let a=0;a<e.length;a+=1)e[a].c();t=H()},l(a){for(let s=0;s<e.length;s+=1)e[s].l(a);t=H()},m(a,s){for(let o=0;o<e.length;o+=1)e[o]&&e[o].m(a,s);y(a,t,s)},p(a,s){if(s&5){n=N(a[0]);let o;for(o=0;o<n.length;o+=1){const h=B(a,n,o);e[o]?e[o].p(h,s):(e[o]=E(h),e[o].c(),e[o].m(t.parentNode,t))}for(;o<e.length;o+=1)e[o].d(1);e.length=n.length}},d(a){a&&p(t),V(e,a)}}}function E(r){let t,n,e=r[12]+"",a,s,o,h,c;function _(){return r[4](r[12])}return{c(){t=g("button"),n=D("Join "),a=D(e),s=C(),o=g("br"),this.h()},l(l){t=v(l,"BUTTON",{class:!0});var i=M(t);n=I(i,"Join "),a=I(i,e),i.forEach(p),s=S(l),o=v(l,"BR",{}),this.h()},h(){k(t,"class","btn bg-gradient-to-br variant-filled-secondary mt-3 w-25 text-sm lg:text-base h-8 lg:h-10")},m(l,i){y(l,t,i),b(t,n),b(t,a),y(l,s,i),y(l,o,i),h||(c=Y(t,"click",_),h=!0)},p(l,i){r=l,i&1&&e!==(e=r[12]+"")&&W(a,e)},d(l){l&&(p(t),p(s),p(o)),h=!1,c()}}}function nt(r){let t,n,e="Make Your Own!",a,s,o="Chatrooms:",h,c,_;function l(f,m){return f[0].length?at:et}let i=l(r),u=i(r);return{c(){t=g("div"),n=g("button"),n.textContent=e,a=C(),s=g("h1"),s.textContent=o,h=C(),u.c(),this.h()},l(f){t=v(f,"DIV",{class:!0});var m=M(t);n=v(m,"BUTTON",{class:!0,["data-svelte-h"]:!0}),x(n)!=="svelte-h55r7m"&&(n.textContent=e),a=S(m),s=v(m,"H1",{class:!0,["data-svelte-h"]:!0}),x(s)!=="svelte-m7i81e"&&(s.textContent=o),h=S(m),u.l(m),m.forEach(p),this.h()},h(){k(n,"class","btn mb-10 text-center variant-filled"),k(s,"class","h1 text-center mb-5"),k(t,"class","m-4 overflow-auto")},m(f,m){y(f,t,m),b(t,n),b(t,a),b(t,s),b(t,h),u.m(t,null),r[5](t),c||(_=Y(n,"click",r[3]),c=!0)},p(f,[m]){i===(i=l(f))&&u?u.p(f,m):(u.d(1),u=i(f),u&&(u.c(),u.m(t,null)))},i:T,o:T,d(f){f&&p(t),u.d(),r[5](null),c=!1,_()}}}function ot(r,t,n){let e;q(r,Q,d=>n(9,e=d));var a="",s="",o=[],h;let c;window.addEventListener("resize",()=>{try{n(1,c.style.maxHeight=(window.innerHeight-134).toString()+"px",c)}catch{}});async function _(){n(0,o=(await G("chats")).data.chatrooms),console.log(o)}z(async function(){n(1,c.style.maxHeight=(window.innerHeight-134).toString()+"px",c),e.token||j(R+"/login"),_(),h=setInterval(_,5e3)});async function l(d){await $(d)&&j(R+"/chat")}async function i(d,w){return await tt(d,w,!0)}async function u(){O("Name of the chatroom?",async d=>{var w=!0;if(a=d,a)Z("Do You Want a Password?",async J=>{J&&O("Password Of The Chat Room?",async L=>{s=L})});else{var w=!1;P("You need a chat room name!")}w&&await i(a,s)&&P("All's well! Should show up soon!")})}A(()=>{clearInterval(h)});const f=d=>l(d);function m(d){K[d?"unshift":"push"](()=>{c=d,n(1,c)})}return[o,c,l,u,f,m]}class dt extends X{constructor(t){super(),F(this,t,ot,nt,U,{})}}export{dt as component};