import{K as Z,Y as we,Z as je,s as ye,f as D,a as O,g as N,h as q,d as C,c as R,j as v,M as ne,U as re,i as U,u as T,_ as ue,O as P,C as M,R as Je,D as ie,E as oe,J as Ke,o as Ze,z as fe,A as ce,l as ee,m as te,n as Ce,T as Ee,H as z,p as Ie,$ as Ge,a0 as Qe}from"../chunks/scheduler.2996579b.js";import{n as We,l as Xe,h as xe,j as $e,S as Se,i as De,a as H,g as Ne,t as Y,c as Me,f as G,b as Q,d as W,m as X,e as x,k as et}from"../chunks/index.00b56f8c.js";import{f as tt,s as le}from"../chunks/alerts.73a0c392.js";import{e as $,u as lt,f as nt}from"../chunks/each.4e61ef43.js";import{c as it,f as he,s as de}from"../chunks/index.50132fb9.js";import{S as at,a as pe,i as me}from"../chunks/email.88a72404.js";import{g as st,p as rt}from"../chunks/endpoint.cd1d59d5.js";function ut(l,e,t,n){if(!e)return Z;const s=l.getBoundingClientRect();if(e.left===s.left&&e.right===s.right&&e.top===s.top&&e.bottom===s.bottom)return Z;const{delay:i=0,duration:a=300,easing:o=we,start:_=We()+i,end:d=_+a,tick:h=Z,css:r}=t(l,{from:e,to:s},n);let p=!0,f=!1,g;function E(){r&&(g=xe(l,0,1,a,i,o,r)),i||(f=!0)}function S(){r&&$e(l,g),p=!1}return Xe(I=>{if(!f&&I>=_&&(f=!0),f&&I>=d&&(h(1,0),S()),!p)return!1;if(f){const k=I-_,m=0+1*o(k/a);h(m,1-m)}return!0}),E(),h(0,1),S}function ot(l){const e=getComputedStyle(l);if(e.position!=="absolute"&&e.position!=="fixed"){const{width:t,height:n}=e,s=l.getBoundingClientRect();l.style.position="absolute",l.style.width=t,l.style.height=n,ft(l,s)}}function ft(l,e){const t=l.getBoundingClientRect();if(e.left!==t.left||e.top!==t.top){const n=getComputedStyle(l),s=n.transform==="none"?"":n.transform;l.style.transform=`${s} translate(${e.left-t.left}px, ${e.top-t.top}px)`}}function ct(l,{from:e,to:t},n={}){const s=getComputedStyle(l),i=s.transform==="none"?"":s.transform,[a,o]=s.transformOrigin.split(" ").map(parseFloat),_=e.left+e.width*a/t.width-(t.left+a),d=e.top+e.height*o/t.height-(t.top+o),{delay:h=0,duration:r=f=>Math.sqrt(f)*120,easing:p=it}=n;return{delay:h,duration:je(r)?r(Math.sqrt(_*_+d*d)):r,easing:p,css:(f,g)=>{const E=g*_,S=g*d,I=f+g*e.width/t.width,k=f+g*e.height/t.height;return`transform: ${i} translate(${E}px, ${S}px) scale(${I}, ${k});`}}}function _e(l,e,t){const n=l.slice();return n[43]=e[t].id,n[44]=e[t].val,n[46]=t,n}function ge(l,e,t){const n=l.slice();return n[47]=e[t],n}function ve(l){let e,t=l[47]+"",n,s;return{c(){e=D("option"),n=ee(t),this.h()},l(i){e=N(i,"OPTION",{});var a=q(e);n=te(a,t),a.forEach(C),this.h()},h(){e.__value=s=l[47],P(e,e.__value)},m(i,a){U(i,e,a),T(e,n)},p(i,a){a[0]&1&&t!==(t=i[47]+"")&&Ce(n,t),a[0]&1&&s!==(s=i[47])&&(e.__value=s,P(e,e.__value))},d(i){i&&C(e)}}}function be(l){let e,t=[],n=new Map,s,i,a,o=$(l[6]);const _=d=>d[43];for(let d=0;d<o.length;d+=1){let h=_e(l,o,d),r=_(h);n.set(r,t[d]=ke(r,h))}return{c(){e=D("div");for(let d=0;d<t.length;d+=1)t[d].c();this.h()},l(d){e=N(d,"DIV",{class:!0});var h=q(e);for(let r=0;r<t.length;r+=1)t[r].l(h);h.forEach(C),this.h()},h(){v(e,"class",s="input-chip-list "+l[9])},m(d,h){U(d,e,h);for(let r=0;r<t.length;r+=1)t[r]&&t[r].m(e,null);a=!0},p(d,h){if(l=d,h[0]&16488){o=$(l[6]),Ne();for(let r=0;r<t.length;r+=1)t[r].r();t=lt(t,h,_,1,l,o,n,e,nt,ke,null,_e);for(let r=0;r<t.length;r+=1)t[r].a();Me()}(!a||h[0]&512&&s!==(s="input-chip-list "+l[9]))&&v(e,"class",s)},i(d){if(!a){for(let h=0;h<o.length;h+=1)H(t[h]);d&&ne(()=>{a&&(i||(i=G(e,he,{duration:l[3],opacity:0,y:-20},!0)),i.run(1))}),a=!0}},o(d){for(let h=0;h<t.length;h+=1)Y(t[h]);d&&(i||(i=G(e,he,{duration:l[3],opacity:0,y:-20},!1)),i.run(0)),a=!1},d(d){d&&C(e);for(let h=0;h<t.length;h+=1)t[h].d();d&&i&&i.end()}}}function ke(l,e){let t,n,s,i=e[44]+"",a,o,_,d="✕",h,r,p,f,g=Z,E,S,I;function k(...m){return e[38](e[46],e[44],...m)}return{key:l,first:null,c(){t=D("div"),n=D("button"),s=D("span"),a=ee(i),o=O(),_=D("span"),_.textContent=d,p=O(),this.h()},l(m){t=N(m,"DIV",{});var c=q(t);n=N(c,"BUTTON",{type:!0,class:!0});var b=q(n);s=N(b,"SPAN",{});var y=q(s);a=te(y,i),y.forEach(C),o=R(b),_=N(b,"SPAN",{["data-svelte-h"]:!0}),Ee(_)!=="svelte-1p578dz"&&(_.textContent=d),b.forEach(C),p=R(c),c.forEach(C),this.h()},h(){v(n,"type","button"),v(n,"class",h="chip "+e[5]),this.first=t},m(m,c){U(m,t,c),T(t,n),T(n,s),T(s,a),T(n,o),T(n,_),T(t,p),E=!0,S||(I=[M(n,"click",k),M(n,"click",e[28]),M(n,"keypress",e[29]),M(n,"keydown",e[30]),M(n,"keyup",e[31])],S=!0)},p(m,c){e=m,(!E||c[0]&64)&&i!==(i=e[44]+"")&&Ce(a,i),(!E||c[0]&32&&h!==(h="chip "+e[5]))&&v(n,"class",h)},r(){f=t.getBoundingClientRect()},f(){ot(t),g()},a(){g(),g=ut(t,f,ct,{duration:e[3]})},i(m){E||(m&&ne(()=>{E&&(r||(r=G(n,de,{duration:e[3],opacity:0},!0)),r.run(1))}),E=!0)},o(m){m&&(r||(r=G(n,de,{duration:e[3],opacity:0},!1)),r.run(0)),E=!1},d(m){m&&C(t),m&&r&&r.end(),S=!1,ie(I)}}}function ht(l){let e,t,n,s,i,a,o,_,d,h,r,p,f,g,E,S,I=$(l[0]),k=[];for(let c=0;c<I.length;c+=1)k[c]=ve(ge(l,I,c));let m=l[6].length&&be(l);return{c(){e=D("div"),t=D("div"),n=D("select");for(let c=0;c<k.length;c+=1)k[c].c();s=O(),i=D("div"),a=D("form"),o=D("input"),r=O(),m&&m.c(),this.h()},l(c){e=N(c,"DIV",{class:!0});var b=q(e);t=N(b,"DIV",{class:!0});var y=q(t);n=N(y,"SELECT",{name:!0,tabindex:!0});var V=q(n);for(let F=0;F<k.length;F+=1)k[F].l(V);V.forEach(C),y.forEach(C),s=R(b),i=N(b,"DIV",{class:!0});var A=q(i);a=N(A,"FORM",{});var w=q(a);o=N(w,"INPUT",{type:!0,placeholder:!0,class:!0}),w.forEach(C),r=R(A),m&&m.l(A),A.forEach(C),b.forEach(C),this.h()},h(){v(n,"name",l[2]),n.multiple=!0,n.required=l[4],v(n,"tabindex","-1"),l[0]===void 0&&ne(()=>l[36].call(n)),v(t,"class","h-0 overflow-hidden"),v(o,"type","text"),v(o,"placeholder",_=l[15].placeholder??"Enter values..."),v(o,"class",d="input-chip-field "+l[8]),o.disabled=h=l[15].disabled,v(i,"class",p="input-chip-interface "+l[10]),v(e,"class",f="input-chip "+l[11]),re(e,"opacity-50",l[15].disabled)},m(c,b){U(c,e,b),T(e,t),T(t,n);for(let y=0;y<k.length;y+=1)k[y]&&k[y].m(n,null);l[35](n),ue(n,l[0]),T(e,s),T(e,i),T(i,a),T(a,o),P(o,l[1]),T(i,r),m&&m.m(i,null),g=!0,E||(S=[M(n,"change",l[36]),M(o,"input",l[37]),M(o,"input",l[12]),M(o,"input",l[32]),M(o,"focus",l[33]),M(o,"blur",l[34]),M(a,"submit",l[13])],E=!0)},p(c,b){if(b[0]&1){I=$(c[0]);let y;for(y=0;y<I.length;y+=1){const V=ge(c,I,y);k[y]?k[y].p(V,b):(k[y]=ve(V),k[y].c(),k[y].m(n,null))}for(;y<k.length;y+=1)k[y].d(1);k.length=I.length}(!g||b[0]&4)&&v(n,"name",c[2]),(!g||b[0]&16)&&(n.required=c[4]),b[0]&1&&ue(n,c[0]),(!g||b[0]&32768&&_!==(_=c[15].placeholder??"Enter values..."))&&v(o,"placeholder",_),(!g||b[0]&256&&d!==(d="input-chip-field "+c[8]))&&v(o,"class",d),(!g||b[0]&32768&&h!==(h=c[15].disabled))&&(o.disabled=h),b[0]&2&&o.value!==c[1]&&P(o,c[1]),c[6].length?m?(m.p(c,b),b[0]&64&&H(m,1)):(m=be(c),m.c(),H(m,1),m.m(i,null)):m&&(Ne(),Y(m,1,1,()=>{m=null}),Me()),(!g||b[0]&1024&&p!==(p="input-chip-interface "+c[10]))&&v(i,"class",p),(!g||b[0]&2048&&f!==(f="input-chip "+c[11]))&&v(e,"class",f),(!g||b[0]&34816)&&re(e,"opacity-50",c[15].disabled)},i(c){g||(H(m),g=!0)},o(c){Y(m),g=!1},d(c){c&&C(e),Je(k,c),l[35](null),m&&m.d(),E=!1,ie(S)}}}const dt="textarea cursor-pointer",pt="space-y-4",mt="flex flex-wrap gap-2",_t="unstyled bg-transparent border-0 !ring-0 p-0 w-full";function gt(l,e,t){let n,s,i,a,o;const _=["input","name","value","whitelist","max","minlength","maxlength","allowUpperCase","allowDuplicates","validation","duration","required","chips","invalid","padding","rounded"];let d=oe(e,_);const h=Ke();let{input:r=""}=e,{name:p}=e,{value:f=[]}=e,{whitelist:g=[]}=e,{max:E=-1}=e,{minlength:S=-1}=e,{maxlength:I=-1}=e,{allowUpperCase:k=!1}=e,{allowDuplicates:m=!1}=e,{validation:c=()=>!0}=e,{duration:b=150}=e,{required:y=!1}=e,{chips:V="variant-filled"}=e,{invalid:A="input-error"}=e,{padding:w="p-2"}=e,{rounded:F="rounded-container-token"}=e,J=!0,L=f.map(u=>({val:u,id:Math.random()}));function ae(){t(0,f=[])}let K;Ze(()=>{if(!K.form)return;const u=K.form;return u.addEventListener("reset",ae),()=>{u.removeEventListener("reset",ae)}});function Te(){t(26,J=!0)}function Ue(){return!(!r||(t(1,r=r.trim()),c!==void 0&&!c(r))||E!==-1&&f.length>=E||S!==-1&&r.length<S||I!==-1&&r.length>I||g.length>0&&!g.includes(r)||m===!1&&f.includes(r))}function qe(u){if(u.preventDefault(),t(26,J=Ue()),J===!1){h("invalid",{event:u,input:r});return}t(1,r=k?r:r.toLowerCase()),f.push(r),t(0,f),L.push({val:r,id:Math.random()}),t(6,L),t(0,f),h("add",{event:u,chipIndex:f.length-1,chipValue:r}),t(1,r="")}function se(u,B,j){d.disabled||(f.splice(B,1),t(0,f),L.splice(B,1),t(6,L),t(0,f),h("remove",{event:u,chipIndex:B,chipValue:j}))}function Pe(u){z.call(this,l,u)}function Ve(u){z.call(this,l,u)}function Ae(u){z.call(this,l,u)}function Le(u){z.call(this,l,u)}function Be(u){z.call(this,l,u)}function He(u){z.call(this,l,u)}function Oe(u){z.call(this,l,u)}function Re(u){Ie[u?"unshift":"push"](()=>{K=u,t(7,K)})}function Fe(){f=Ge(this),t(0,f)}function ze(){r=this.value,t(1,r)}const Ye=(u,B,j)=>{se(j,u,B)};return l.$$set=u=>{t(42,e=fe(fe({},e),ce(u))),t(15,d=oe(e,_)),"input"in u&&t(1,r=u.input),"name"in u&&t(2,p=u.name),"value"in u&&t(0,f=u.value),"whitelist"in u&&t(16,g=u.whitelist),"max"in u&&t(17,E=u.max),"minlength"in u&&t(18,S=u.minlength),"maxlength"in u&&t(19,I=u.maxlength),"allowUpperCase"in u&&t(20,k=u.allowUpperCase),"allowDuplicates"in u&&t(21,m=u.allowDuplicates),"validation"in u&&t(22,c=u.validation),"duration"in u&&t(3,b=u.duration),"required"in u&&t(4,y=u.required),"chips"in u&&t(5,V=u.chips),"invalid"in u&&t(23,A=u.invalid),"padding"in u&&t(24,w=u.padding),"rounded"in u&&t(25,F=u.rounded)},l.$$.update=()=>{l.$$.dirty[0]&75497472&&t(27,n=J===!1?A:""),t(11,s=`${dt} ${w} ${F} ${e.class??""} ${n}`),l.$$.dirty[0]&65&&t(6,L=f.map((u,B)=>{var j;return((j=L[B])==null?void 0:j.val)===u?L[B]:{id:Math.random(),val:u}}))},t(10,i=`${pt}`),t(9,a=`${mt}`),t(8,o=`${_t}`),e=ce(e),[f,r,p,b,y,V,L,K,o,a,i,s,Te,qe,se,d,g,E,S,I,k,m,c,A,w,F,J,n,Pe,Ve,Ae,Le,Be,He,Oe,Re,Fe,ze,Ye]}class vt extends Se{constructor(e){super(),De(this,e,gt,ht,ye,{input:1,name:2,value:0,whitelist:16,max:17,minlength:18,maxlength:19,allowUpperCase:20,allowDuplicates:21,validation:22,duration:3,required:4,chips:5,invalid:23,padding:24,rounded:25},null,[-1,-1])}}function bt(l){let e,t,n,s,i,a,o,_,d;function h(p){l[7](p)}let r={name:"altNames",placeholder:"Enter Abbreviations or Alternative Names"};return l[3]!==void 0&&(r.value=l[3]),n=new vt({props:r}),Ie.push(()=>et(n,"value",h)),{c(){e=D("input"),t=O(),Q(n.$$.fragment),i=O(),a=D("input"),this.h()},l(p){e=N(p,"INPUT",{class:!0,title:!0,type:!0,placeholder:!0}),t=R(p),W(n.$$.fragment,p),i=R(p),a=N(p,"INPUT",{class:!0,title:!0,type:!0,placeholder:!0}),this.h()},h(){v(e,"class","input m-2"),v(e,"title","School Name"),v(e,"type","text"),v(e,"placeholder","School Name"),v(a,"class","input m-2"),v(a,"title","Email"),v(a,"type","email"),v(a,"placeholder","School Email")},m(p,f){U(p,e,f),P(e,l[0]),U(p,t,f),X(n,p,f),U(p,i,f),U(p,a,f),P(a,l[1]),o=!0,_||(d=[M(e,"input",l[6]),M(a,"input",l[8])],_=!0)},p(p,f){f&1&&e.value!==p[0]&&P(e,p[0]);const g={};!s&&f&8&&(s=!0,g.value=p[3],Qe(()=>s=!1)),n.$set(g),f&2&&a.value!==p[1]&&P(a,p[1])},i(p){o||(H(n.$$.fragment,p),o=!0)},o(p){Y(n.$$.fragment,p),o=!1},d(p){p&&(C(e),C(t),C(i),C(a)),x(n,p),_=!1,ie(d)}}}function kt(l){let e;return{c(){e=ee("Info")},l(t){e=te(t,"Info")},m(t,n){U(t,e,n)},d(t){t&&C(e)}}}function yt(l){let e,t,n;return{c(){e=D("input"),this.h()},l(s){e=N(s,"INPUT",{class:!0,type:!0,name:!0,placeholder:!0}),this.h()},h(){v(e,"class","input m-2"),v(e,"type","text"),v(e,"name","Code"),v(e,"placeholder","Check your Email!")},m(s,i){U(s,e,i),P(e,l[2]),t||(n=M(e,"input",l[9]),t=!0)},p(s,i){i&4&&e.value!==s[2]&&P(e,s[2])},d(s){s&&C(e),t=!1,n()}}}function Ct(l){let e;return{c(){e=ee("Check Your Email")},l(t){e=te(t,"Check Your Email")},m(t,n){U(t,e,n)},d(t){t&&C(e)}}}function Et(l){let e,t,n,s;return e=new pe({props:{locked:!(l[0]&&me(l[1])),$$slots:{header:[kt],default:[bt]},$$scope:{ctx:l}}}),n=new pe({props:{locked:!l[2],$$slots:{header:[Ct],default:[yt]},$$scope:{ctx:l}}}),{c(){Q(e.$$.fragment),t=O(),Q(n.$$.fragment)},l(i){W(e.$$.fragment,i),t=R(i),W(n.$$.fragment,i)},m(i,a){X(e,i,a),U(i,t,a),X(n,i,a),s=!0},p(i,a){const o={};a&3&&(o.locked=!(i[0]&&me(i[1]))),a&1035&&(o.$$scope={dirty:a,ctx:i}),e.$set(o);const _={};a&4&&(_.locked=!i[2]),a&1028&&(_.$$scope={dirty:a,ctx:i}),n.$set(_)},i(i){s||(H(e.$$.fragment,i),H(n.$$.fragment,i),s=!0)},o(i){Y(e.$$.fragment,i),Y(n.$$.fragment,i),s=!1},d(i){i&&C(t),x(e,i),x(n,i)}}}function It(l){let e,t='<h2 class="h2">Signup!</h2>',n,s,i;return s=new at({props:{class:"card p-4",$$slots:{default:[Et]},$$scope:{ctx:l}}}),s.$on("complete",l[4]),s.$on("step",l[5]),{c(){e=D("header"),e.innerHTML=t,n=O(),Q(s.$$.fragment),this.h()},l(a){e=N(a,"HEADER",{class:!0,["data-svelte-h"]:!0}),Ee(e)!=="svelte-572ii9"&&(e.innerHTML=t),n=R(a),W(s.$$.fragment,a),this.h()},h(){v(e,"class","mx-auto mb-5 text-center")},m(a,o){U(a,e,o),U(a,n,o),X(s,a,o),i=!0},p(a,[o]){const _={};o&1039&&(_.$$scope={dirty:o,ctx:a}),s.$set(_)},i(a){i||(H(s.$$.fragment,a),i=!0)},o(a){Y(s.$$.fragment,a),i=!1},d(a){a&&(C(e),C(n)),x(s,a)}}}function St(l,e,t){let n="",s="",i="",a=["high","middle","mtn"];async function o(){const f=await st("register",{code:i});f.status===200?tt("Congrats! You're done registering this school!",()=>{window.close()}):le("An error has occured: "+f.data.detail)}async function _(f){if(f.detail.step!==0&&f.detail.step+1!==f.detail.state.current)return;const g=await rt("register",{name:n,altnames:a,email:s});g.status===200?le("Please check your email!"):le("An error has occured: "+g.error.detail)}function d(){n=this.value,t(0,n)}function h(f){a=f,t(3,a)}function r(){s=this.value,t(1,s)}function p(){i=this.value,t(2,i)}return[n,s,i,a,o,_,d,h,r,p]}class Vt extends Se{constructor(e){super(),De(this,e,St,It,ye,{})}}export{Vt as component};
