import{s as ae,f as C,l as ie,g as S,h as M,m as ce,d as g,j as E,i as H,u as y,n as fe,K as B,a as R,T as J,c as N,U as j,I as _e,o as ge,p as G,e as K,R as ue}from"../chunks/scheduler.2996579b.js";import{S as me,i as he,b as U,d as q,m as z,t as I,c as F,a as w,e as W,g as Y}from"../chunks/index.00b56f8c.js";import{e as A}from"../chunks/each.4e61ef43.js";import{d as Z,K as pe}from"../chunks/KPost.1fb593f3.js";import{K as de}from"../chunks/KTextArea.86e1920a.js";import{u as be}from"../chunks/stores.88811b96.js";import{g as ve}from"../chunks/navigation.5445e84d.js";import{f as ke}from"../chunks/alerts.73a0c392.js";import{g as x,a as ee,l as ye,b as te}from"../chunks/convo.88f2ed95.js";function we(r){let t,e,n,s=r[0].text+" - "+r[0].humanTime(),i;return{c(){t=C("div"),e=C("div"),n=C("p"),i=ie(s),this.h()},l(o){t=S(o,"DIV",{class:!0});var l=M(t);e=S(l,"DIV",{class:!0});var a=M(e);n=S(a,"P",{});var p=M(n);i=ce(p,s),p.forEach(g),a.forEach(g),l.forEach(g),this.h()},h(){E(e,"class","border-0 space-y-2 w-full mt-4 variant-filled-surface p-2 w-9/12 mx-auto rounded-xl"),E(t,"class","grid gap-4 text-center mx-auto")},m(o,l){H(o,t,l),y(t,e),y(e,n),y(n,i)},p(o,[l]){l&1&&s!==(s=o[0].text+" - "+o[0].humanTime())&&fe(i,s)},i:B,o:B,d(o){o&&g(t)}}}function Te(r,t,e){let{msg:n}=t;return r.$$set=s=>{"msg"in s&&e(0,n=s.msg)},[n]}class Ce extends me{constructor(t){super(),he(this,t,Te,we,ae,{msg:0})}}function se(r,t,e){const n=r.slice();return n[22]=t[e],n[24]=e,n}function ne(r,t,e){const n=r.slice();return n[10]=t[e],n[26]=e,n}function Se(r){let t,e,n=A(r[3]),s=[];for(let o=0;o<n.length;o+=1)s[o]=le(se(r,n,o));const i=o=>I(s[o],1,1,()=>{s[o]=null});return{c(){for(let o=0;o<s.length;o+=1)s[o].c();t=K()},l(o){for(let l=0;l<s.length;l+=1)s[l].l(o);t=K()},m(o,l){for(let a=0;a<s.length;a+=1)s[a]&&s[a].m(o,l);H(o,t,l),e=!0},p(o,l){if(l&394){n=A(o[3]);let a;for(a=0;a<n.length;a+=1){const p=se(o,n,a);s[a]?(s[a].p(p,l),w(s[a],1)):(s[a]=le(p),s[a].c(),w(s[a],1),s[a].m(t.parentNode,t))}for(Y(),a=n.length;a<s.length;a+=1)i(a);F()}},i(o){if(!e){for(let l=0;l<n.length;l+=1)w(s[l]);e=!0}},o(o){s=s.filter(Boolean);for(let l=0;l<s.length;l+=1)I(s[l]);e=!1},d(o){o&&g(t),ue(s,o)}}}function Ee(r){let t,e="Please Wait...";return{c(){t=C("p"),t.textContent=e,this.h()},l(n){t=S(n,"P",{class:!0,["data-svelte-h"]:!0}),J(t)!=="svelte-19o54u0"&&(t.textContent=e),this.h()},h(){E(t,"class","p")},m(n,s){H(n,t,s)},p:B,i:B,o:B,d(n){n&&g(t)}}}function Ie(r){let t,e,n,s,i,o=A(r[22].replies),l=[];for(let f=0;f<o.length;f+=1)l[f]=oe(ne(r,o,f));const a=f=>I(l[f],1,1,()=>{l[f]=null});function p(){return r[14](r[24])}function d(){return r[15](r[24])}return e=new pe({props:{src:r[1][r[22].author].photo,msg:r[22],reply:p,like:d}}),{c(){for(let f=0;f<l.length;f+=1)l[f].c();t=R(),U(e.$$.fragment),n=R(),s=C("hr"),this.h()},l(f){for(let u=0;u<l.length;u+=1)l[u].l(f);t=N(f),q(e.$$.fragment,f),n=N(f),s=S(f,"HR",{class:!0}),this.h()},h(){E(s,"class","border-4 rounded-full drop-shadow-xl")},m(f,u){for(let _=0;_<l.length;_+=1)l[_]&&l[_].m(f,u);H(f,t,u),z(e,f,u),H(f,n,u),H(f,s,u),i=!0},p(f,u){if(r=f,u&138){o=A(r[22].replies);let m;for(m=0;m<o.length;m+=1){const $=ne(r,o,m);l[m]?(l[m].p($,u),w(l[m],1)):(l[m]=oe($),l[m].c(),w(l[m],1),l[m].m(t.parentNode,t))}for(Y(),m=o.length;m<l.length;m+=1)a(m);F()}const _={};u&10&&(_.src=r[1][r[22].author].photo),u&8&&(_.msg=r[22]),e.$set(_)},i(f){if(!i){for(let u=0;u<o.length;u+=1)w(l[u]);w(e.$$.fragment,f),i=!0}},o(f){l=l.filter(Boolean);for(let u=0;u<l.length;u+=1)I(l[u]);I(e.$$.fragment,f),i=!1},d(f){f&&(g(t),g(n),g(s)),ue(l,f),W(e,f)}}}function He(r){let t,e,n,s;return t=new Ce({props:{msg:r[22]}}),{c(){U(t.$$.fragment),e=R(),n=C("hr"),this.h()},l(i){q(t.$$.fragment,i),e=N(i),n=S(i,"HR",{class:!0}),this.h()},h(){E(n,"class","border-4 rounded-full drop-shadow-xl")},m(i,o){z(t,i,o),H(i,e,o),H(i,n,o),s=!0},p(i,o){const l={};o&8&&(l.msg=i[22]),t.$set(l)},i(i){s||(w(t.$$.fragment,i),s=!0)},o(i){I(t.$$.fragment,i),s=!1},d(i){i&&(g(e),g(n)),W(t,i)}}}function $e(r){let t,e,n,s;function i(){return r[13](r[10])}return e=new pe({props:{src:r[1][r[3][r[10]].author].photo,msg:r[3][r[10]],isReply:!0,like:i}}),{c(){t=C("div"),U(e.$$.fragment),n=R(),this.h()},l(o){t=S(o,"DIV",{class:!0});var l=M(t);q(e.$$.fragment,l),n=N(l),l.forEach(g),this.h()},h(){E(t,"class","w-9/12 mx-auto align-center")},m(o,l){H(o,t,l),z(e,t,null),y(t,n),s=!0},p(o,l){r=o;const a={};l&10&&(a.src=r[1][r[3][r[10]].author].photo),l&8&&(a.msg=r[3][r[10]]),l&8&&(a.like=i),e.$set(a)},i(o){s||(w(e.$$.fragment,o),s=!0)},o(o){I(e.$$.fragment,o),s=!1},d(o){o&&g(t),W(e)}}}function oe(r){let t,e,n=r[26]<3&&$e(r);return{c(){n&&n.c(),t=K()},l(s){n&&n.l(s),t=K()},m(s,i){n&&n.m(s,i),H(s,t,i),e=!0},p(s,i){s[26]<3&&n.p(s,i)},i(s){e||(w(n),e=!0)},o(s){I(n),e=!1},d(s){s&&g(t),n&&n.d(s)}}}function le(r){let t,e,n,s;const i=[He,Ie],o=[];function l(a,p){return a[22].author==="SYSTEM"?0:a[22].replyTo?-1:1}return~(t=l(r))&&(e=o[t]=i[t](r)),{c(){e&&e.c(),n=K()},l(a){e&&e.l(a),n=K()},m(a,p){~t&&o[t].m(a,p),H(a,n,p),s=!0},p(a,p){let d=t;t=l(a),t===d?~t&&o[t].p(a,p):(e&&(Y(),I(o[d],1,1,()=>{o[d]=null}),F()),~t?(e=o[t],e?e.p(a,p):(e=o[t]=i[t](a),e.c()),w(e,1),e.m(n.parentNode,n)):e=null)},i(a){s||(w(e),s=!0)},o(a){I(e),s=!1},d(a){a&&g(n),~t&&o[t].d(a)}}}function De(r){let t,e,n,s="arrow_back_ios",i,o,l=r[2]?"Classroom "+r[2]:"Loading...",a,p,d,f="settings",u,_,m,$,v,T,k,V;m=new de({props:{onclick:r[9],sendOnEnter:!1}});const L=[Ee,Se],D=[];function O(h,b){return!h[6].name||!h[1]||!h[3].length?0:1}return T=O(r),k=D[T]=L[T](r),{c(){t=C("div"),e=C("div"),n=C("a"),n.textContent=s,i=R(),o=C("h3"),a=ie(l),p=R(),d=C("button"),d.textContent=f,u=R(),_=C("div"),U(m.$$.fragment),$=R(),v=C("section"),k.c(),this.h()},l(h){t=S(h,"DIV",{class:!0});var b=M(t);e=S(b,"DIV",{class:!0});var c=M(e);n=S(c,"A",{class:!0,href:!0,["data-svelte-h"]:!0}),J(n)!=="svelte-1fyvyue"&&(n.textContent=s),i=N(c),o=S(c,"H3",{class:!0});var P=M(o);a=ce(P,l),P.forEach(g),p=N(c),d=S(c,"BUTTON",{class:!0,["data-svelte-h"]:!0}),J(d)!=="svelte-1o7k9cj"&&(d.textContent=f),c.forEach(g),u=N(b),_=S(b,"DIV",{});var Q=M(_);q(m.$$.fragment,Q),Q.forEach(g),$=N(b),v=S(b,"SECTION",{class:!0});var X=M(v);k.l(X),X.forEach(g),b.forEach(g),this.h()},h(){E(n,"class","btn-icon material-symbols-outlined w-8 h-8"),E(n,"href","/classrooms"),E(o,"class","h3 px-2 my-auto"),E(d,"class","material-symbols-outlined ml-auto mr-3 w-8 h-8 my-auto"),E(e,"class","h-auto flex flex-row variant-filled-primary mt-4 p-1"),E(v,"class","flex flex-col-reverse p-4 overflow-y-auto space-y-4 mb-8"),j(v,"placeholder",!r[3].length),j(v,"animate-pulse",!r[3].length),E(t,"class","flex flex-col max-h-screen overflow-hidden px-4 lg:pl-0")},m(h,b){H(h,t,b),y(t,e),y(e,n),y(e,i),y(e,o),y(o,a),y(e,p),y(e,d),r[11](e),y(t,u),y(t,_),z(m,_,null),r[12](_),y(t,$),y(t,v),D[T].m(v,null),r[16](v),V=!0},p(h,[b]){(!V||b&4)&&l!==(l=h[2]?"Classroom "+h[2]:"Loading...")&&fe(a,l);let c=T;T=O(h),T===c?D[T].p(h,b):(Y(),I(D[c],1,1,()=>{D[c]=null}),F(),k=D[T],k?k.p(h,b):(k=D[T]=L[T](h),k.c()),w(k,1),k.m(v,null)),(!V||b&8)&&j(v,"placeholder",!h[3].length),(!V||b&8)&&j(v,"animate-pulse",!h[3].length)},i(h){V||(w(m.$$.fragment,h),w(k),V=!0)},o(h){I(m.$$.fragment,h),I(k),V=!1},d(h){h&&g(t),r[11](null),W(m),r[12](null),D[T].d(),r[16](null)}}}function re(r){const t=r.offsetHeight,e=getComputedStyle(r),n=parseInt(e.getPropertyValue("margin-top")),s=parseInt(e.getPropertyValue("margin-bottom"));return t+n+s}function Ve(r,t,e){let n;_e(r,be,c=>e(6,n=c));let s;var i={};let o;var l=[],a,p;function d(){return window.innerHeight-re(a)-re(p)-32}window.addEventListener("resize",()=>{try{e(0,s.style.maxHeight=d().toString()+"px",s),e(0,s.style.minHeight=d().toString()+"px",s)}catch{}});function f(){s.scrollTo({top:-s.scrollHeight,behavior:"smooth"})}let u;const _={id:"drawerReplies",width:"mx-auto align-center content-center w-9/12",height:"h-2/3",padding:"p-4",position:"bottom",meta:{msgs:[],users:i,mid:u,reply:k,like:$},rounded:"rounded-xl"};async function m(){const c=await ee(n.cid);c.forEach(async P=>{Object.keys(i).includes(P.author)||e(1,i=(await x(n.cid)).users)}),e(3,l=c)}async function $(c){await ye(n.cid,c),setTimeout(m,1e3)}function v(c){u=c,_.meta.msgs=[];for(const P of l[c].replies)_.meta.msgs.push(l[P]);_.meta.users=i,_.meta.mid=c,Z.open(_)}async function T(c){await te(n.cid,c),setTimeout(m,1e3)}async function k(c,P){await te(n.cid,c,P),setTimeout(async()=>{await m(),Z.close(),v(_.meta.mid)},1e3)}ge(async()=>{n.token||ke("Sign in to a class first!",()=>{ve("/classes")});const c=await x(n.cid);e(2,o=c.name),e(1,i=c.users),e(3,l=await ee(n.cid)),setInterval(m,1e3*60),f(),e(0,s.style.maxHeight=d().toString()+"px",s),e(0,s.style.minHeight=d().toString()+"px",s)});function V(c){G[c?"unshift":"push"](()=>{a=c,e(4,a)})}function L(c){G[c?"unshift":"push"](()=>{p=c,e(5,p)})}const D=c=>{$(c)},O=c=>{v(c)},h=c=>{$(c)};function b(c){G[c?"unshift":"push"](()=>{s=c,e(0,s)})}return[s,i,o,l,a,p,n,$,v,T,k,V,L,D,O,h,b]}class Ae extends me{constructor(t){super(),he(this,t,Ve,De,ae,{})}}export{Ae as component};
