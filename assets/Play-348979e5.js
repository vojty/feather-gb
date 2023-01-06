import{c as Me,r as p,j as r,_ as Ue,Z as Fe,s as f,C as ie,a as g,u as We,F as Ge,b as He,d as ze,L as pe}from"./index-b613d1c1.js";import{_ as Ke}from"./__vite-plugin-wasm-helper-2f5b93cf.js";import{r as Ze}from"./romsList-6ed61065.js";var ce={},J={},de={},A={},B={};Object.defineProperty(B,"__esModule",{value:!0});B.isBrowser=void 0;B.isBrowser=function(){return typeof window<"u"&&typeof window.document<"u"};Object.defineProperty(A,"__esModule",{value:!0});A.storage=A.MemoryStorageProxy=A.LocalStorageProxy=A.localStorageAvailable=void 0;var Ve=B;function ve(){try{var e="@rehooks/local-storage:"+new Date().toISOString();return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(t){return Ve.isBrowser()&&t instanceof DOMException&&(t.code===22||t.code===1014||t.name==="QuotaExceededError"||t.name==="NS_ERROR_DOM_QUOTA_REACHED")&&localStorage&&localStorage.length!==0}}A.localStorageAvailable=ve;var Ee=function(){function e(){}return e.prototype.getItem=function(t){return localStorage.getItem(t)},e.prototype.setItem=function(t,n){localStorage.setItem(t,n)},e.prototype.removeItem=function(t){localStorage.removeItem(t)},e}();A.LocalStorageProxy=Ee;var xe=function(){function e(){this._memoryStorage=new Map}return e.prototype.getItem=function(t){var n;return(n=this._memoryStorage.get(t))!==null&&n!==void 0?n:null},e.prototype.setItem=function(t,n){this._memoryStorage.set(t,n)},e.prototype.removeItem=function(t){this._memoryStorage.delete(t)},e}();A.MemoryStorageProxy=xe;var Ye=function(e){return e?new Ee:new xe};A.storage=Ye(ve());(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.deleteFromStorage=e.writeStorage=e.isTypeOfLocalStorageChanged=e.LOCAL_STORAGE_CHANGE_EVENT_NAME=void 0;var t=A,n=B;e.LOCAL_STORAGE_CHANGE_EVENT_NAME="onLocalStorageChange",function(){if(!n.isBrowser()||typeof Me.window.CustomEvent=="function")return;function s(d,l){var m,h;l===void 0&&(l={bubbles:!1,cancelable:!1});var w=document.createEvent("CustomEvent");return w.initCustomEvent(d,(m=l?.bubbles)!==null&&m!==void 0?m:!1,(h=l?.cancelable)!==null&&h!==void 0?h:!1,l?.detail),w}window.CustomEvent=s}();function c(s){return!!s&&s.type===e.LOCAL_STORAGE_CHANGE_EVENT_NAME}e.isTypeOfLocalStorageChanged=c;function i(s,d){if(n.isBrowser())try{t.storage.setItem(s,typeof d=="object"?JSON.stringify(d):""+d),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:s,value:d}}))}catch(l){throw l instanceof TypeError&&l.message.includes("circular structure")?new TypeError(`The object that was given to the writeStorage function has circular references.
For more information, check here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value`):l}}e.writeStorage=i;function u(s){n.isBrowser()&&(t.storage.removeItem(s),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:s,value:null}})))}e.deleteFromStorage=u})(de);Object.defineProperty(J,"__esModule",{value:!0});J.useLocalStorage=void 0;var O=de,Je=B,Q=A,D=p;function me(e){try{return JSON.parse(e)}catch{return e}}function Xe(e,t){t===void 0&&(t=null);var n=D.useState(Q.storage.getItem(e)===null?t:me(Q.storage.getItem(e))),c=n[0],i=n[1],u=D.useCallback(function(m){O.isTypeOfLocalStorageChanged(m)?m.detail.key===e&&i(m.detail.value):m.key===e&&i(m.newValue===null?null:me(m.newValue))},[i,e]);D.useEffect(function(){if(Je.isBrowser()){var m=function(h){u(h)};return window.addEventListener(O.LOCAL_STORAGE_CHANGE_EVENT_NAME,m),window.addEventListener("storage",m),Q.storage.getItem(e)===null&&t!==null&&O.writeStorage(e,t),function(){window.removeEventListener(O.LOCAL_STORAGE_CHANGE_EVENT_NAME,m),window.removeEventListener("storage",m)}}},[e,t,u]);var s=D.useCallback(function(m){return O.writeStorage(e,m)},[e]),d=D.useCallback(function(){return O.deleteFromStorage(e)},[e]),l=c??t;return[l,s,d]}J.useLocalStorage=Xe;(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.useLocalStorage=void 0;var t=J;Object.defineProperty(e,"useLocalStorage",{enumerable:!0,get:function(){return t.useLocalStorage}});var n=de;Object.defineProperty(e,"writeStorage",{enumerable:!0,get:function(){return n.writeStorage}}),Object.defineProperty(e,"deleteFromStorage",{enumerable:!0,get:function(){return n.deleteFromStorage}}),e.default=t.useLocalStorage})(ce);const qe="/feather-gb/assets/gb_web_bg-0ea950c9.wasm",S=new Array(32).fill(void 0);S.push(void 0,null,!0,!1);function C(e){return S[e]}let P=S.length;function W(e){P===S.length&&S.push(S.length+1);const t=P;return P=S[t],S[t]=e,t}function Qe(e){e<36||(S[e]=P,P=e)}function et(e){const t=C(e);return Qe(e),t}function ae(e){const t=typeof e;if(t=="number"||t=="boolean"||e==null)return`${e}`;if(t=="string")return`"${e}"`;if(t=="symbol"){const i=e.description;return i==null?"Symbol":`Symbol(${i})`}if(t=="function"){const i=e.name;return typeof i=="string"&&i.length>0?`Function(${i})`:"Function"}if(Array.isArray(e)){const i=e.length;let u="[";i>0&&(u+=ae(e[0]));for(let s=1;s<i;s++)u+=", "+ae(e[s]);return u+="]",u}const n=/\[object ([^\]]+)\]/.exec(toString.call(e));let c;if(n.length>1)c=n[1];else return toString.call(e);if(c=="Object")try{return"Object("+JSON.stringify(e)+")"}catch{return"Object"}return e instanceof Error?`${e.name}: ${e.message}
${e.stack}`:c}let N=0,ee=new Uint8Array;function M(){return ee.byteLength===0&&(ee=new Uint8Array(X.buffer)),ee}const tt=typeof TextEncoder>"u"?(0,module.require)("util").TextEncoder:TextEncoder;let z=new tt("utf-8");const nt=typeof z.encodeInto=="function"?function(e,t){return z.encodeInto(e,t)}:function(e,t){const n=z.encode(e);return t.set(n),{read:e.length,written:n.length}};function $e(e,t,n){if(n===void 0){const d=z.encode(e),l=t(d.length);return M().subarray(l,l+d.length).set(d),N=d.length,l}let c=e.length,i=t(c);const u=M();let s=0;for(;s<c;s++){const d=e.charCodeAt(s);if(d>127)break;u[i+s]=d}if(s!==c){s!==0&&(e=e.slice(s)),i=n(i,c,c=s+e.length*3);const d=M().subarray(i+s,i+c),l=nt(e,d);s+=l.written}return N=s,i}let te=new Int32Array;function Z(){return te.byteLength===0&&(te=new Int32Array(X.buffer)),te}const rt=typeof TextDecoder>"u"?(0,module.require)("util").TextDecoder:TextDecoder;let Te=new rt("utf-8",{ignoreBOM:!0,fatal:!0});Te.decode();function Ce(e,t){return Te.decode(M().subarray(e,e+t))}function ot(e,t){const n=t(e.length*1);return M().set(e,n/1),N=e.length,n}function Mn(){return bt()>>>0}function it(e,t){if(!(e instanceof t))throw new Error(`expected instance of ${t.name}`);return e.ptr}let U=32;function we(e){if(U==1)throw new Error("out of js stack");return S[--U]=e,U}function Un(){$t()}function ct(e,t){try{return e.apply(this,t)}catch(n){Ct(W(n))}}const _=Object.freeze({ArrowDown:0,0:"ArrowDown",ArrowLeft:1,1:"ArrowLeft",ArrowRight:2,2:"ArrowRight",ArrowUp:3,3:"ArrowUp",A:4,4:"A",B:5,5:"B",Start:6,6:"Start",Select:7,7:"Select"});class V{static __wrap(t){const n=Object.create(V.prototype);return n.ptr=t,n}__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const t=this.__destroy_into_raw();mt(t)}constructor(t){const n=ot(t,fe),i=wt(n,N);return V.__wrap(i)}}class se{static __wrap(t){const n=Object.create(se.prototype);return n.ptr=t,n}__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const t=this.__destroy_into_raw();ht(t)}constructor(t,n){try{it(t,V);var c=t.ptr;t.ptr=0;const i=yt(c,we(n));return se.__wrap(i)}finally{S[U++]=void 0}}run_frame(){St(this.ptr)}get_canvas_data_pointer(){return At(this.ptr)}on_key_down(t){vt(this.ptr,t)}on_key_up(t){Et(this.ptr,t)}set_audio_buffer_callback(t){try{xt(this.ptr,we(t))}finally{S[U++]=void 0}}}function at(e){const t=C(e);return W(t)}function st(){const e=new Error;return W(e)}function lt(e,t){const n=C(t).stack,c=$e(n,fe,Le),i=N;Z()[e/4+1]=i,Z()[e/4+0]=c}function ut(e,t){try{console.error(Ce(e,t))}finally{Tt(e,t)}}function dt(e){et(e)}function ft(e){return W(e)}function _t(){return ct(function(e,t,n){const c=C(e).call(C(t),C(n));return W(c)},arguments)}function gt(e,t){const n=ae(C(t)),c=$e(n,fe,Le),i=N;Z()[e/4+1]=i,Z()[e/4+0]=c}function pt(e,t){throw new Error(Ce(e,t))}URL=globalThis.URL;const b=await Ke({"./gb_web_bg.js":{__wbindgen_object_clone_ref:at,__wbg_new_693216e109162396:st,__wbg_stack_0ddaca5d1abfb52f:lt,__wbg_error_09919627ac0992f5:ut,__wbindgen_object_drop_ref:dt,__wbindgen_number_new:ft,__wbg_call_65af9f665ab6ade5:_t,__wbindgen_debug_string:gt,__wbindgen_throw:pt}},qe),X=b.memory,mt=b.__wbg_webcartridge_free,wt=b.webcartridge_new,bt=b.get_audio_buffer_size,ht=b.__wbg_webemulator_free,yt=b.webemulator_new,St=b.webemulator_run_frame,At=b.webemulator_get_canvas_data_pointer,vt=b.webemulator_on_key_down,Et=b.webemulator_on_key_up,xt=b.webemulator_set_audio_buffer_callback,$t=b.init,fe=b.__wbindgen_malloc,Le=b.__wbindgen_realloc,Tt=b.__wbindgen_free,Ct=b.__wbindgen_exn_store,_e=p.createContext({input:[],onKeyDown:()=>{},onKeyUp:()=>{}});function Lt({children:e}){const[t,n]=p.useState([]),c=p.useCallback(u=>{n(s=>s.filter(d=>u!==d))},[]),i=p.useCallback(u=>{n(s=>s.includes(u)?s:[...s,u])},[]);return r(_e.Provider,{value:{input:t,onKeyUp:c,onKeyDown:i},children:e})}const ne={ArrowDown:_.ArrowDown,ArrowUp:_.ArrowUp,ArrowLeft:_.ArrowLeft,ArrowRight:_.ArrowRight,KeyD:_.ArrowRight,KeyA:_.ArrowLeft,KeyW:_.ArrowUp,KeyS:_.ArrowDown,KeyJ:_.A,KeyX:_.A,KeyK:_.B,KeyC:_.B,KeyB:_.Start,KeyN:_.Select};function Ot(){const{onKeyDown:e,onKeyUp:t,input:n}=p.useContext(_e),c=p.useRef();return p.useEffect(()=>{Object.values(ne).forEach(u=>{n.includes(u)?c.current?.on_key_down(u):c.current?.on_key_up(u)})},[n]),p.useEffect(()=>{const u=d=>{const l=ne[d.code];l!==void 0&&e(l)},s=d=>{const l=ne[d.code];l!==void 0&&t(l)};return window.addEventListener("keydown",u),window.addEventListener("keyup",s),()=>{window.removeEventListener("keydown",u),window.removeEventListener("keyup",s)}},[]),p.useCallback(u=>{c.current=u},[])}function Nt(){const[e,t]=p.useState(null);return p.useEffect(()=>{Ue(()=>import("./gb_web-6d919686.js"),["assets/gb_web-6d919686.js","assets/index-b613d1c1.js","assets/index-ee4e9d2f.css","assets/__vite-plugin-wasm-helper-2f5b93cf.js","assets/romsList-6ed61065.js"]).then(n=>{n.init(),t(n)}).catch(console.error)},[]),e}let be=!1;function Bt(e){if(be)return;be=!0;const t=e.createBuffer(1,1,e.sampleRate),n=e.createBufferSource();n.buffer=t,n.connect(e.destination),n.start(0),e.resume()}function he(e,t,n=1){if(n>0&&e>=t||n<0&&e<=t)return[];const c=[];for(let i=e;n>0?i<t:i>t;i+=n)c.push(i);return c}function Rt(e){return fetch(e).then(t=>t.arrayBuffer()).then(t=>new Uint8Array(t))}function Dt(){return p.useContext(_e)}function It(){return Fe()}const Oe=45,Ne=23,Be=6,re=9,kt=20,jt=13,K=36,Re=25,Y=26,Pt="#393C81",Mt="#8A205E";function o(e){return t=>`${t.theme.zoom*e}px`}function ge(){return ie`
    filter: brightness(80%);
  `}const Ut=f.div`
  display: flex;
  justify-content: center;
`,Ft=f.div`
  display: inline-block;
  margin: 10px;
  background: #eee;
  border-radius: 10px 10px 60px 10px;
  box-shadow: 5px 5px rgba(0, 0, 0, 0.1);
  padding: ${o(20)};
  color: ${Pt};
  position: relative;
`,Wt=f.div`
  background-color: #777;
  border-radius: ${o(7)} ${o(7)} ${o(40)} ${o(7)};
  box-shadow: inset 0px 0px 20px 0px rgba(0, 0, 0, 0.66);
`,Gt=f.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${o(Ne)};
  font-size: ${o(Be)};
  font-family: Arial;
  color: #b3b3b3;
  padding: 0 ${o(8)} 0;
`,Ht=f.div`
  flex: 0 0 auto;
  margin: 0 ${o(5)};
`,zt=f.div`
  display: flex;
  margin-right: ${o(Oe)};
  padding-bottom: ${o(Ne)};
`,Kt=f.div`
  flex: 1 1 ${e=>e.width};
  height: ${o(3)};
  background-color: #8b1d90;
  box-shadow: 0 ${o(2*3)} 0 #283593;
  margin-top: -${o(2*3)};
`,Zt=f.div`
  margin-left: auto;
  margin-right: auto;
  position: relative;
`,Vt=f.div`
  position: absolute;
  box-shadow: inset 5px 5px 5px 0px rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`,Yt=f.div`
  background-color: ${e=>e.enabled?"#f00":"#000"};
  box-shadow: 0 0 3px 1px #ef5350;
  height: ${o(re)};
  width: ${o(re)};
  border-radius: ${e=>e.theme.zoom*re/2}px;
  margin: 10px 20px 10px 10px;
  box-shadow: inset 0px 0px 5px 0px rgba(0, 0, 0, 0.66);
`,Jt=f.div`
  font-family: Arial;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #b3b3b3;
  width: ${o(Oe)};
  font-size: ${o(Be)};
  margin-bottom: 80px;
`,Xt=f.div`
  letter-spacing: 1px;
  font-size: ${o(jt)};
`,qt=f.div`
  margin-left: ${o(2)};
  font-size: ${o(kt)};
`,Qt=f.div`
  font-size: ${o(6)};
`,en=f.div`
  background-color: ${Mt};
  height: ${o(K)};
  width: ${o(K)};
  border-radius: ${o(K/2)};

  ${e=>e.$pressed&&ge()}
`,tn=f.div`
  position: relative;
`,nn=f.div`
  font-size: ${o(12)};
  letter-spacing: ${o(1)};
`,De=f(nn)`
  margin-top: ${e=>o(e.$spacing)};
`,rn=f.div`
  display: inline-flex;
  margin-top: ${o(10)};
  margin-right: -${o(12)};
  transform: rotate(-${Re}deg);
  padding: ${o(5)};

  background-color: #dfdfdf;
  box-shadow: 0 0 0 5px #dfdfdf;
  border-radius: ${o(K)};

  > * + * {
    margin-left: ${o(18)};
  }

  ${De} {
    bottom: -${o(25)};
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
  }
`,le=f.div`
  transform: rotate(-${Re}deg);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`,on=f.div`
  border-radius: ${o((9+2*5)/2)};
  background-color: #dfdfdf;
  padding: ${o(5)};
`,cn=f.div`
  background-color: #868a8d;
  width: ${o(38)};
  height: ${o(9)};
  border-radius: ${o(9/2)};
  ${e=>e.$pressed&&ge()}
`,an=f.div`
  display: flex;
  margin-left: ${o(80)};
  margin-top: ${o(30)};
  margin-bottom: ${o(40)};
  ${le} + ${le} {
    margin-left: ${o(7)};
  }
`,sn=f.div``;var j=(e=>(e[e.HORIZONTAL=0]="HORIZONTAL",e[e.VERTICAL=1]="VERTICAL",e))(j||{});const ln=f.div`
  display: flex;
  justify-content: center;
`,Ie=f.div`
  width: ${o(2)};
  height: 80%;
  background-color: #353535;
  margin: ${o(2)};
  border-radius: ${o(5)};
`,ke=f.div`
  position: relative;
  height: ${o(Y)};
  width: ${o(Y)};
  background-color: #1b1d1d;
`,q=f(ke)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${e=>e.$orientation===1?"row":"column"};

  ${Ie} {
    ${e=>e.$pressed&&ge()}

    ${e=>e.$orientation===1?ie`
            width: ${o(3)};
            height: 60%;
          `:ie`
            height: ${o(3)};
            width: 60%;
          `};
  }
`,un=f(q)`
  border-radius: ${o(5)} 0 0 ${o(5)};
`,dn=f(q)`
  border-radius: ${o(5)} ${o(5)} 0 0;
`,fn=f(q)`
  border-radius: 0 ${o(5)} ${o(5)} 0;
`,_n=f(q)`
  border-radius: 0 0 ${o(5)} ${o(5)};
`,gn=f(ke)`
  &:before {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: ${o(Y-7)};
    width: ${o(Y-7)};
    background-color: #353535;
    border-radius: 100%;
  }
`,pn=f.div`
  display: flex;
  margin-top: ${o(35)};
`,ue=f.div`
  height: ${o(48)};
  width: ${o(5)};
  background-color: #a7a49f;
  border-radius: ${o(5)};
  box-shadow: inset 0px 0px 5px 0px rgb(95 95 95 / 66%);
`,mn=f.div`
  display: inline-flex;
  transform: rotate(-28deg);
  position: absolute;
  bottom: ${o(19)};
  right: ${o(15)};

  ${ue} + ${ue} {
    margin-left: ${o(8)};
  }
`,a={Wrapper:Ut,Device:Ft,Display:Wt,DisplayTop:Gt,DisplayHeaderText:Ht,DisplayContent:zt,DisplayLine:Kt,Screen:Zt,ScreenOverlay:Vt,Battery:Jt,BatteryIndicator:Yt,NintendoText:Xt,GameBoyText:qt,TradeMarkText:Qt,Controls:pn,ButtonsAB:rn,CircleButtonWrapper:tn,CircleButton:en,ButtonText:De,ButtonsStartSelect:an,WideButton:cn,WideButtonWrapper:on,WideButtonContainer:le,Arrows:sn,ArrowsLine:ln,ArrowUp:dn,ArrowDown:_n,ArrowLeft:un,ArrowRight:fn,ArrowCenter:gn,ArrowStripe:Ie,Speakers:mn,Speaker:ue};function wn(e){return g(a.Display,{children:[g(a.DisplayTop,{children:[r(a.DisplayLine,{width:"25%"}),r(a.DisplayHeaderText,{children:"DOT MATRIX WITH STEREO SOUND"}),r(a.DisplayLine,{width:"12%"})]}),g(a.DisplayContent,{children:[g(a.Battery,{children:[r(a.BatteryIndicator,{enabled:e.enabled}),"BATTERY"]}),g(a.Screen,{children:[e.children,r(a.ScreenOverlay,{})]})]})]})}const T=160,F=144;function bn({running:e},t){const{zoom:n}=It(),{input:c,onKeyDown:i,onKeyUp:u}=Dt(),s=c.includes(_.A),d=c.includes(_.B),l=c.includes(_.Start),m=c.includes(_.Select),h=c.includes(_.ArrowLeft),w=c.includes(_.ArrowRight),v=c.includes(_.ArrowUp),L=c.includes(_.ArrowDown);return r(a.Wrapper,{children:g(a.Device,{children:[r(wn,{enabled:e,children:r("canvas",{ref:t,style:{display:"block",imageRendering:"pixelated",zoom:n},height:F,width:T})}),g("div",{className:"flex items-baseline",children:[r(a.NintendoText,{className:"font-pretendo",children:"Nintendo"}),r(a.GameBoyText,{className:"font-gills-sans font-medium italic",children:"GAME BOY"}),r(a.TradeMarkText,{className:"font-bold",children:"TM"})]}),g(a.Controls,{children:[g(a.Arrows,{children:[r(a.ArrowsLine,{children:g(a.ArrowUp,{onPointerDown:()=>i(_.ArrowUp),onPointerUp:()=>u(_.ArrowUp),$orientation:j.HORIZONTAL,$pressed:v,children:[r(a.ArrowStripe,{}),r(a.ArrowStripe,{}),r(a.ArrowStripe,{})]})}),g(a.ArrowsLine,{children:[g(a.ArrowLeft,{onPointerDown:()=>i(_.ArrowLeft),onPointerUp:()=>u(_.ArrowLeft),$orientation:j.VERTICAL,$pressed:h,children:[r(a.ArrowStripe,{}),r(a.ArrowStripe,{}),r(a.ArrowStripe,{})]}),r(a.ArrowCenter,{}),g(a.ArrowRight,{onPointerDown:()=>i(_.ArrowRight),onPointerUp:()=>u(_.ArrowRight),$orientation:j.VERTICAL,$pressed:w,children:[r(a.ArrowStripe,{}),r(a.ArrowStripe,{}),r(a.ArrowStripe,{})]})]}),r(a.ArrowsLine,{children:g(a.ArrowDown,{onPointerDown:()=>i(_.ArrowDown),onPointerUp:()=>u(_.ArrowDown),$orientation:j.HORIZONTAL,$pressed:L,children:[r(a.ArrowStripe,{}),r(a.ArrowStripe,{}),r(a.ArrowStripe,{})]})})]}),r("div",{className:"ml-auto",children:g(a.ButtonsAB,{className:" font-nes",children:[g(a.CircleButtonWrapper,{children:[r(a.CircleButton,{onPointerDown:()=>i(_.B),onPointerUp:()=>u(_.B),$pressed:d}),r(a.ButtonText,{$spacing:10,children:"B"})]}),g(a.CircleButtonWrapper,{children:[r(a.CircleButton,{onPointerDown:()=>i(_.A),onPointerUp:()=>u(_.A),$pressed:s}),r(a.ButtonText,{$spacing:10,children:"A"})]})]})})]}),g(a.ButtonsStartSelect,{className:"font-nes",children:[g(a.WideButtonContainer,{children:[r(a.WideButtonWrapper,{children:r(a.WideButton,{onPointerDown:()=>i(_.Select),onPointerUp:()=>u(_.Select),$pressed:m})}),r(a.ButtonText,{$spacing:1,children:"SELECT"})]}),g(a.WideButtonContainer,{children:[r(a.WideButtonWrapper,{children:r(a.WideButton,{onPointerDown:()=>i(_.Start),onPointerUp:()=>u(_.Start),$pressed:l})}),r(a.ButtonText,{$spacing:1,children:"START"})]})]}),g(a.Speakers,{children:[r(a.Speaker,{}),r(a.Speaker,{}),r(a.Speaker,{}),r(a.Speaker,{}),r(a.Speaker,{}),r(a.Speaker,{})]})]})})}const hn=p.forwardRef(bn),yn="12px",H={Icon:f.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  `,Wrapper:f.div`
    font-size: ${yn};
    display: flex;
    align-items: center;
    justify-content: center;
  `,Value:f.div`
    margin: 0 5px;
  `};function Sn(e){const{zoom:t,onChange:n}=e;return g(H.Wrapper,{children:[r(H.Icon,{children:r("button",{type:"button",onClick:()=>n(Math.max(1,t-.5)),children:"-"})}),g(H.Value,{children:["Zoom: ",t.toFixed(1)]}),r(H.Icon,{children:r("button",{type:"button",onClick:()=>n(Math.min(t+.5,5)),children:"+"})})]})}const An=f.div`
  cursor: pointer;
`;function vn(){const e=We();return r(An,{onClick:()=>e(-1),children:"←"})}const je=Ze.filter(e=>["demos/cgb-acid2.gbc","demos/dmg-acid2.gb","demos/gejmboj.gb","demos/oh.gb","demos/opus5.gb","demos/pocket.gb"].includes(e.name)),En=je.find(e=>e.name==="demos/oh.gb")||null;function xn(e){const t=p.useCallback(n=>{n&&Rt(n.url).then(c=>e.onCartridgeLoad({name:n.name,bytes:c}))},[]);return p.useEffect(()=>{t(En)},[t]),r("table",{children:r("tbody",{children:je.map(n=>g("tr",{className:e.selectedName===n.name?"font-medium underline":"",children:[r("td",{className:"px-1",children:n.name}),r("td",{className:"px-1",children:r("button",{type:"button",onClick:()=>t(n),children:"Load"})})]},n.url))})})}const $n=12,oe=20,ye=30,Tn=64,Cn=f.span`
  font-size: ${$n}px;
`,Ln=f.canvas`
  display: inline-block;
`,I=[];function On(){const e=p.useRef(window.performance.now()),t=p.useRef(null),n=p.useRef(0);return p.useEffect(()=>{function c(){n.current=window.requestAnimationFrame(()=>{const i=window.performance.now(),u=i-e.current;e.current=i;const s=Math.round(1e3/u);I.push(s),I.length>Tn&&I.shift();const d=Math.round(I.reduce((m,h)=>m+h)/I.length),l=t.current?.getContext("2d");l&&(l.clearRect(0,0,ye,oe),l.textBaseline="middle",l.font="12px Arial",l.fillText(d.toString(),1,oe/2+1)),c()})}return c(),()=>window.cancelAnimationFrame(n.current)},[]),g(Cn,{className:"flex items-center justify-end",children:["Average FPS: ",r(Ln,{width:ye,height:oe,ref:t})]})}function Nn(e){const{onLoad:t,className:n,children:c}=e;return g(Ge,{children:[r("input",{onChange:u=>{const{files:s}=u.currentTarget;if(!s)return;const d=s[0];d.arrayBuffer().then(l=>new Uint8Array(l)).then(l=>t({name:`Custom: ${d.name}`,bytes:l,custom:!0}))},accept:".gb,.gbc",style:{display:"none"},id:"file",multiple:!0,type:"file"}),r("label",{className:n,htmlFor:"file",children:c})]})}const Bn=1.5,Rn="#6D7C00",E=new AudioContext({sampleRate:44100});function Dn(e,t){const n=e.get_canvas_data_pointer(),c=t.createImageData(T,F),i=new Uint8Array(X.buffer,n,T*F*3);he(0,F).forEach(u=>{he(0,T).forEach(s=>{const d=(u*T+s)*3,l=(u*T+s)*4;c.data[l]=i[d],c.data[l+1]=i[d+1],c.data[l+2]=i[d+2],c.data[l+3]=255})}),t.putImageData(c,0,0)}function Se(e){e.fillStyle=Rn,e.fillRect(0,0,T,F)}const k=2;function In(e){const{bytes:t,wasmModule:n,running:c,ctx:i,soundEnabled:u}=e,s=p.useRef(),d=p.useRef(0),l=p.useRef(0),m=Ot();p.useEffect(()=>{Se(i)},[i]);const h=p.useCallback(w=>{const v=n.get_audio_buffer_size(),L=new Float32Array(X.buffer,w,v),R=L.length/k,y=E.createBuffer(k,R,E.sampleRate);for(let $=0;$<k;$+=1){const Pe=y.getChannelData($);for(let G=0;G<R;G+=1)Pe[G]=L[G*k+$]}const x=E.createBufferSource();x.buffer=y,x.connect(E.destination),d.current<=E.currentTime+.02&&(d.current=E.currentTime+.06),x.start(d.current),d.current+=v/k/E.sampleRate},[]);return p.useEffect(()=>{if(!t)return;const w=new n.WebCartridge(t);d.current=0,s.current=new n.WebEmulator(w,()=>{}),Se(i),m(s.current)},[t,n,m]),p.useEffect(()=>{const w=s.current;w&&w.set_audio_buffer_callback(u?h:()=>{})},[s.current,u,h]),p.useEffect(()=>{const w=s.current;if(w)if(c){const v=()=>{w.run_frame(),Dn(w,i),l.current=window.requestAnimationFrame(v)};v()}else window.cancelAnimationFrame(l.current)},[c]),null}function Ae(){const[e,t]=ce.useLocalStorage("zoom",Bn),[n,c]=ce.useLocalStorage("sound_enabled",!1),[i,u]=p.useState(!1),[s,d]=p.useState(),[l,m]=p.useState(null),h={zoom:e},w=Nt(),v=()=>{Bt(E),u(y=>y?!1:!!(!y&&l))},L=p.useCallback(y=>{y&&d(x=>{if(x)return x;const $=y.getContext("2d");return $||x})},[]),R=y=>{u(!1),m(y)};return w?r("div",{className:"select-none",children:r(Lt,{children:g(ze,{theme:h,children:[g("div",{className:"grid grid-cols-3 justify-between items-center mx-2 pt-2",children:[r(vn,{}),r(Sn,{zoom:e,onChange:t}),r("div",{className:"justify-end",children:r(On,{})})]}),r(hn,{running:i,ref:L}),s&&r(In,{bytes:l?.bytes,wasmModule:w,running:i,soundEnabled:n,ctx:s}),g("div",{className:"mt-2 flex justify-center items-center text-xs",children:[r("button",{className:"mx-2 border rounded px-1 py-1",type:"button",onClick:v,children:i?"Stop":"Run"}),r(Nn,{className:"mx-2 border rounded px-1 py-1",onLoad:R,children:"Upload ROM"}),g("label",{className:"flex justify-center items-center",htmlFor:"soundEnableCheckbox",children:[r("input",{id:"soundEnableCheckbox",className:"mr-1",type:"checkbox",checked:n,onChange:y=>c(y.currentTarget.checked)}),"Enable sound"]})]}),l?.custom&&r("div",{className:"mt-2 flex justify-center text-xs",children:l.name}),r("div",{className:"mt-2 flex justify-center text-xs",children:r(xn,{selectedName:l?.name,onCartridgeLoad:R})}),r("div",{className:"mt-2 flex text-center justify-center text-xs",children:g("div",{children:[r("p",{children:"Select one of the available demos or upload your custom *.gb file and press Run"}),g("p",{children:["The test ROMs are available in"," ",r(pe,{className:"underline",to:"/debug",children:"debug mode"}),". You can see the test results"," ",r(pe,{className:"underline",to:"/test-results",children:"here"}),"."]})]})})]})})}):r(He,{})}const Fn=Object.freeze(Object.defineProperty({__proto__:null,Play:Ae,default:Ae},Symbol.toStringTag,{value:"Module"}));export{_ as J,Fn as P,V as W,at as _,se as a,st as b,lt as c,ut as d,dt as e,ft as f,Mn as g,_t as h,Un as i,gt as j,pt as k};
