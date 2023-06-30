import{w as K}from"./index.29093135.js";import{s as C,e as y,i as E,d,V as h,W as p,h as m,j as f,u as _,K as g,f as v,a as S,g as b,c as B,T as D,O as T,C as A,D as M,o as H,p as L}from"./scheduler.2996579b.js";import{S as O,i as z,g as N,t as k,c as V,a as w,b as j,d as q,m as I,e as R}from"./index.00b56f8c.js";import"./alerts.73a0c392.js";import{A as U}from"./Avatar.d98cb91b.js";function W(){const{subscribe:i,set:e,update:t}=K({});return{subscribe:i,set:e,update:t,open:n=>t(()=>({open:!0,...n})),close:()=>t(n=>(n.open=!1,n))}}const ne=W();function X(i){let e,t;return e=new U({props:{src:i[0],width:"w-8 m-2 lg:w-12"}}),{c(){j(e.$$.fragment)},l(n){q(e.$$.fragment,n)},m(n,s){I(e,n,s),t=!0},p(n,s){const o={};s&1&&(o.src=n[0]),e.$set(o)},i(n){t||(w(e.$$.fragment,n),t=!0)},o(n){k(e.$$.fragment,n),t=!1},d(n){R(e,n)}}}function F(i){let e,t,n,s,o,a;return{c(){e=h("svg"),t=h("g"),n=h("rect"),s=h("g"),o=h("g"),a=h("path"),this.h()},l(u){e=p(u,"svg",{xmlns:!0,class:!0,"enable-background":!0,viewBox:!0});var r=m(e);t=p(r,"g",{});var l=m(t);n=p(l,"rect",{fill:!0}),m(n).forEach(d),l.forEach(d),s=p(r,"g",{});var c=m(s);o=p(c,"g",{});var x=m(o);a=p(x,"path",{fill:!0,d:!0}),m(a).forEach(d),x.forEach(d),c.forEach(d),r.forEach(d),this.h()},h(){f(n,"fill","none"),f(a,"fill","currentColor"),f(a,"d","M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 11c-2.05 0-3.87-.95-5.07-2.44 1.45-.98 3.19-1.56 5.07-1.56s3.62.58 5.07 1.56c-1.2 1.49-3.02 2.44-5.07 2.44z"),f(e,"xmlns","http://www.w3.org/2000/svg"),f(e,"class","mx-auto w-10 lg:w-16"),f(e,"enable-background","new 0 0 20 20"),f(e,"viewBox","0 0 20 20")},m(u,r){E(u,e,r),_(e,t),_(t,n),_(e,s),_(s,o),_(o,a)},p:g,i:g,o:g,d(u){u&&d(e)}}}function G(i){let e,t,n,s;const o=[F,X],a=[];function u(r,l){return r[0]===""?0:1}return e=u(i),t=a[e]=o[e](i),{c(){t.c(),n=y()},l(r){t.l(r),n=y()},m(r,l){a[e].m(r,l),E(r,n,l),s=!0},p(r,[l]){let c=e;e=u(r),e===c?a[e].p(r,l):(N(),k(a[c],1,1,()=>{a[c]=null}),V(),t=a[e],t?t.p(r,l):(t=a[e]=o[e](r),t.c()),w(t,1),t.m(n.parentNode,n))},i(r){s||(w(t),s=!0)},o(r){k(t),s=!1},d(r){r&&d(n),a[e].d(r)}}}function J(i,e,t){let{src:n}=e;return i.$$set=s=>{"src"in s&&t(0,n=s.src)},[n]}class re extends O{constructor(e){super(),z(this,e,J,G,C,{src:0})}}function P(i){let e,t,n,s,o="send",a,u;return{c(){e=v("div"),t=v("textarea"),n=S(),s=v("button"),s.textContent=o,this.h()},l(r){e=b(r,"DIV",{class:!0});var l=m(e);t=b(l,"TEXTAREA",{class:!0,name:!0,placeholder:!0,rows:!0}),m(t).forEach(d),n=B(l),s=b(l,"BUTTON",{class:!0,["data-svelte-h"]:!0}),D(s)!=="svelte-iym19f"&&(s.textContent=o),l.forEach(d),this.h()},h(){f(t,"class","bg-transparent border-0 ring-0 flex-grow h-fit overflow-hidden resize-none"),f(t,"name","prompt"),f(t,"placeholder","Message Here..."),f(t,"rows","1"),f(s,"class","variant-filled-primary material-symbols-outlined h-100"),f(e,"class","input-group input-group-divider flex flex-shrink-0 rounded-container-token mt-4 mb-4")},m(r,l){E(r,e,l),_(e,t),i[4](t),T(t,i[2]),_(e,n),_(e,s),a||(u=[A(t,"input",i[5]),A(s,"click",i[6])],a=!0)},p(r,[l]){l&4&&T(t,r[2])},i:g,o:g,d(r){r&&d(e),i[4](null),a=!1,M(u)}}}function Q(i,e,t){let{onclick:n}=e,{sendOnEnter:s}=e,o;var a="";H(()=>{o.addEventListener("input",function(){this.style.height="auto",this.style.height=this.scrollHeight+"px"}),s&&o.addEventListener("keypress",function(c){c.key=="Enter"&&(c.preventDefault(),n(a),t(2,a=""))})});function u(c){L[c?"unshift":"push"](()=>{o=c,t(1,o)})}function r(){a=this.value,t(2,a)}const l=()=>{n(a),t(2,a="")};return i.$$set=c=>{"onclick"in c&&t(0,n=c.onclick),"sendOnEnter"in c&&t(3,s=c.sendOnEnter)},[n,o,a,s,u,r,l]}class se extends O{constructor(e){super(),z(this,e,Q,P,C,{onclick:0,sendOnEnter:3})}}export{se as K,re as a,ne as d};
