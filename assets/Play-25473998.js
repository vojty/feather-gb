import{c as Ze,r as w,j as r,_ as Ve,Z as Ye,s as f,C as ce,a as g,u as Je,F as Xe,b as qe,d as Qe,L as we}from"./index-95081162.js";import{_ as et}from"./__vite-plugin-wasm-helper-2f5b93cf.js";import{r as tt}from"./romsList-6ed61065.js";var ae={},ee={},de={},v={},R={};Object.defineProperty(R,"__esModule",{value:!0});R.isBrowser=void 0;R.isBrowser=function(){return typeof window<"u"&&typeof window.document<"u"};Object.defineProperty(v,"__esModule",{value:!0});v.storage=v.MemoryStorageProxy=v.LocalStorageProxy=v.localStorageAvailable=void 0;var nt=R;function Ae(){try{var e="@rehooks/local-storage:"+new Date().toISOString();return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(t){return nt.isBrowser()&&t instanceof DOMException&&(t.code===22||t.code===1014||t.name==="QuotaExceededError"||t.name==="NS_ERROR_DOM_QUOTA_REACHED")&&localStorage&&localStorage.length!==0}}v.localStorageAvailable=Ae;var ve=function(){function e(){}return e.prototype.getItem=function(t){return localStorage.getItem(t)},e.prototype.setItem=function(t,n){localStorage.setItem(t,n)},e.prototype.removeItem=function(t){localStorage.removeItem(t)},e}();v.LocalStorageProxy=ve;var Ee=function(){function e(){this._memoryStorage=new Map}return e.prototype.getItem=function(t){var n;return(n=this._memoryStorage.get(t))!==null&&n!==void 0?n:null},e.prototype.setItem=function(t,n){this._memoryStorage.set(t,n)},e.prototype.removeItem=function(t){this._memoryStorage.delete(t)},e}();v.MemoryStorageProxy=Ee;var rt=function(e){return e?new ve:new Ee};v.storage=rt(Ae());(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.deleteFromStorage=e.writeStorage=e.isTypeOfLocalStorageChanged=e.LOCAL_STORAGE_CHANGE_EVENT_NAME=void 0;var t=v,n=R;e.LOCAL_STORAGE_CHANGE_EVENT_NAME="onLocalStorageChange",function(){if(!n.isBrowser()||typeof Ze.window.CustomEvent=="function")return;function s(d,l){var b,y;l===void 0&&(l={bubbles:!1,cancelable:!1});var m=document.createEvent("CustomEvent");return m.initCustomEvent(d,(b=l?.bubbles)!==null&&b!==void 0?b:!1,(y=l?.cancelable)!==null&&y!==void 0?y:!1,l?.detail),m}window.CustomEvent=s}();function c(s){return!!s&&s.type===e.LOCAL_STORAGE_CHANGE_EVENT_NAME}e.isTypeOfLocalStorageChanged=c;function i(s,d){if(n.isBrowser())try{t.storage.setItem(s,typeof d=="object"?JSON.stringify(d):""+d),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:s,value:d}}))}catch(l){throw l instanceof TypeError&&l.message.includes("circular structure")?new TypeError(`The object that was given to the writeStorage function has circular references.
For more information, check here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value`):l}}e.writeStorage=i;function u(s){n.isBrowser()&&(t.storage.removeItem(s),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:s,value:null}})))}e.deleteFromStorage=u})(de);Object.defineProperty(ee,"__esModule",{value:!0});ee.useLocalStorage=void 0;var N=de,ot=R,ne=v,I=w;function be(e){try{return JSON.parse(e)}catch{return e}}function it(e,t){t===void 0&&(t=null);var n=I.useState(ne.storage.getItem(e)===null?t:be(ne.storage.getItem(e))),c=n[0],i=n[1],u=I.useCallback(function(b){N.isTypeOfLocalStorageChanged(b)?b.detail.key===e&&i(b.detail.value):b.key===e&&i(b.newValue===null?null:be(b.newValue))},[i,e]);I.useEffect(function(){if(ot.isBrowser()){var b=function(y){u(y)};return window.addEventListener(N.LOCAL_STORAGE_CHANGE_EVENT_NAME,b),window.addEventListener("storage",b),ne.storage.getItem(e)===null&&t!==null&&N.writeStorage(e,t),function(){window.removeEventListener(N.LOCAL_STORAGE_CHANGE_EVENT_NAME,b),window.removeEventListener("storage",b)}}},[e,t,u]);var s=I.useCallback(function(b){return N.writeStorage(e,b)},[e]),d=I.useCallback(function(){return N.deleteFromStorage(e)},[e]),l=c??t;return[l,s,d]}ee.useLocalStorage=it;(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.useLocalStorage=void 0;var t=ee;Object.defineProperty(e,"useLocalStorage",{enumerable:!0,get:function(){return t.useLocalStorage}});var n=de;Object.defineProperty(e,"writeStorage",{enumerable:!0,get:function(){return n.writeStorage}}),Object.defineProperty(e,"deleteFromStorage",{enumerable:!0,get:function(){return n.deleteFromStorage}}),e.default=t.useLocalStorage})(ae);const ct="/feather-gb/assets/gb_web_bg-9eacdbbc.wasm";let p;function xe(e){p=e}const A=new Array(128).fill(void 0);A.push(void 0,null,!0,!1);function L(e){return A[e]}let M=A.length;function G(e){M===A.length&&A.push(A.length+1);const t=M;return M=A[t],A[t]=e,t}function at(e){e<132||(A[e]=M,M=e)}function st(e){const t=L(e);return at(e),t}function se(e){const t=typeof e;if(t=="number"||t=="boolean"||e==null)return`${e}`;if(t=="string")return`"${e}"`;if(t=="symbol"){const i=e.description;return i==null?"Symbol":`Symbol(${i})`}if(t=="function"){const i=e.name;return typeof i=="string"&&i.length>0?`Function(${i})`:"Function"}if(Array.isArray(e)){const i=e.length;let u="[";i>0&&(u+=se(e[0]));for(let s=1;s<i;s++)u+=", "+se(e[s]);return u+="]",u}const n=/\[object ([^\]]+)\]/.exec(toString.call(e));let c;if(n.length>1)c=n[1];else return toString.call(e);if(c=="Object")try{return"Object("+JSON.stringify(e)+")"}catch{return"Object"}return e instanceof Error?`${e.name}: ${e.message}
${e.stack}`:c}let B=0,K=null;function U(){return(K===null||K.byteLength===0)&&(K=new Uint8Array(p.memory.buffer)),K}const lt=typeof TextEncoder>"u"?(0,module.require)("util").TextEncoder:TextEncoder;let Y=new lt("utf-8");const ut=typeof Y.encodeInto=="function"?function(e,t){return Y.encodeInto(e,t)}:function(e,t){const n=Y.encode(e);return t.set(n),{read:e.length,written:n.length}};function $e(e,t,n){if(n===void 0){const d=Y.encode(e),l=t(d.length);return U().subarray(l,l+d.length).set(d),B=d.length,l}let c=e.length,i=t(c);const u=U();let s=0;for(;s<c;s++){const d=e.charCodeAt(s);if(d>127)break;u[i+s]=d}if(s!==c){s!==0&&(e=e.slice(s)),i=n(i,c,c=s+e.length*3);const d=U().subarray(i+s,i+c),l=ut(e,d);s+=l.written}return B=s,i}let Z=null;function X(){return(Z===null||Z.byteLength===0)&&(Z=new Int32Array(p.memory.buffer)),Z}const dt=typeof TextDecoder>"u"?(0,module.require)("util").TextDecoder:TextDecoder;let Te=new dt("utf-8",{ignoreBOM:!0,fatal:!0});Te.decode();function Ce(e,t){return Te.decode(U().subarray(e,e+t))}function ft(e,t){const n=t(e.length*1);return U().set(e,n/1),B=e.length,n}function _t(){return p.get_audio_buffer_size()>>>0}function gt(e,t){if(!(e instanceof t))throw new Error(`expected instance of ${t.name}`);return e.ptr}let F=128;function pe(e){if(F==1)throw new Error("out of js stack");return A[--F]=e,F}function wt(){p.init()}function bt(e,t){try{return e.apply(this,t)}catch(n){p.__wbindgen_exn_store(G(n))}}const _=Object.freeze({ArrowDown:0,0:"ArrowDown",ArrowLeft:1,1:"ArrowLeft",ArrowRight:2,2:"ArrowRight",ArrowUp:3,3:"ArrowUp",A:4,4:"A",B:5,5:"B",Start:6,6:"Start",Select:7,7:"Select"});class z{static __wrap(t){const n=Object.create(z.prototype);return n.ptr=t,n}__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const t=this.__destroy_into_raw();p.__wbg_webcartridge_free(t)}constructor(t){const n=ft(t,p.__wbindgen_malloc),c=B,i=p.webcartridge_new(n,c);return z.__wrap(i)}}class q{static __wrap(t){const n=Object.create(q.prototype);return n.ptr=t,n}__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const t=this.__destroy_into_raw();p.__wbg_webemulator_free(t)}constructor(t,n){try{gt(t,z);var c=t.__destroy_into_raw();const i=p.webemulator_new(c,pe(n));return q.__wrap(i)}finally{A[F++]=void 0}}run_frame(){p.webemulator_run_frame(this.ptr)}get_canvas_data_pointer(){return p.webemulator_get_canvas_data_pointer(this.ptr)}on_key_down(t){p.webemulator_on_key_down(this.ptr,t)}on_key_up(t){p.webemulator_on_key_up(this.ptr,t)}set_audio_buffer_callback(t){try{p.webemulator_set_audio_buffer_callback(this.ptr,pe(t))}finally{A[F++]=void 0}}}function Le(e){const t=L(e);return G(t)}function Oe(){const e=new Error;return G(e)}function Ne(e,t){const n=L(t).stack,c=$e(n,p.__wbindgen_malloc,p.__wbindgen_realloc),i=B;X()[e/4+1]=i,X()[e/4+0]=c}function Be(e,t){try{console.error(Ce(e,t))}finally{p.__wbindgen_free(e,t)}}function Re(e){st(e)}function De(e){return G(e)}function Ie(){return bt(function(e,t,n){const c=L(e).call(L(t),L(n));return G(c)},arguments)}function ke(e,t){const n=se(L(t)),c=$e(n,p.__wbindgen_malloc,p.__wbindgen_realloc),i=B;X()[e/4+1]=i,X()[e/4+0]=c}function je(e,t){throw new Error(Ce(e,t))}URL=globalThis.URL;const h=await et({"./gb_web_bg.js":{__wbindgen_object_clone_ref:Le,__wbg_new_abda76e883ba8a5f:Oe,__wbg_stack_658279fe44541cf6:Ne,__wbg_error_f851667af71bcfc6:Be,__wbindgen_object_drop_ref:Re,__wbindgen_number_new:De,__wbg_call_9495de66fdbe016b:Ie,__wbindgen_debug_string:ke,__wbindgen_throw:je}},ct),fe=h.memory,pt=h.__wbg_webcartridge_free,mt=h.webcartridge_new,ht=h.get_audio_buffer_size,yt=h.__wbg_webemulator_free,St=h.webemulator_new,At=h.webemulator_run_frame,vt=h.webemulator_get_canvas_data_pointer,Et=h.webemulator_on_key_down,xt=h.webemulator_on_key_up,$t=h.webemulator_set_audio_buffer_callback,Tt=h.init,Ct=h.__wbindgen_malloc,Lt=h.__wbindgen_realloc,Ot=h.__wbindgen_free,Nt=h.__wbindgen_exn_store,Bt=Object.freeze(Object.defineProperty({__proto__:null,__wbg_webcartridge_free:pt,__wbg_webemulator_free:yt,__wbindgen_exn_store:Nt,__wbindgen_free:Ot,__wbindgen_malloc:Ct,__wbindgen_realloc:Lt,get_audio_buffer_size:ht,init:Tt,memory:fe,webcartridge_new:mt,webemulator_get_canvas_data_pointer:vt,webemulator_new:St,webemulator_on_key_down:Et,webemulator_on_key_up:xt,webemulator_run_frame:At,webemulator_set_audio_buffer_callback:$t},Symbol.toStringTag,{value:"Module"})),_e=w.createContext({input:[],onKeyDown:()=>{},onKeyUp:()=>{}});function Rt({children:e}){const[t,n]=w.useState([]),c=w.useCallback(u=>{n(s=>s.filter(d=>u!==d))},[]),i=w.useCallback(u=>{n(s=>s.includes(u)?s:[...s,u])},[]);return r(_e.Provider,{value:{input:t,onKeyUp:c,onKeyDown:i},children:e})}xe(Bt);const Dt=Object.freeze(Object.defineProperty({__proto__:null,JsKeys:_,WebCartridge:z,WebEmulator:q,__wbg_call_9495de66fdbe016b:Ie,__wbg_error_f851667af71bcfc6:Be,__wbg_new_abda76e883ba8a5f:Oe,__wbg_set_wasm:xe,__wbg_stack_658279fe44541cf6:Ne,__wbindgen_debug_string:ke,__wbindgen_number_new:De,__wbindgen_object_clone_ref:Le,__wbindgen_object_drop_ref:Re,__wbindgen_throw:je,get_audio_buffer_size:_t,init:wt},Symbol.toStringTag,{value:"Module"})),re={ArrowDown:_.ArrowDown,ArrowUp:_.ArrowUp,ArrowLeft:_.ArrowLeft,ArrowRight:_.ArrowRight,KeyD:_.ArrowRight,KeyA:_.ArrowLeft,KeyW:_.ArrowUp,KeyS:_.ArrowDown,KeyJ:_.A,KeyX:_.A,KeyK:_.B,KeyC:_.B,KeyB:_.Start,KeyN:_.Select};function It(){const{onKeyDown:e,onKeyUp:t,input:n}=w.useContext(_e),c=w.useRef();return w.useEffect(()=>{Object.values(re).forEach(u=>{n.includes(u)?c.current?.on_key_down(u):c.current?.on_key_up(u)})},[n]),w.useEffect(()=>{const u=d=>{const l=re[d.code];l!==void 0&&e(l)},s=d=>{const l=re[d.code];l!==void 0&&t(l)};return window.addEventListener("keydown",u),window.addEventListener("keyup",s),()=>{window.removeEventListener("keydown",u),window.removeEventListener("keyup",s)}},[]),w.useCallback(u=>{c.current=u},[])}function kt(){const[e,t]=w.useState(null);return w.useEffect(()=>{Ve(()=>Promise.resolve().then(()=>Dt),void 0).then(n=>{n.init(),t(n)}).catch(console.error)},[]),e}let me=!1;function jt(e){if(me)return;me=!0;const t=e.createBuffer(1,1,e.sampleRate),n=e.createBufferSource();n.buffer=t,n.connect(e.destination),n.start(0),e.resume()}function he(e,t,n=1){if(n>0&&e>=t||n<0&&e<=t)return[];const c=[];for(let i=e;n>0?i<t:i>t;i+=n)c.push(i);return c}function Pt(e){return fetch(e).then(t=>t.arrayBuffer()).then(t=>new Uint8Array(t))}function Mt(){return w.useContext(_e)}function Ut(){return Ye()}const Pe=45,Me=23,Ue=6,oe=9,Ft=20,Wt=13,J=36,Fe=25,Q=26,zt="#393C81",Gt="#8A205E";function o(e){return t=>`${t.theme.zoom*e}px`}function ge(){return ce`
    filter: brightness(80%);
  `}const Ht=f.div`
  display: flex;
  justify-content: center;
`,Kt=f.div`
  display: inline-block;
  margin: 10px;
  background: #eee;
  border-radius: 10px 10px 60px 10px;
  box-shadow: 5px 5px rgba(0, 0, 0, 0.1);
  padding: ${o(20)};
  color: ${zt};
  position: relative;
`,Zt=f.div`
  background-color: #777;
  border-radius: ${o(7)} ${o(7)} ${o(40)} ${o(7)};
  box-shadow: inset 0px 0px 20px 0px rgba(0, 0, 0, 0.66);
`,Vt=f.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${o(Me)};
  font-size: ${o(Ue)};
  font-family: Arial;
  color: #b3b3b3;
  padding: 0 ${o(8)} 0;
`,Yt=f.div`
  flex: 0 0 auto;
  margin: 0 ${o(5)};
`,Jt=f.div`
  display: flex;
  margin-right: ${o(Pe)};
  padding-bottom: ${o(Me)};
`,Xt=f.div`
  flex: 1 1 ${e=>e.width};
  height: ${o(3)};
  background-color: #8b1d90;
  box-shadow: 0 ${o(2*3)} 0 #283593;
  margin-top: -${o(2*3)};
`,qt=f.div`
  margin-left: auto;
  margin-right: auto;
  position: relative;
`,Qt=f.div`
  position: absolute;
  box-shadow: inset 5px 5px 5px 0px rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`,en=f.div`
  background-color: ${e=>e.enabled?"#f00":"#000"};
  box-shadow: 0 0 3px 1px #ef5350;
  height: ${o(oe)};
  width: ${o(oe)};
  border-radius: ${e=>e.theme.zoom*oe/2}px;
  margin: 10px 20px 10px 10px;
  box-shadow: inset 0px 0px 5px 0px rgba(0, 0, 0, 0.66);
`,tn=f.div`
  font-family: Arial;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #b3b3b3;
  width: ${o(Pe)};
  font-size: ${o(Ue)};
  margin-bottom: 80px;
`,nn=f.div`
  letter-spacing: 1px;
  font-size: ${o(Wt)};
`,rn=f.div`
  margin-left: ${o(2)};
  font-size: ${o(Ft)};
`,on=f.div`
  font-size: ${o(6)};
`,cn=f.div`
  background-color: ${Gt};
  height: ${o(J)};
  width: ${o(J)};
  border-radius: ${o(J/2)};

  ${e=>e.$pressed&&ge()}
`,an=f.div`
  position: relative;
`,sn=f.div`
  font-size: ${o(12)};
  letter-spacing: ${o(1)};
`,We=f(sn)`
  margin-top: ${e=>o(e.$spacing)};
`,ln=f.div`
  display: inline-flex;
  margin-top: ${o(10)};
  margin-right: -${o(12)};
  transform: rotate(-${Fe}deg);
  padding: ${o(5)};

  background-color: #dfdfdf;
  box-shadow: 0 0 0 5px #dfdfdf;
  border-radius: ${o(J)};

  > * + * {
    margin-left: ${o(18)};
  }

  ${We} {
    bottom: -${o(25)};
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
  }
`,le=f.div`
  transform: rotate(-${Fe}deg);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`,un=f.div`
  border-radius: ${o((9+2*5)/2)};
  background-color: #dfdfdf;
  padding: ${o(5)};
`,dn=f.div`
  background-color: #868a8d;
  width: ${o(38)};
  height: ${o(9)};
  border-radius: ${o(9/2)};
  ${e=>e.$pressed&&ge()}
`,fn=f.div`
  display: flex;
  margin-left: ${o(80)};
  margin-top: ${o(30)};
  margin-bottom: ${o(40)};
  ${le} + ${le} {
    margin-left: ${o(7)};
  }
`,_n=f.div``;var P=(e=>(e[e.HORIZONTAL=0]="HORIZONTAL",e[e.VERTICAL=1]="VERTICAL",e))(P||{});const gn=f.div`
  display: flex;
  justify-content: center;
`,ze=f.div`
  width: ${o(2)};
  height: 80%;
  background-color: #353535;
  margin: ${o(2)};
  border-radius: ${o(5)};
`,Ge=f.div`
  position: relative;
  height: ${o(Q)};
  width: ${o(Q)};
  background-color: #1b1d1d;
`,te=f(Ge)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${e=>e.$orientation===1?"row":"column"};

  ${ze} {
    ${e=>e.$pressed&&ge()}

    ${e=>e.$orientation===1?ce`
            width: ${o(3)};
            height: 60%;
          `:ce`
            height: ${o(3)};
            width: 60%;
          `};
  }
`,wn=f(te)`
  border-radius: ${o(5)} 0 0 ${o(5)};
`,bn=f(te)`
  border-radius: ${o(5)} ${o(5)} 0 0;
`,pn=f(te)`
  border-radius: 0 ${o(5)} ${o(5)} 0;
`,mn=f(te)`
  border-radius: 0 0 ${o(5)} ${o(5)};
`,hn=f(Ge)`
  &:before {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: ${o(Q-7)};
    width: ${o(Q-7)};
    background-color: #353535;
    border-radius: 100%;
  }
`,yn=f.div`
  display: flex;
  margin-top: ${o(35)};
`,ue=f.div`
  height: ${o(48)};
  width: ${o(5)};
  background-color: #a7a49f;
  border-radius: ${o(5)};
  box-shadow: inset 0px 0px 5px 0px rgb(95 95 95 / 66%);
`,Sn=f.div`
  display: inline-flex;
  transform: rotate(-28deg);
  position: absolute;
  bottom: ${o(19)};
  right: ${o(15)};

  ${ue} + ${ue} {
    margin-left: ${o(8)};
  }
`,a={Wrapper:Ht,Device:Kt,Display:Zt,DisplayTop:Vt,DisplayHeaderText:Yt,DisplayContent:Jt,DisplayLine:Xt,Screen:qt,ScreenOverlay:Qt,Battery:tn,BatteryIndicator:en,NintendoText:nn,GameBoyText:rn,TradeMarkText:on,Controls:yn,ButtonsAB:ln,CircleButtonWrapper:an,CircleButton:cn,ButtonText:We,ButtonsStartSelect:fn,WideButton:dn,WideButtonWrapper:un,WideButtonContainer:le,Arrows:_n,ArrowsLine:gn,ArrowUp:bn,ArrowDown:mn,ArrowLeft:wn,ArrowRight:pn,ArrowCenter:hn,ArrowStripe:ze,Speakers:Sn,Speaker:ue};function An(e){return g(a.Display,{children:[g(a.DisplayTop,{children:[r(a.DisplayLine,{width:"25%"}),r(a.DisplayHeaderText,{children:"DOT MATRIX WITH STEREO SOUND"}),r(a.DisplayLine,{width:"12%"})]}),g(a.DisplayContent,{children:[g(a.Battery,{children:[r(a.BatteryIndicator,{enabled:e.enabled}),"BATTERY"]}),g(a.Screen,{children:[e.children,r(a.ScreenOverlay,{})]})]})]})}const C=160,W=144;function vn({running:e},t){const{zoom:n}=Ut(),{input:c,onKeyDown:i,onKeyUp:u}=Mt(),s=c.includes(_.A),d=c.includes(_.B),l=c.includes(_.Start),b=c.includes(_.Select),y=c.includes(_.ArrowLeft),m=c.includes(_.ArrowRight),E=c.includes(_.ArrowUp),O=c.includes(_.ArrowDown);return r(a.Wrapper,{children:g(a.Device,{children:[r(An,{enabled:e,children:r("canvas",{ref:t,style:{display:"block",imageRendering:"pixelated",zoom:n},height:W,width:C})}),g("div",{className:"flex items-baseline",children:[r(a.NintendoText,{className:"font-pretendo",children:"Nintendo"}),r(a.GameBoyText,{className:"font-gills-sans font-medium italic",children:"GAME BOY"}),r(a.TradeMarkText,{className:"font-bold",children:"TM"})]}),g(a.Controls,{children:[g(a.Arrows,{children:[r(a.ArrowsLine,{children:g(a.ArrowUp,{onPointerDown:()=>i(_.ArrowUp),onPointerUp:()=>u(_.ArrowUp),$orientation:P.HORIZONTAL,$pressed:E,children:[r(a.ArrowStripe,{}),r(a.ArrowStripe,{}),r(a.ArrowStripe,{})]})}),g(a.ArrowsLine,{children:[g(a.ArrowLeft,{onPointerDown:()=>i(_.ArrowLeft),onPointerUp:()=>u(_.ArrowLeft),$orientation:P.VERTICAL,$pressed:y,children:[r(a.ArrowStripe,{}),r(a.ArrowStripe,{}),r(a.ArrowStripe,{})]}),r(a.ArrowCenter,{}),g(a.ArrowRight,{onPointerDown:()=>i(_.ArrowRight),onPointerUp:()=>u(_.ArrowRight),$orientation:P.VERTICAL,$pressed:m,children:[r(a.ArrowStripe,{}),r(a.ArrowStripe,{}),r(a.ArrowStripe,{})]})]}),r(a.ArrowsLine,{children:g(a.ArrowDown,{onPointerDown:()=>i(_.ArrowDown),onPointerUp:()=>u(_.ArrowDown),$orientation:P.HORIZONTAL,$pressed:O,children:[r(a.ArrowStripe,{}),r(a.ArrowStripe,{}),r(a.ArrowStripe,{})]})})]}),r("div",{className:"ml-auto",children:g(a.ButtonsAB,{className:" font-nes",children:[g(a.CircleButtonWrapper,{children:[r(a.CircleButton,{onPointerDown:()=>i(_.B),onPointerUp:()=>u(_.B),$pressed:d}),r(a.ButtonText,{$spacing:10,children:"B"})]}),g(a.CircleButtonWrapper,{children:[r(a.CircleButton,{onPointerDown:()=>i(_.A),onPointerUp:()=>u(_.A),$pressed:s}),r(a.ButtonText,{$spacing:10,children:"A"})]})]})})]}),g(a.ButtonsStartSelect,{className:"font-nes",children:[g(a.WideButtonContainer,{children:[r(a.WideButtonWrapper,{children:r(a.WideButton,{onPointerDown:()=>i(_.Select),onPointerUp:()=>u(_.Select),$pressed:b})}),r(a.ButtonText,{$spacing:1,children:"SELECT"})]}),g(a.WideButtonContainer,{children:[r(a.WideButtonWrapper,{children:r(a.WideButton,{onPointerDown:()=>i(_.Start),onPointerUp:()=>u(_.Start),$pressed:l})}),r(a.ButtonText,{$spacing:1,children:"START"})]})]}),g(a.Speakers,{children:[r(a.Speaker,{}),r(a.Speaker,{}),r(a.Speaker,{}),r(a.Speaker,{}),r(a.Speaker,{}),r(a.Speaker,{})]})]})})}const En=w.forwardRef(vn),xn="12px",V={Icon:f.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  `,Wrapper:f.div`
    font-size: ${xn};
    display: flex;
    align-items: center;
    justify-content: center;
  `,Value:f.div`
    margin: 0 5px;
  `};function $n(e){const{zoom:t,onChange:n}=e;return g(V.Wrapper,{children:[r(V.Icon,{children:r("button",{type:"button",onClick:()=>n(Math.max(1,t-.5)),children:"-"})}),g(V.Value,{children:["Zoom: ",t.toFixed(1)]}),r(V.Icon,{children:r("button",{type:"button",onClick:()=>n(Math.min(t+.5,5)),children:"+"})})]})}const Tn=f.div`
  cursor: pointer;
`;function Cn(){const e=Je();return r(Tn,{onClick:()=>e(-1),children:"←"})}const He=tt.filter(e=>["demos/cgb-acid2.gbc","demos/dmg-acid2.gb","demos/gejmboj.gb","demos/oh.gb","demos/opus5.gb","demos/pocket.gb"].includes(e.name)),Ln=He.find(e=>e.name==="demos/oh.gb")||null;function On(e){const t=w.useCallback(n=>{n&&Pt(n.url).then(c=>e.onCartridgeLoad({name:n.name,bytes:c}))},[]);return w.useEffect(()=>{t(Ln)},[t]),r("table",{children:r("tbody",{children:He.map(n=>g("tr",{className:e.selectedName===n.name?"font-medium underline":"",children:[r("td",{className:"px-1",children:n.name}),r("td",{className:"px-1",children:r("button",{type:"button",onClick:()=>t(n),children:"Load"})})]},n.url))})})}const Nn=12,ie=20,ye=30,Bn=64,Rn=f.span`
  font-size: ${Nn}px;
`,Dn=f.canvas`
  display: inline-block;
`,k=[];function In(){const e=w.useRef(window.performance.now()),t=w.useRef(null),n=w.useRef(0);return w.useEffect(()=>{function c(){n.current=window.requestAnimationFrame(()=>{const i=window.performance.now(),u=i-e.current;e.current=i;const s=Math.round(1e3/u);k.push(s),k.length>Bn&&k.shift();const d=Math.round(k.reduce((b,y)=>b+y)/k.length),l=t.current?.getContext("2d");l&&(l.clearRect(0,0,ye,ie),l.textBaseline="middle",l.font="12px Arial",l.fillText(d.toString(),1,ie/2+1)),c()})}return c(),()=>window.cancelAnimationFrame(n.current)},[]),g(Rn,{className:"flex items-center justify-end",children:["Average FPS: ",r(Dn,{width:ye,height:ie,ref:t})]})}function kn(e){const{onLoad:t,className:n,children:c}=e;return g(Xe,{children:[r("input",{onChange:u=>{const{files:s}=u.currentTarget;if(!s)return;const d=s[0];d.arrayBuffer().then(l=>new Uint8Array(l)).then(l=>t({name:`Custom: ${d.name}`,bytes:l,custom:!0}))},accept:".gb,.gbc",style:{display:"none"},id:"file",multiple:!0,type:"file"}),r("label",{className:n,htmlFor:"file",children:c})]})}const jn=1.5,Pn="#6D7C00",x=new AudioContext({sampleRate:44100});function Mn(e,t){const n=e.get_canvas_data_pointer(),c=t.createImageData(C,W),i=new Uint8Array(fe.buffer,n,C*W*3);he(0,W).forEach(u=>{he(0,C).forEach(s=>{const d=(u*C+s)*3,l=(u*C+s)*4;c.data[l]=i[d],c.data[l+1]=i[d+1],c.data[l+2]=i[d+2],c.data[l+3]=255})}),t.putImageData(c,0,0)}function Se(e){e.fillStyle=Pn,e.fillRect(0,0,C,W)}const j=2;function Un(e){const{bytes:t,wasmModule:n,running:c,ctx:i,soundEnabled:u}=e,s=w.useRef(),d=w.useRef(0),l=w.useRef(0),b=It();w.useEffect(()=>{Se(i)},[i]);const y=w.useCallback(m=>{const E=n.get_audio_buffer_size(),O=new Float32Array(fe.buffer,m,E),D=O.length/j,S=x.createBuffer(j,D,x.sampleRate);for(let T=0;T<j;T+=1){const Ke=S.getChannelData(T);for(let H=0;H<D;H+=1)Ke[H]=O[H*j+T]}const $=x.createBufferSource();$.buffer=S,$.connect(x.destination),d.current<=x.currentTime+.02&&(d.current=x.currentTime+.06),$.start(d.current),d.current+=E/j/x.sampleRate},[]);return w.useEffect(()=>{if(!t)return;const m=new n.WebCartridge(t);d.current=0,s.current=new n.WebEmulator(m,()=>{}),Se(i),b(s.current)},[t,n,b]),w.useEffect(()=>{const m=s.current;m&&m.set_audio_buffer_callback(u?y:()=>{})},[s.current,u,y]),w.useEffect(()=>{const m=s.current;if(m)if(c){const E=()=>{m.run_frame(),Mn(m,i),l.current=window.requestAnimationFrame(E)};E()}else window.cancelAnimationFrame(l.current)},[c]),null}function Gn(){const[e,t]=ae.useLocalStorage("zoom",jn),[n,c]=ae.useLocalStorage("sound_enabled",!1),[i,u]=w.useState(!1),[s,d]=w.useState(),[l,b]=w.useState(null),y={zoom:e},m=kt(),E=()=>{jt(x),u(S=>S?!1:!!(!S&&l))},O=w.useCallback(S=>{S&&d($=>{if($)return $;const T=S.getContext("2d");return T||$})},[]),D=S=>{u(!1),b(S)};return m?r("div",{className:"select-none",children:r(Rt,{children:g(Qe,{theme:y,children:[g("div",{className:"grid grid-cols-3 justify-between items-center mx-2 pt-2",children:[r(Cn,{}),r($n,{zoom:e,onChange:t}),r("div",{className:"justify-end",children:r(In,{})})]}),r(En,{running:i,ref:O}),s&&r(Un,{bytes:l?.bytes,wasmModule:m,running:i,soundEnabled:n,ctx:s}),g("div",{className:"mt-2 flex justify-center items-center text-xs",children:[r("button",{className:"mx-2 border rounded px-1 py-1",type:"button",onClick:E,children:i?"Stop":"Run"}),r(kn,{className:"mx-2 border rounded px-1 py-1",onLoad:D,children:"Upload ROM"}),g("label",{className:"flex justify-center items-center",htmlFor:"soundEnableCheckbox",children:[r("input",{id:"soundEnableCheckbox",className:"mr-1",type:"checkbox",checked:n,onChange:S=>c(S.currentTarget.checked)}),"Enable sound"]})]}),l?.custom&&r("div",{className:"mt-2 flex justify-center text-xs",children:l.name}),r("div",{className:"mt-2 flex justify-center text-xs",children:r(On,{selectedName:l?.name,onCartridgeLoad:D})}),r("div",{className:"mt-2 flex text-center justify-center text-xs",children:g("div",{children:[r("p",{children:"Select one of the available demos or upload your custom *.gb file and press Run"}),g("p",{children:["The test ROMs are available in"," ",r(we,{className:"underline",to:"/debug",children:"debug mode"}),". You can see the test results"," ",r(we,{className:"underline",to:"/test-results",children:"here"}),"."]})]})})]})})}):r(qe,{})}export{Gn as Play,Gn as default};
