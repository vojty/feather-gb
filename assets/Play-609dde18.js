import{c as He,r as g,j as n,_ as Ke,Z as Ze,s as f,C as re,u as Ve,F as Ye,a as Je,L as fe}from"./index-cae58451.js";import{_ as Xe}from"./__vite-plugin-wasm-helper-2f5b93cf.js";import{r as qe}from"./romsList-6ed61065.js";var oe={},X={},ae={},S={},N={};Object.defineProperty(N,"__esModule",{value:!0});N.isBrowser=void 0;N.isBrowser=function(){return typeof window<"u"&&typeof window.document<"u"};Object.defineProperty(S,"__esModule",{value:!0});S.storage=S.MemoryStorageProxy=S.LocalStorageProxy=S.localStorageAvailable=void 0;var Qe=N;function he(){try{var e="@rehooks/local-storage:"+new Date().toISOString();return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(t){return Qe.isBrowser()&&t instanceof DOMException&&(t.code===22||t.code===1014||t.name==="QuotaExceededError"||t.name==="NS_ERROR_DOM_QUOTA_REACHED")&&localStorage&&localStorage.length!==0}}S.localStorageAvailable=he;var xe=function(){function e(){}return e.prototype.getItem=function(t){return localStorage.getItem(t)},e.prototype.setItem=function(t,r){localStorage.setItem(t,r)},e.prototype.removeItem=function(t){localStorage.removeItem(t)},e}();S.LocalStorageProxy=xe;var ye=function(){function e(){this._memoryStorage=new Map}return e.prototype.getItem=function(t){var r;return(r=this._memoryStorage.get(t))!==null&&r!==void 0?r:null},e.prototype.setItem=function(t,r){this._memoryStorage.set(t,r)},e.prototype.removeItem=function(t){this._memoryStorage.delete(t)},e}();S.MemoryStorageProxy=ye;var et=function(e){return e?new xe:new ye};S.storage=et(he());(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.deleteFromStorage=e.writeStorage=e.isTypeOfLocalStorageChanged=e.LOCAL_STORAGE_CHANGE_EVENT_NAME=void 0;var t=S,r=N;e.LOCAL_STORAGE_CHANGE_EVENT_NAME="onLocalStorageChange",function(){if(!r.isBrowser()||typeof He.window.CustomEvent=="function")return;function a(d,l){var w,h;l===void 0&&(l={bubbles:!1,cancelable:!1});var m=document.createEvent("CustomEvent");return m.initCustomEvent(d,(w=l?.bubbles)!==null&&w!==void 0?w:!1,(h=l?.cancelable)!==null&&h!==void 0?h:!1,l?.detail),m}window.CustomEvent=a}();function s(a){return!!a&&a.type===e.LOCAL_STORAGE_CHANGE_EVENT_NAME}e.isTypeOfLocalStorageChanged=s;function o(a,d){if(r.isBrowser())try{t.storage.setItem(a,typeof d=="object"?JSON.stringify(d):""+d),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:a,value:d}}))}catch(l){throw l instanceof TypeError&&l.message.includes("circular structure")?new TypeError(`The object that was given to the writeStorage function has circular references.
For more information, check here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value`):l}}e.writeStorage=o;function u(a){r.isBrowser()&&(t.storage.removeItem(a),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:a,value:null}})))}e.deleteFromStorage=u})(ae);Object.defineProperty(X,"__esModule",{value:!0});X.useLocalStorage=void 0;var L=ae,tt=N,Q=S,R=g;function _e(e){try{return JSON.parse(e)}catch{return e}}function nt(e,t){t===void 0&&(t=null);var r=R.useState(Q.storage.getItem(e)===null?t:_e(Q.storage.getItem(e))),s=r[0],o=r[1],u=R.useCallback(function(w){L.isTypeOfLocalStorageChanged(w)?w.detail.key===e&&o(w.detail.value):w.key===e&&o(w.newValue===null?null:_e(w.newValue))},[o,e]);R.useEffect(function(){if(tt.isBrowser()){var w=function(h){u(h)};return window.addEventListener(L.LOCAL_STORAGE_CHANGE_EVENT_NAME,w),window.addEventListener("storage",w),Q.storage.getItem(e)===null&&t!==null&&L.writeStorage(e,t),function(){window.removeEventListener(L.LOCAL_STORAGE_CHANGE_EVENT_NAME,w),window.removeEventListener("storage",w)}}},[e,t,u]);var a=R.useCallback(function(w){return L.writeStorage(e,w)},[e]),d=R.useCallback(function(){return L.deleteFromStorage(e)},[e]),l=s??t;return[l,a,d]}X.useLocalStorage=nt;(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.useLocalStorage=void 0;var t=X;Object.defineProperty(e,"useLocalStorage",{enumerable:!0,get:function(){return t.useLocalStorage}});var r=ae;Object.defineProperty(e,"writeStorage",{enumerable:!0,get:function(){return r.writeStorage}}),Object.defineProperty(e,"deleteFromStorage",{enumerable:!0,get:function(){return r.deleteFromStorage}}),e.default=t.useLocalStorage})(oe);const rt="/feather-gb/assets/gb_web_bg-fd23c566.wasm";let b;function Se(e){b=e}const y=new Array(128).fill(void 0);y.push(void 0,null,!0,!1);function T(e){return y[e]}let P=y.length;function W(e){P===y.length&&y.push(y.length+1);const t=P;return P=y[t],y[t]=e,t}function ot(e){e<132||(y[e]=P,P=e)}function it(e){const t=T(e);return ot(e),t}function ie(e){const t=typeof e;if(t=="number"||t=="boolean"||e==null)return`${e}`;if(t=="string")return`"${e}"`;if(t=="symbol"){const o=e.description;return o==null?"Symbol":`Symbol(${o})`}if(t=="function"){const o=e.name;return typeof o=="string"&&o.length>0?`Function(${o})`:"Function"}if(Array.isArray(e)){const o=e.length;let u="[";o>0&&(u+=ie(e[0]));for(let a=1;a<o;a++)u+=", "+ie(e[a]);return u+="]",u}const r=/\[object ([^\]]+)\]/.exec(toString.call(e));let s;if(r.length>1)s=r[1];else return toString.call(e);if(s=="Object")try{return"Object("+JSON.stringify(e)+")"}catch{return"Object"}return e instanceof Error?`${e.name}: ${e.message}
${e.stack}`:s}let O=0,G=null;function M(){return(G===null||G.byteLength===0)&&(G=new Uint8Array(b.memory.buffer)),G}const st=typeof TextEncoder>"u"?(0,module.require)("util").TextEncoder:TextEncoder;let Z=new st("utf-8");const ct=typeof Z.encodeInto=="function"?function(e,t){return Z.encodeInto(e,t)}:function(e,t){const r=Z.encode(e);return t.set(r),{read:e.length,written:r.length}};function Ae(e,t,r){if(r===void 0){const d=Z.encode(e),l=t(d.length,1)>>>0;return M().subarray(l,l+d.length).set(d),O=d.length,l}let s=e.length,o=t(s,1)>>>0;const u=M();let a=0;for(;a<s;a++){const d=e.charCodeAt(a);if(d>127)break;u[o+a]=d}if(a!==s){a!==0&&(e=e.slice(a)),o=r(o,s,s=a+e.length*3,1)>>>0;const d=M().subarray(o+a,o+s),l=ct(e,d);a+=l.written,o=r(o,s,a,1)>>>0}return O=a,o}let H=null;function Y(){return(H===null||H.byteLength===0)&&(H=new Int32Array(b.memory.buffer)),H}const at=typeof TextDecoder>"u"?(0,module.require)("util").TextDecoder:TextDecoder;let je=new at("utf-8",{ignoreBOM:!0,fatal:!0});je.decode();function ve(e,t){return e=e>>>0,je.decode(M().subarray(e,e+t))}function lt(e,t){const r=t(e.length*1,1)>>>0;return M().set(e,r/1),O=e.length,r}function ut(){return b.get_audio_buffer_size()>>>0}function dt(e,t){if(!(e instanceof t))throw new Error(`expected instance of ${t.name}`);return e.ptr}let F=128;function ge(e){if(F==1)throw new Error("out of js stack");return y[--F]=e,F}function ft(){b.init()}function _t(e,t){try{return e.apply(this,t)}catch(r){b.__wbindgen_exn_store(W(r))}}const _=Object.freeze({ArrowDown:0,0:"ArrowDown",ArrowLeft:1,1:"ArrowLeft",ArrowRight:2,2:"ArrowRight",ArrowUp:3,3:"ArrowUp",A:4,4:"A",B:5,5:"B",Start:6,6:"Start",Select:7,7:"Select"}),gt=typeof FinalizationRegistry>"u"?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(e=>b.__wbg_webcartridge_free(e>>>0));class Ee{__destroy_into_raw(){const t=this.__wbg_ptr;return this.__wbg_ptr=0,gt.unregister(this),t}free(){const t=this.__destroy_into_raw();b.__wbg_webcartridge_free(t)}constructor(t){const r=lt(t,b.__wbindgen_malloc),s=O,o=b.webcartridge_new(r,s);return this.__wbg_ptr=o>>>0,this}}const wt=typeof FinalizationRegistry>"u"?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(e=>b.__wbg_webemulator_free(e>>>0));class bt{__destroy_into_raw(){const t=this.__wbg_ptr;return this.__wbg_ptr=0,wt.unregister(this),t}free(){const t=this.__destroy_into_raw();b.__wbg_webemulator_free(t)}constructor(t,r){try{dt(t,Ee);var s=t.__destroy_into_raw();const o=b.webemulator_new(s,ge(r));return this.__wbg_ptr=o>>>0,this}finally{y[F++]=void 0}}run_frame(){b.webemulator_run_frame(this.__wbg_ptr)}get_canvas_data_pointer(){return b.webemulator_get_canvas_data_pointer(this.__wbg_ptr)>>>0}on_key_down(t){b.webemulator_on_key_down(this.__wbg_ptr,t)}on_key_up(t){b.webemulator_on_key_up(this.__wbg_ptr,t)}set_audio_buffer_callback(t){try{b.webemulator_set_audio_buffer_callback(this.__wbg_ptr,ge(t))}finally{y[F++]=void 0}}}function $e(e){const t=T(e);return W(t)}function Te(){const e=new Error;return W(e)}function Ce(e,t){const r=T(t).stack,s=Ae(r,b.__wbindgen_malloc,b.__wbindgen_realloc),o=O;Y()[e/4+1]=o,Y()[e/4+0]=s}function Le(e,t){let r,s;try{r=e,s=t,console.error(ve(e,t))}finally{b.__wbindgen_free(r,s,1)}}function Oe(e){it(e)}function Ne(e){return W(e)}function Be(){return _t(function(e,t,r){const s=T(e).call(T(t),T(r));return W(s)},arguments)}function Re(e,t){const r=ie(T(t)),s=Ae(r,b.__wbindgen_malloc,b.__wbindgen_realloc),o=O;Y()[e/4+1]=o,Y()[e/4+0]=s}function De(e,t){throw new Error(ve(e,t))}URL=globalThis.URL;const p=await Xe({"./gb_web_bg.js":{__wbindgen_object_clone_ref:$e,__wbg_new_abda76e883ba8a5f:Te,__wbg_stack_658279fe44541cf6:Ce,__wbg_error_f851667af71bcfc6:Le,__wbindgen_object_drop_ref:Oe,__wbindgen_number_new:Ne,__wbg_call_67f2111acd2dfdb6:Be,__wbindgen_debug_string:Re,__wbindgen_throw:De}},rt),le=p.memory,mt=p.__wbg_webcartridge_free,pt=p.webcartridge_new,ht=p.get_audio_buffer_size,xt=p.__wbg_webemulator_free,yt=p.webemulator_new,St=p.webemulator_run_frame,At=p.webemulator_get_canvas_data_pointer,jt=p.webemulator_on_key_down,vt=p.webemulator_on_key_up,Et=p.webemulator_set_audio_buffer_callback,$t=p.init,Tt=p.__wbindgen_malloc,Ct=p.__wbindgen_realloc,Lt=p.__wbindgen_free,Ot=p.__wbindgen_exn_store,Nt=Object.freeze(Object.defineProperty({__proto__:null,__wbg_webcartridge_free:mt,__wbg_webemulator_free:xt,__wbindgen_exn_store:Ot,__wbindgen_free:Lt,__wbindgen_malloc:Tt,__wbindgen_realloc:Ct,get_audio_buffer_size:ht,init:$t,memory:le,webcartridge_new:pt,webemulator_get_canvas_data_pointer:At,webemulator_new:yt,webemulator_on_key_down:jt,webemulator_on_key_up:vt,webemulator_run_frame:St,webemulator_set_audio_buffer_callback:Et},Symbol.toStringTag,{value:"Module"})),ue=g.createContext({input:[],onKeyDown:()=>{},onKeyUp:()=>{}});function Bt({children:e}){const[t,r]=g.useState([]),s=g.useCallback(u=>{r(a=>a.filter(d=>u!==d))},[]),o=g.useCallback(u=>{r(a=>a.includes(u)?a:[...a,u])},[]);return n.jsx(ue.Provider,{value:{input:t,onKeyUp:s,onKeyDown:o},children:e})}Se(Nt);const Rt=Object.freeze(Object.defineProperty({__proto__:null,JsKeys:_,WebCartridge:Ee,WebEmulator:bt,__wbg_call_67f2111acd2dfdb6:Be,__wbg_error_f851667af71bcfc6:Le,__wbg_new_abda76e883ba8a5f:Te,__wbg_set_wasm:Se,__wbg_stack_658279fe44541cf6:Ce,__wbindgen_debug_string:Re,__wbindgen_number_new:Ne,__wbindgen_object_clone_ref:$e,__wbindgen_object_drop_ref:Oe,__wbindgen_throw:De,get_audio_buffer_size:ut,init:ft},Symbol.toStringTag,{value:"Module"})),ee={ArrowDown:_.ArrowDown,ArrowUp:_.ArrowUp,ArrowLeft:_.ArrowLeft,ArrowRight:_.ArrowRight,KeyD:_.ArrowRight,KeyA:_.ArrowLeft,KeyW:_.ArrowUp,KeyS:_.ArrowDown,KeyJ:_.A,KeyX:_.A,KeyK:_.B,KeyC:_.B,KeyB:_.Start,KeyN:_.Select};function Dt(){const{onKeyDown:e,onKeyUp:t,input:r}=g.useContext(ue),s=g.useRef();return g.useEffect(()=>{Object.values(ee).forEach(u=>{r.includes(u)?s.current?.on_key_down(u):s.current?.on_key_up(u)})},[r]),g.useEffect(()=>{const u=d=>{const l=ee[d.code];l!==void 0&&e(l)},a=d=>{const l=ee[d.code];l!==void 0&&t(l)};return window.addEventListener("keydown",u),window.addEventListener("keyup",a),()=>{window.removeEventListener("keydown",u),window.removeEventListener("keyup",a)}},[]),g.useCallback(u=>{s.current=u},[])}function It(){const[e,t]=g.useState(null);return g.useEffect(()=>{Ke(()=>Promise.resolve().then(()=>Rt),void 0).then(r=>{r.init(),t(r)}).catch(console.error)},[]),e}let we=!1;function kt(e){if(we)return;we=!0;const t=e.createBuffer(1,1,e.sampleRate),r=e.createBufferSource();r.buffer=t,r.connect(e.destination),r.start(0),e.resume()}function be(e,t,r=1){if(r>0&&e>=t||r<0&&e<=t)return[];const s=[];for(let o=e;r>0?o<t:o>t;o+=r)s.push(o);return s}function Pt(e){return fetch(e).then(t=>t.arrayBuffer()).then(t=>new Uint8Array(t))}function Mt(){return g.useContext(ue)}function Ft(){return Ze()}const Ie=45,ke=23,Pe=6,te=9,Ut=20,Wt=13,V=36,Me=25,J=26,zt="#393C81",Gt="#8A205E";function i(e){return t=>`${t.theme.zoom*e}px`}function de(){return re`
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
  padding: ${i(20)};
  color: ${zt};
  position: relative;
`,Zt=f.div`
  background-color: #777;
  border-radius: ${i(7)} ${i(7)} ${i(40)} ${i(7)};
  box-shadow: inset 0px 0px 20px 0px rgba(0, 0, 0, 0.66);
`,Vt=f.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${i(ke)};
  font-size: ${i(Pe)};
  font-family: Arial;
  color: #b3b3b3;
  padding: 0 ${i(8)} 0;
`,Yt=f.div`
  flex: 0 0 auto;
  margin: 0 ${i(5)};
`,Jt=f.div`
  display: flex;
  margin-right: ${i(Ie)};
  padding-bottom: ${i(ke)};
`,Xt=f.div`
  flex: 1 1 ${e=>e.width};
  height: ${i(3)};
  background-color: #8b1d90;
  box-shadow: 0 ${i(2*3)} 0 #283593;
  margin-top: -${i(2*3)};
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
  height: ${i(te)};
  width: ${i(te)};
  border-radius: ${e=>e.theme.zoom*te/2}px;
  margin: 10px 20px 10px 10px;
  box-shadow: inset 0px 0px 5px 0px rgba(0, 0, 0, 0.66);
`,tn=f.div`
  font-family: Arial;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #b3b3b3;
  width: ${i(Ie)};
  font-size: ${i(Pe)};
  margin-bottom: 80px;
`,nn=f.div`
  letter-spacing: 1px;
  font-size: ${i(Wt)};
`,rn=f.div`
  margin-left: ${i(2)};
  font-size: ${i(Ut)};
`,on=f.div`
  font-size: ${i(6)};
`,sn=f.div`
  background-color: ${Gt};
  height: ${i(V)};
  width: ${i(V)};
  border-radius: ${i(V/2)};

  ${e=>e.$pressed&&de()}
`,cn=f.div`
  position: relative;
`,an=f.div`
  font-size: ${i(12)};
  letter-spacing: ${i(1)};
`,Fe=f(an)`
  margin-top: ${e=>i(e.$spacing)};
`,ln=f.div`
  display: inline-flex;
  margin-top: ${i(10)};
  margin-right: -${i(12)};
  transform: rotate(-${Me}deg);
  padding: ${i(5)};

  background-color: #dfdfdf;
  box-shadow: 0 0 0 5px #dfdfdf;
  border-radius: ${i(V)};

  > * + * {
    margin-left: ${i(18)};
  }

  ${Fe} {
    bottom: -${i(25)};
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
  }
`,se=f.div`
  transform: rotate(-${Me}deg);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`,un=f.div`
  border-radius: ${i((9+2*5)/2)};
  background-color: #dfdfdf;
  padding: ${i(5)};
`,dn=f.div`
  background-color: #868a8d;
  width: ${i(38)};
  height: ${i(9)};
  border-radius: ${i(9/2)};
  ${e=>e.$pressed&&de()}
`,fn=f.div`
  display: flex;
  margin-left: ${i(80)};
  margin-top: ${i(30)};
  margin-bottom: ${i(40)};
  ${se} + ${se} {
    margin-left: ${i(7)};
  }
`,_n=f.div``;var k=(e=>(e[e.HORIZONTAL=0]="HORIZONTAL",e[e.VERTICAL=1]="VERTICAL",e))(k||{});const gn=f.div`
  display: flex;
  justify-content: center;
`,Ue=f.div`
  width: ${i(2)};
  height: 80%;
  background-color: #353535;
  margin: ${i(2)};
  border-radius: ${i(5)};
`,We=f.div`
  position: relative;
  height: ${i(J)};
  width: ${i(J)};
  background-color: #1b1d1d;
`,q=f(We)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${e=>e.$orientation===1?"row":"column"};

  ${Ue} {
    ${e=>e.$pressed&&de()}

    ${e=>e.$orientation===1?re`
            width: ${i(3)};
            height: 60%;
          `:re`
            height: ${i(3)};
            width: 60%;
          `};
  }
`,wn=f(q)`
  border-radius: ${i(5)} 0 0 ${i(5)};
`,bn=f(q)`
  border-radius: ${i(5)} ${i(5)} 0 0;
`,mn=f(q)`
  border-radius: 0 ${i(5)} ${i(5)} 0;
`,pn=f(q)`
  border-radius: 0 0 ${i(5)} ${i(5)};
`,hn=f(We)`
  &:before {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: ${i(J-7)};
    width: ${i(J-7)};
    background-color: #353535;
    border-radius: 100%;
  }
`,xn=f.div`
  display: flex;
  margin-top: ${i(35)};
`,ce=f.div`
  height: ${i(48)};
  width: ${i(5)};
  background-color: #a7a49f;
  border-radius: ${i(5)};
  box-shadow: inset 0px 0px 5px 0px rgb(95 95 95 / 66%);
`,yn=f.div`
  display: inline-flex;
  transform: rotate(-28deg);
  position: absolute;
  bottom: ${i(19)};
  right: ${i(15)};

  ${ce} + ${ce} {
    margin-left: ${i(8)};
  }
`,c={Wrapper:Ht,Device:Kt,Display:Zt,DisplayTop:Vt,DisplayHeaderText:Yt,DisplayContent:Jt,DisplayLine:Xt,Screen:qt,ScreenOverlay:Qt,Battery:tn,BatteryIndicator:en,NintendoText:nn,GameBoyText:rn,TradeMarkText:on,Controls:xn,ButtonsAB:ln,CircleButtonWrapper:cn,CircleButton:sn,ButtonText:Fe,ButtonsStartSelect:fn,WideButton:dn,WideButtonWrapper:un,WideButtonContainer:se,Arrows:_n,ArrowsLine:gn,ArrowUp:bn,ArrowDown:pn,ArrowLeft:wn,ArrowRight:mn,ArrowCenter:hn,ArrowStripe:Ue,Speakers:yn,Speaker:ce};function Sn(e){return n.jsxs(c.Display,{children:[n.jsxs(c.DisplayTop,{children:[n.jsx(c.DisplayLine,{width:"25%"}),n.jsx(c.DisplayHeaderText,{children:"DOT MATRIX WITH STEREO SOUND"}),n.jsx(c.DisplayLine,{width:"12%"})]}),n.jsxs(c.DisplayContent,{children:[n.jsxs(c.Battery,{children:[n.jsx(c.BatteryIndicator,{enabled:e.enabled}),"BATTERY"]}),n.jsxs(c.Screen,{children:[e.children,n.jsx(c.ScreenOverlay,{})]})]})]})}const $=160,U=144;function An({running:e},t){const{zoom:r}=Ft(),{input:s,onKeyDown:o,onKeyUp:u}=Mt(),a=s.includes(_.A),d=s.includes(_.B),l=s.includes(_.Start),w=s.includes(_.Select),h=s.includes(_.ArrowLeft),m=s.includes(_.ArrowRight),A=s.includes(_.ArrowUp),C=s.includes(_.ArrowDown);return n.jsx(c.Wrapper,{children:n.jsxs(c.Device,{children:[n.jsx(Sn,{enabled:e,children:n.jsx("canvas",{ref:t,style:{display:"block",imageRendering:"pixelated",zoom:r},height:U,width:$})}),n.jsxs("div",{className:"flex items-baseline",children:[n.jsx(c.NintendoText,{className:"font-pretendo",children:"Nintendo"}),n.jsx(c.GameBoyText,{className:"font-gills-sans font-medium italic",children:"GAME BOY"}),n.jsx(c.TradeMarkText,{className:"font-bold",children:"TM"})]}),n.jsxs(c.Controls,{children:[n.jsxs(c.Arrows,{children:[n.jsx(c.ArrowsLine,{children:n.jsxs(c.ArrowUp,{onPointerDown:()=>o(_.ArrowUp),onPointerUp:()=>u(_.ArrowUp),$orientation:k.HORIZONTAL,$pressed:A,children:[n.jsx(c.ArrowStripe,{}),n.jsx(c.ArrowStripe,{}),n.jsx(c.ArrowStripe,{})]})}),n.jsxs(c.ArrowsLine,{children:[n.jsxs(c.ArrowLeft,{onPointerDown:()=>o(_.ArrowLeft),onPointerUp:()=>u(_.ArrowLeft),$orientation:k.VERTICAL,$pressed:h,children:[n.jsx(c.ArrowStripe,{}),n.jsx(c.ArrowStripe,{}),n.jsx(c.ArrowStripe,{})]}),n.jsx(c.ArrowCenter,{}),n.jsxs(c.ArrowRight,{onPointerDown:()=>o(_.ArrowRight),onPointerUp:()=>u(_.ArrowRight),$orientation:k.VERTICAL,$pressed:m,children:[n.jsx(c.ArrowStripe,{}),n.jsx(c.ArrowStripe,{}),n.jsx(c.ArrowStripe,{})]})]}),n.jsx(c.ArrowsLine,{children:n.jsxs(c.ArrowDown,{onPointerDown:()=>o(_.ArrowDown),onPointerUp:()=>u(_.ArrowDown),$orientation:k.HORIZONTAL,$pressed:C,children:[n.jsx(c.ArrowStripe,{}),n.jsx(c.ArrowStripe,{}),n.jsx(c.ArrowStripe,{})]})})]}),n.jsx("div",{className:"ml-auto",children:n.jsxs(c.ButtonsAB,{className:" font-nes",children:[n.jsxs(c.CircleButtonWrapper,{children:[n.jsx(c.CircleButton,{onPointerDown:()=>o(_.B),onPointerUp:()=>u(_.B),$pressed:d}),n.jsx(c.ButtonText,{$spacing:10,children:"B"})]}),n.jsxs(c.CircleButtonWrapper,{children:[n.jsx(c.CircleButton,{onPointerDown:()=>o(_.A),onPointerUp:()=>u(_.A),$pressed:a}),n.jsx(c.ButtonText,{$spacing:10,children:"A"})]})]})})]}),n.jsxs(c.ButtonsStartSelect,{className:"font-nes",children:[n.jsxs(c.WideButtonContainer,{children:[n.jsx(c.WideButtonWrapper,{children:n.jsx(c.WideButton,{onPointerDown:()=>o(_.Select),onPointerUp:()=>u(_.Select),$pressed:w})}),n.jsx(c.ButtonText,{$spacing:1,children:"SELECT"})]}),n.jsxs(c.WideButtonContainer,{children:[n.jsx(c.WideButtonWrapper,{children:n.jsx(c.WideButton,{onPointerDown:()=>o(_.Start),onPointerUp:()=>u(_.Start),$pressed:l})}),n.jsx(c.ButtonText,{$spacing:1,children:"START"})]})]}),n.jsxs(c.Speakers,{children:[n.jsx(c.Speaker,{}),n.jsx(c.Speaker,{}),n.jsx(c.Speaker,{}),n.jsx(c.Speaker,{}),n.jsx(c.Speaker,{}),n.jsx(c.Speaker,{})]})]})})}const jn=g.forwardRef(An),vn="12px",K={Icon:f.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  `,Wrapper:f.div`
    font-size: ${vn};
    display: flex;
    align-items: center;
    justify-content: center;
  `,Value:f.div`
    margin: 0 5px;
  `};function En(e){const{zoom:t,onChange:r}=e;return n.jsxs(K.Wrapper,{children:[n.jsx(K.Icon,{children:n.jsx("button",{type:"button",onClick:()=>r(Math.max(1,t-.5)),children:"-"})}),n.jsxs(K.Value,{children:["Zoom: ",t.toFixed(1)]}),n.jsx(K.Icon,{children:n.jsx("button",{type:"button",onClick:()=>r(Math.min(t+.5,5)),children:"+"})})]})}const $n=f.div`
  cursor: pointer;
`;function Tn(){const e=Ve();return n.jsx($n,{onClick:()=>e(-1),children:"←"})}const ze=qe.filter(e=>["demos/cgb-acid2.gbc","demos/dmg-acid2.gb","demos/gejmboj.gb","demos/oh.gb","demos/opus5.gb","demos/pocket.gb"].includes(e.name)),Cn=ze.find(e=>e.name==="demos/oh.gb")||null;function Ln(e){const t=g.useCallback(r=>{r&&Pt(r.url).then(s=>e.onCartridgeLoad({name:r.name,bytes:s}))},[]);return g.useEffect(()=>{t(Cn)},[t]),n.jsx("table",{children:n.jsx("tbody",{children:ze.map(r=>n.jsxs("tr",{className:e.selectedName===r.name?"font-medium underline":"",children:[n.jsx("td",{className:"px-1",children:r.name}),n.jsx("td",{className:"px-1",children:n.jsx("button",{type:"button",onClick:()=>t(r),children:"Load"})})]},r.url))})})}const On=12,ne=20,me=30,Nn=64,Bn=f.span`
  font-size: ${On}px;
`,Rn=f.canvas`
  display: inline-block;
`,D=[];function Dn(){const e=g.useRef(window.performance.now()),t=g.useRef(null),r=g.useRef(0);return g.useEffect(()=>{function s(){r.current=window.requestAnimationFrame(()=>{const o=window.performance.now(),u=o-e.current;e.current=o;const a=Math.round(1e3/u);D.push(a),D.length>Nn&&D.shift();const d=Math.round(D.reduce((w,h)=>w+h)/D.length),l=t.current?.getContext("2d");l&&(l.clearRect(0,0,me,ne),l.textBaseline="middle",l.font="12px Arial",l.fillText(d.toString(),1,ne/2+1)),s()})}return s(),()=>window.cancelAnimationFrame(r.current)},[]),n.jsxs(Bn,{className:"flex items-center justify-end",children:["Average FPS: ",n.jsx(Rn,{width:me,height:ne,ref:t})]})}function In(e){const{onLoad:t,className:r,children:s}=e,o=u=>{const{files:a}=u.currentTarget;if(!a)return;const d=a[0];d.arrayBuffer().then(l=>new Uint8Array(l)).then(l=>t({name:`Custom: ${d.name}`,bytes:l,custom:!0}))};return n.jsxs(n.Fragment,{children:[n.jsx("input",{onChange:o,accept:".gb,.gbc",style:{display:"none"},id:"file",multiple:!0,type:"file"}),n.jsx("label",{className:r,htmlFor:"file",children:s})]})}const kn=1.5,Pn="#6D7C00",j=new AudioContext({sampleRate:44100});function Mn(e,t){const r=e.get_canvas_data_pointer(),s=t.createImageData($,U),o=new Uint8Array(le.buffer,r,$*U*3);be(0,U).forEach(u=>{be(0,$).forEach(a=>{const d=(u*$+a)*3,l=(u*$+a)*4;s.data[l]=o[d],s.data[l+1]=o[d+1],s.data[l+2]=o[d+2],s.data[l+3]=255})}),t.putImageData(s,0,0)}function pe(e){e.fillStyle=Pn,e.fillRect(0,0,$,U)}const I=2;function Fn(e){const{bytes:t,wasmModule:r,running:s,ctx:o,soundEnabled:u}=e,a=g.useRef(),d=g.useRef(0),l=g.useRef(0),w=Dt();g.useEffect(()=>{pe(o)},[o]);const h=g.useCallback(m=>{const A=r.get_audio_buffer_size(),C=new Float32Array(le.buffer,m,A),B=C.length/I,x=j.createBuffer(I,B,j.sampleRate);for(let E=0;E<I;E+=1){const Ge=x.getChannelData(E);for(let z=0;z<B;z+=1)Ge[z]=C[z*I+E]}const v=j.createBufferSource();v.buffer=x,v.connect(j.destination),d.current<=j.currentTime+.02&&(d.current=j.currentTime+.06),v.start(d.current),d.current+=A/I/j.sampleRate},[]);return g.useEffect(()=>{if(!t)return;const m=new r.WebCartridge(t);d.current=0,a.current=new r.WebEmulator(m,()=>{}),pe(o),w(a.current)},[t,r,w]),g.useEffect(()=>{const m=a.current;m&&m.set_audio_buffer_callback(u?h:()=>{})},[a.current,u,h]),g.useEffect(()=>{const m=a.current;if(m)if(s){const A=()=>{m.run_frame(),Mn(m,o),l.current=window.requestAnimationFrame(A)};A()}else window.cancelAnimationFrame(l.current)},[s]),null}function Gn(){const[e,t]=oe.useLocalStorage("zoom",kn),[r,s]=oe.useLocalStorage("sound_enabled",!1),[o,u]=g.useState(!1),[a,d]=g.useState(),[l,w]=g.useState(null),h={zoom:e},m=It(),A=()=>{kt(j),u(x=>x?!1:!!(!x&&l))},C=g.useCallback(x=>{x&&d(v=>{if(v)return v;const E=x.getContext("2d");return E||v})},[]),B=x=>{u(!1),w(x)};return m?n.jsx("div",{className:"select-none",children:n.jsx(Bt,{children:n.jsxs(Je,{theme:h,children:[n.jsxs("div",{className:"grid grid-cols-3 justify-between items-center mx-2 pt-2",children:[n.jsx(Tn,{}),n.jsx(En,{zoom:e,onChange:t}),n.jsx("div",{className:"justify-end",children:n.jsx(Dn,{})})]}),n.jsx(jn,{running:o,ref:C}),a&&n.jsx(Fn,{bytes:l?.bytes,wasmModule:m,running:o,soundEnabled:r,ctx:a}),n.jsxs("div",{className:"mt-2 flex justify-center items-center text-xs",children:[n.jsx("button",{className:"mx-2 border rounded px-1 py-1",type:"button",onClick:A,children:o?"Stop":"Run"}),n.jsx(In,{className:"mx-2 border rounded px-1 py-1",onLoad:B,children:"Upload ROM"}),n.jsxs("label",{className:"flex justify-center items-center",htmlFor:"soundEnableCheckbox",children:[n.jsx("input",{id:"soundEnableCheckbox",className:"mr-1",type:"checkbox",checked:r,onChange:x=>s(x.currentTarget.checked)}),"Enable sound"]})]}),l?.custom&&n.jsx("div",{className:"mt-2 flex justify-center text-xs",children:l.name}),n.jsx("div",{className:"mt-2 flex justify-center text-xs",children:n.jsx(Ln,{selectedName:l?.name,onCartridgeLoad:B})}),n.jsx("div",{className:"mt-2 flex text-center justify-center text-xs",children:n.jsxs("div",{children:[n.jsx("p",{children:"Select one of the available demos or upload your custom *.gb file and press Run"}),n.jsxs("p",{children:["The test ROMs are available in"," ",n.jsx(fe,{className:"underline",to:"/debug",children:"debug mode"}),". You can see the test results"," ",n.jsx(fe,{className:"underline",to:"/test-results",children:"here"}),"."]})]})})]})})}):n.jsx(Ye,{})}export{Gn as Play,Gn as default};
