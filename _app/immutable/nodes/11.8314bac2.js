import{s as D,f,a as C,l as H,g as _,h as k,T as I,c as y,m as O,d as E,j as i,i as U,u as d,O as b,C as T,K as z,D as L}from"../chunks/scheduler.2996579b.js";import{S as M,i as R}from"../chunks/index.00b56f8c.js";import{c as S}from"../chunks/auth.6280bc9e.js";import{p as $,g as j}from"../chunks/endpoint.cd1d59d5.js";import"../chunks/stores.88811b96.js";import{g as q}from"../chunks/navigation.5445e84d.js";import{s as g,p as A}from"../chunks/alerts.73a0c392.js";function B(o){let e,n,p='<h2 class="h2">Oh No!!</h2>',u,a,h,s,c,r,v,m,w,P;return{c(){e=f("div"),n=f("header"),n.innerHTML=p,u=C(),a=f("input"),h=C(),s=f("input"),c=C(),r=f("button"),v=H("Change Password!"),this.h()},l(l){e=_(l,"DIV",{class:!0});var t=k(e);n=_(t,"HEADER",{class:!0,["data-svelte-h"]:!0}),I(n)!=="svelte-6dr5sd"&&(n.innerHTML=p),u=y(t),a=_(t,"INPUT",{class:!0,title:!0,type:!0,placeholder:!0}),h=y(t),s=_(t,"INPUT",{class:!0,title:!0,type:!0,placeholder:!0}),c=y(t),r=_(t,"BUTTON",{type:!0,class:!0});var N=k(r);v=O(N,"Change Password!"),N.forEach(E),t.forEach(E),this.h()},h(){i(n,"class","mx-auto mb-5 text-center"),i(a,"class","input m-2"),i(a,"title","Email"),i(a,"type","email"),i(a,"placeholder","Current Email"),i(s,"class","input m-2"),i(s,"title","Password"),i(s,"type","password"),i(s,"placeholder","New Password"),i(r,"type","button"),i(r,"class","btn variant-filled-secondary"),r.disabled=m=!(o[0]&&o[1]),i(e,"class","card p-7")},m(l,t){U(l,e,t),d(e,n),d(e,u),d(e,a),b(a,o[0]),d(e,h),d(e,s),b(s,o[1]),d(e,c),d(e,r),d(r,v),w||(P=[T(a,"input",o[3]),T(s,"input",o[4]),T(r,"click",o[2])],w=!0)},p(l,[t]){t&1&&a.value!==l[0]&&b(a,l[0]),t&2&&s.value!==l[1]&&b(s,l[1]),t&3&&m!==(m=!(l[0]&&l[1]))&&(r.disabled=m)},i:z,o:z,d(l){l&&E(e),w=!1,L(P)}}}function K(o,e,n){var p="",u="";async function a(){let c=await $("reset",{email:p,pwd:u});c.error?g("Error: "+c.data.detail):(g("Check Your Email!"),A("What is the Code?",async r=>{(await j("reset",{code:r})).error?g("Error: "+c.data.detail):(g("Congrats! The password has been reset!"),await S(p,u)&&q("/home"))}))}function h(){p=this.value,n(0,p)}function s(){u=this.value,n(1,u)}return[p,u,a,h,s]}class X extends M{constructor(e){super(),R(this,e,K,B,D,{})}}export{X as component};
