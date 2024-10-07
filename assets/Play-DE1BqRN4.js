import{r as g,j as n,_ as Ze,n as Ve,d as f,l as re,u as Ye,F as qe,o as Je,L as fe}from"./index-1po9gasf.js";import{_ as Xe}from"./__vite-plugin-wasm-helper-D7K_KhUE.js";import{r as Qe}from"./romsList-Ch2JJVv5.js";var oe={},J={},ce={},S={},B={};Object.defineProperty(B,"__esModule",{value:!0});B.isBrowser=void 0;B.isBrowser=function(){return typeof window<"u"&&typeof window.document<"u"};Object.defineProperty(S,"__esModule",{value:!0});S.storage=S.MemoryStorageProxy=S.LocalStorageProxy=S.localStorageAvailable=void 0;var et=B;function ye(){try{var e="@rehooks/local-storage:"+new Date().toISOString();return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(t){return et.isBrowser()&&t instanceof DOMException&&(t.code===22||t.code===1014||t.name==="QuotaExceededError"||t.name==="NS_ERROR_DOM_QUOTA_REACHED")&&localStorage&&localStorage.length!==0}}S.localStorageAvailable=ye;var Se=function(){function e(){}return e.prototype.getItem=function(t){return localStorage.getItem(t)},e.prototype.setItem=function(t,r){localStorage.setItem(t,r)},e.prototype.removeItem=function(t){localStorage.removeItem(t)},e}();S.LocalStorageProxy=Se;var Ae=function(){function e(){this._memoryStorage=new Map}return e.prototype.getItem=function(t){var r;return(r=this._memoryStorage.get(t))!==null&&r!==void 0?r:null},e.prototype.setItem=function(t,r){this._memoryStorage.set(t,r)},e.prototype.removeItem=function(t){this._memoryStorage.delete(t)},e}();S.MemoryStorageProxy=Ae;var tt=function(e){return e?new Se:new Ae};S.storage=tt(ye());(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.deleteFromStorage=e.writeStorage=e.isTypeOfLocalStorageChanged=e.LOCAL_STORAGE_CHANGE_EVENT_NAME=void 0;var t=S,r=B;e.LOCAL_STORAGE_CHANGE_EVENT_NAME="onLocalStorageChange",function(){if(!r.isBrowser()||typeof window.CustomEvent=="function")return;function c(d,l){var w,h;l===void 0&&(l={bubbles:!1,cancelable:!1});var m=document.createEvent("CustomEvent");return m.initCustomEvent(d,(w=l?.bubbles)!==null&&w!==void 0?w:!1,(h=l?.cancelable)!==null&&h!==void 0?h:!1,l?.detail),m}window.CustomEvent=c}();function o(c){return!!c&&c.type===e.LOCAL_STORAGE_CHANGE_EVENT_NAME}e.isTypeOfLocalStorageChanged=o;function i(c,d){if(r.isBrowser())try{t.storage.setItem(c,typeof d=="object"?JSON.stringify(d):""+d),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:c,value:d}}))}catch(l){throw l instanceof TypeError&&l.message.includes("circular structure")?new TypeError(`The object that was given to the writeStorage function has circular references.
For more information, check here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value`):l}}e.writeStorage=i;function u(c){r.isBrowser()&&(t.storage.removeItem(c),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:c,value:null}})))}e.deleteFromStorage=u})(ce);Object.defineProperty(J,"__esModule",{value:!0});J.useLocalStorage=void 0;var $=ce,nt=B,Q=S,D=g;function _e(e){try{return JSON.parse(e)}catch{return e}}function rt(e,t){t===void 0&&(t=null);var r=D.useState(Q.storage.getItem(e)===null?t:_e(Q.storage.getItem(e))),o=r[0],i=r[1],u=D.useCallback(function(w){$.isTypeOfLocalStorageChanged(w)?w.detail.key===e&&i(w.detail.value):w.key===e&&i(w.newValue===null?null:_e(w.newValue))},[i,e]);D.useEffect(function(){if(nt.isBrowser()){var w=function(h){u(h)};return window.addEventListener($.LOCAL_STORAGE_CHANGE_EVENT_NAME,w),window.addEventListener("storage",w),Q.storage.getItem(e)===null&&t!==null&&$.writeStorage(e,t),function(){window.removeEventListener($.LOCAL_STORAGE_CHANGE_EVENT_NAME,w),window.removeEventListener("storage",w)}}},[e,t,u]);var c=D.useCallback(function(w){return w instanceof Function?$.writeStorage(e,w(o)):$.writeStorage(e,w)},[e]),d=D.useCallback(function(){return $.deleteFromStorage(e)},[e]),l=o??t;return[l,c,d]}J.useLocalStorage=rt;(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.useLocalStorage=void 0;var t=J;Object.defineProperty(e,"useLocalStorage",{enumerable:!0,get:function(){return t.useLocalStorage}});var r=ce;Object.defineProperty(e,"writeStorage",{enumerable:!0,get:function(){return r.writeStorage}}),Object.defineProperty(e,"deleteFromStorage",{enumerable:!0,get:function(){return r.deleteFromStorage}}),e.default=t.useLocalStorage})(oe);const ot="/feather-gb/assets/gb_web_bg-C2q5qRm4.wasm";let b;function je(e){b=e}const y=new Array(128).fill(void 0);y.push(void 0,null,!0,!1);function C(e){return y[e]}let M=y.length;function z(e){M===y.length&&y.push(y.length+1);const t=M;return M=y[t],y[t]=e,t}function it(e){e<132||(y[e]=M,M=e)}function st(e){const t=C(e);return it(e),t}const at=typeof TextDecoder>"u"?(0,module.require)("util").TextDecoder:TextDecoder;let ve=new at("utf-8",{ignoreBOM:!0,fatal:!0});ve.decode();let H=null;function F(){return(H===null||H.byteLength===0)&&(H=new Uint8Array(b.memory.buffer)),H}function Ee(e,t){return e=e>>>0,ve.decode(F().subarray(e,e+t))}function ie(e){const t=typeof e;if(t=="number"||t=="boolean"||e==null)return`${e}`;if(t=="string")return`"${e}"`;if(t=="symbol"){const i=e.description;return i==null?"Symbol":`Symbol(${i})`}if(t=="function"){const i=e.name;return typeof i=="string"&&i.length>0?`Function(${i})`:"Function"}if(Array.isArray(e)){const i=e.length;let u="[";i>0&&(u+=ie(e[0]));for(let c=1;c<i;c++)u+=", "+ie(e[c]);return u+="]",u}const r=/\[object ([^\]]+)\]/.exec(toString.call(e));let o;if(r.length>1)o=r[1];else return toString.call(e);if(o=="Object")try{return"Object("+JSON.stringify(e)+")"}catch{return"Object"}return e instanceof Error?`${e.name}: ${e.message}
${e.stack}`:o}let N=0;const ct=typeof TextEncoder>"u"?(0,module.require)("util").TextEncoder:TextEncoder;let Z=new ct("utf-8");const lt=typeof Z.encodeInto=="function"?function(e,t){return Z.encodeInto(e,t)}:function(e,t){const r=Z.encode(e);return t.set(r),{read:e.length,written:r.length}};function $e(e,t,r){if(r===void 0){const d=Z.encode(e),l=t(d.length,1)>>>0;return F().subarray(l,l+d.length).set(d),N=d.length,l}let o=e.length,i=t(o,1)>>>0;const u=F();let c=0;for(;c<o;c++){const d=e.charCodeAt(c);if(d>127)break;u[i+c]=d}if(c!==o){c!==0&&(e=e.slice(c)),i=r(i,o,o=c+e.length*3,1)>>>0;const d=F().subarray(i+c,i+o),l=lt(e,d);c+=l.written,i=r(i,o,c,1)>>>0}return N=c,i}let O=null;function Y(){return(O===null||O.buffer.detached===!0||O.buffer.detached===void 0&&O.buffer!==b.memory.buffer)&&(O=new DataView(b.memory.buffer)),O}function ut(e,t){const r=t(e.length*1,1)>>>0;return F().set(e,r/1),N=e.length,r}function dt(){return b.get_audio_buffer_size()>>>0}function ft(e,t){if(!(e instanceof t))throw new Error(`expected instance of ${t.name}`);return e.ptr}let U=128;function ge(e){if(U==1)throw new Error("out of js stack");return y[--U]=e,U}function _t(){b.init()}function gt(e,t){try{return e.apply(this,t)}catch(r){b.__wbindgen_exn_store(z(r))}}const _=Object.freeze({ArrowDown:0,0:"ArrowDown",ArrowLeft:1,1:"ArrowLeft",ArrowRight:2,2:"ArrowRight",ArrowUp:3,3:"ArrowUp",A:4,4:"A",B:5,5:"B",Start:6,6:"Start",Select:7,7:"Select"}),we=typeof FinalizationRegistry>"u"?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(e=>b.__wbg_webcartridge_free(e>>>0,1));class Te{__destroy_into_raw(){const t=this.__wbg_ptr;return this.__wbg_ptr=0,we.unregister(this),t}free(){const t=this.__destroy_into_raw();b.__wbg_webcartridge_free(t,0)}constructor(t){const r=ut(t,b.__wbindgen_malloc),o=N,i=b.webcartridge_new(r,o);return this.__wbg_ptr=i>>>0,we.register(this,this.__wbg_ptr,this),this}}const be=typeof FinalizationRegistry>"u"?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(e=>b.__wbg_webemulator_free(e>>>0,1));class wt{__destroy_into_raw(){const t=this.__wbg_ptr;return this.__wbg_ptr=0,be.unregister(this),t}free(){const t=this.__destroy_into_raw();b.__wbg_webemulator_free(t,0)}constructor(t,r){try{ft(t,Te);var o=t.__destroy_into_raw();const i=b.webemulator_new(o,ge(r));return this.__wbg_ptr=i>>>0,be.register(this,this.__wbg_ptr,this),this}finally{y[U++]=void 0}}run_frame(){b.webemulator_run_frame(this.__wbg_ptr)}get_canvas_data_pointer(){return b.webemulator_get_canvas_data_pointer(this.__wbg_ptr)>>>0}on_key_down(t){b.webemulator_on_key_down(this.__wbg_ptr,t)}on_key_up(t){b.webemulator_on_key_up(this.__wbg_ptr,t)}set_audio_buffer_callback(t){try{b.webemulator_set_audio_buffer_callback(this.__wbg_ptr,ge(t))}finally{y[U++]=void 0}}}function Ce(e){const t=C(e);return z(t)}function Le(){const e=new Error;return z(e)}function Oe(e,t){const r=C(t).stack,o=$e(r,b.__wbindgen_malloc,b.__wbindgen_realloc),i=N;Y().setInt32(e+4*1,i,!0),Y().setInt32(e+4*0,o,!0)}function Ne(e,t){let r,o;try{r=e,o=t,console.error(Ee(e,t))}finally{b.__wbindgen_free(r,o,1)}}function Be(e){st(e)}function Re(e){return z(e)}function De(){return gt(function(e,t,r){const o=C(e).call(C(t),C(r));return z(o)},arguments)}function Ie(e,t){throw new Error(Ee(e,t))}function ke(e,t){const r=ie(C(t)),o=$e(r,b.__wbindgen_malloc,b.__wbindgen_realloc),i=N;Y().setInt32(e+4*1,i,!0),Y().setInt32(e+4*0,o,!0)}URL=globalThis.URL;const p=await Xe({"./gb_web_bg.js":{__wbindgen_object_clone_ref:Ce,__wbg_new_abda76e883ba8a5f:Le,__wbg_stack_658279fe44541cf6:Oe,__wbg_error_f851667af71bcfc6:Ne,__wbindgen_object_drop_ref:Be,__wbindgen_number_new:Re,__wbg_call_89af060b4e1523f2:De,__wbindgen_throw:Ie,__wbindgen_debug_string:ke}},ot),le=p.memory,bt=p.__wbg_webcartridge_free,mt=p.webcartridge_new,pt=p.get_audio_buffer_size,ht=p.__wbg_webemulator_free,xt=p.webemulator_new,yt=p.webemulator_run_frame,St=p.webemulator_get_canvas_data_pointer,At=p.webemulator_on_key_down,jt=p.webemulator_on_key_up,vt=p.webemulator_set_audio_buffer_callback,Et=p.init,$t=p.__wbindgen_malloc,Tt=p.__wbindgen_realloc,Ct=p.__wbindgen_free,Lt=p.__wbindgen_exn_store,Ot=Object.freeze(Object.defineProperty({__proto__:null,__wbg_webcartridge_free:bt,__wbg_webemulator_free:ht,__wbindgen_exn_store:Lt,__wbindgen_free:Ct,__wbindgen_malloc:$t,__wbindgen_realloc:Tt,get_audio_buffer_size:pt,init:Et,memory:le,webcartridge_new:mt,webemulator_get_canvas_data_pointer:St,webemulator_new:xt,webemulator_on_key_down:At,webemulator_on_key_up:jt,webemulator_run_frame:yt,webemulator_set_audio_buffer_callback:vt},Symbol.toStringTag,{value:"Module"})),ue=g.createContext({input:[],onKeyDown:()=>{},onKeyUp:()=>{}});function Nt({children:e}){const[t,r]=g.useState([]),o=g.useCallback(u=>{r(c=>c.filter(d=>u!==d))},[]),i=g.useCallback(u=>{r(c=>c.includes(u)?c:[...c,u])},[]);return n.jsx(ue.Provider,{value:{input:t,onKeyUp:o,onKeyDown:i},children:e})}je(Ot);const Bt=Object.freeze(Object.defineProperty({__proto__:null,JsKeys:_,WebCartridge:Te,WebEmulator:wt,__wbg_call_89af060b4e1523f2:De,__wbg_error_f851667af71bcfc6:Ne,__wbg_new_abda76e883ba8a5f:Le,__wbg_set_wasm:je,__wbg_stack_658279fe44541cf6:Oe,__wbindgen_debug_string:ke,__wbindgen_number_new:Re,__wbindgen_object_clone_ref:Ce,__wbindgen_object_drop_ref:Be,__wbindgen_throw:Ie,get_audio_buffer_size:dt,init:_t},Symbol.toStringTag,{value:"Module"})),ee={ArrowDown:_.ArrowDown,ArrowUp:_.ArrowUp,ArrowLeft:_.ArrowLeft,ArrowRight:_.ArrowRight,KeyD:_.ArrowRight,KeyA:_.ArrowLeft,KeyW:_.ArrowUp,KeyS:_.ArrowDown,KeyJ:_.A,KeyX:_.A,KeyK:_.B,KeyC:_.B,KeyB:_.Start,KeyN:_.Select};function Rt(){const{onKeyDown:e,onKeyUp:t,input:r}=g.useContext(ue),o=g.useRef();return g.useEffect(()=>{Object.values(ee).forEach(u=>{r.includes(u)?o.current?.on_key_down(u):o.current?.on_key_up(u)})},[r]),g.useEffect(()=>{const u=d=>{const l=ee[d.code];l!==void 0&&e(l)},c=d=>{const l=ee[d.code];l!==void 0&&t(l)};return window.addEventListener("keydown",u),window.addEventListener("keyup",c),()=>{window.removeEventListener("keydown",u),window.removeEventListener("keyup",c)}},[e,t]),g.useCallback(u=>{o.current=u},[])}function Dt(){const[e,t]=g.useState(null);return g.useEffect(()=>{Ze(()=>Promise.resolve().then(()=>Bt),void 0).then(r=>{r.init(),t(r)}).catch(console.error)},[]),e}let me=!1;function It(e){if(me)return;me=!0;const t=e.createBuffer(1,1,e.sampleRate),r=e.createBufferSource();r.buffer=t,r.connect(e.destination),r.start(0),e.resume()}function pe(e,t,r=1){if(r>0&&e>=t||r<0&&e<=t)return[];const o=[];for(let i=e;r>0?i<t:i>t;i+=r)o.push(i);return o}function kt(e){return fetch(e).then(t=>t.arrayBuffer()).then(t=>new Uint8Array(t))}function Pt(){return g.useContext(ue)}function Mt(){return Ve()}const Pe=45,Me=23,Fe=6,te=9,Ft=20,Ut=13,V=36,Ue=25,q=26,Wt="#393C81",zt="#8A205E";function s(e){return t=>`${t.theme.zoom*e}px`}function de(){return re`
    filter: brightness(80%);
  `}const Gt=f.div`
  display: flex;
  justify-content: center;
`,Ht=f.div`
  display: inline-block;
  margin: 10px;
  background: #eee;
  border-radius: 10px 10px 60px 10px;
  box-shadow: 5px 5px rgba(0, 0, 0, 0.1);
  padding: ${s(20)};
  color: ${Wt};
  position: relative;
`,Kt=f.div`
  background-color: #777;
  border-radius: ${s(7)} ${s(7)} ${s(40)} ${s(7)};
  box-shadow: inset 0px 0px 20px 0px rgba(0, 0, 0, 0.66);
`,Zt=f.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${s(Me)};
  font-size: ${s(Fe)};
  font-family: Arial;
  color: #b3b3b3;
  padding: 0 ${s(8)} 0;
`,Vt=f.div`
  flex: 0 0 auto;
  margin: 0 ${s(5)};
`,Yt=f.div`
  display: flex;
  margin-right: ${s(Pe)};
  padding-bottom: ${s(Me)};
`,qt=f.div`
  flex: 1 1 ${e=>e.width};
  height: ${s(3)};
  background-color: #8b1d90;
  box-shadow: 0 ${s(2*3)} 0 #283593;
  margin-top: -${s(2*3)};
`,Jt=f.div`
  margin-left: auto;
  margin-right: auto;
  position: relative;
`,Xt=f.div`
  position: absolute;
  box-shadow: inset 5px 5px 5px 0px rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`,Qt=f.div`
  background-color: ${e=>e.$enabled?"#f00":"#000"};
  box-shadow: 0 0 3px 1px #ef5350;
  height: ${s(te)};
  width: ${s(te)};
  border-radius: ${e=>e.theme.zoom*te/2}px;
  margin: 10px 20px 10px 10px;
  box-shadow: inset 0px 0px 5px 0px rgba(0, 0, 0, 0.66);
`,en=f.div`
  font-family: Arial;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #b3b3b3;
  width: ${s(Pe)};
  font-size: ${s(Fe)};
  margin-bottom: 80px;
`,tn=f.div`
  letter-spacing: 1px;
  font-size: ${s(Ut)};
`,nn=f.div`
  margin-left: ${s(2)};
  font-size: ${s(Ft)};
`,rn=f.div`
  font-size: ${s(6)};
`,on=f.div`
  background-color: ${zt};
  height: ${s(V)};
  width: ${s(V)};
  border-radius: ${s(V/2)};

  ${e=>e.$pressed&&de()}
`,sn=f.div`
  position: relative;
`,an=f.div`
  font-size: ${s(12)};
  letter-spacing: ${s(1)};
`,We=f(an)`
  margin-top: ${e=>s(e.$spacing)};
`,cn=f.div`
  display: inline-flex;
  margin-top: ${s(10)};
  margin-right: -${s(12)};
  transform: rotate(-${Ue}deg);
  padding: ${s(5)};

  background-color: #dfdfdf;
  box-shadow: 0 0 0 5px #dfdfdf;
  border-radius: ${s(V)};

  > * + * {
    margin-left: ${s(18)};
  }

  ${We} {
    bottom: -${s(25)};
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
  }
`,se=f.div`
  transform: rotate(-${Ue}deg);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`,ln=f.div`
  border-radius: ${s((9+2*5)/2)};
  background-color: #dfdfdf;
  padding: ${s(5)};
`,un=f.div`
  background-color: #868a8d;
  width: ${s(38)};
  height: ${s(9)};
  border-radius: ${s(9/2)};
  ${e=>e.$pressed&&de()}
`,dn=f.div`
  display: flex;
  margin-left: ${s(80)};
  margin-top: ${s(30)};
  margin-bottom: ${s(40)};
  ${se} + ${se} {
    margin-left: ${s(7)};
  }
`,fn=f.div``;var P=(e=>(e[e.HORIZONTAL=0]="HORIZONTAL",e[e.VERTICAL=1]="VERTICAL",e))(P||{});const _n=f.div`
  display: flex;
  justify-content: center;
`,ze=f.div`
  width: ${s(2)};
  height: 80%;
  background-color: #353535;
  margin: ${s(2)};
  border-radius: ${s(5)};
`,Ge=f.div`
  position: relative;
  height: ${s(q)};
  width: ${s(q)};
  background-color: #1b1d1d;
`,X=f(Ge)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${e=>e.$orientation===1?"row":"column"};

  ${ze} {
    ${e=>e.$pressed&&de()}

    ${e=>e.$orientation===1?re`
            width: ${s(3)};
            height: 60%;
          `:re`
            height: ${s(3)};
            width: 60%;
          `};
  }
`,gn=f(X)`
  border-radius: ${s(5)} 0 0 ${s(5)};
`,wn=f(X)`
  border-radius: ${s(5)} ${s(5)} 0 0;
`,bn=f(X)`
  border-radius: 0 ${s(5)} ${s(5)} 0;
`,mn=f(X)`
  border-radius: 0 0 ${s(5)} ${s(5)};
`,pn=f(Ge)`
  &:before {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: ${s(q-7)};
    width: ${s(q-7)};
    background-color: #353535;
    border-radius: 100%;
  }
`,hn=f.div`
  display: flex;
  margin-top: ${s(35)};
`,ae=f.div`
  height: ${s(48)};
  width: ${s(5)};
  background-color: #a7a49f;
  border-radius: ${s(5)};
  box-shadow: inset 0px 0px 5px 0px rgb(95 95 95 / 66%);
`,xn=f.div`
  display: inline-flex;
  transform: rotate(-28deg);
  position: absolute;
  bottom: ${s(19)};
  right: ${s(15)};

  ${ae} + ${ae} {
    margin-left: ${s(8)};
  }
`,a={Wrapper:Gt,Device:Ht,Display:Kt,DisplayTop:Zt,DisplayHeaderText:Vt,DisplayContent:Yt,DisplayLine:qt,Screen:Jt,ScreenOverlay:Xt,Battery:en,BatteryIndicator:Qt,NintendoText:tn,GameBoyText:nn,TradeMarkText:rn,Controls:hn,ButtonsAB:cn,CircleButtonWrapper:sn,CircleButton:on,ButtonText:We,ButtonsStartSelect:dn,WideButton:un,WideButtonWrapper:ln,WideButtonContainer:se,Arrows:fn,ArrowsLine:_n,ArrowUp:wn,ArrowDown:mn,ArrowLeft:gn,ArrowRight:bn,ArrowCenter:pn,ArrowStripe:ze,Speakers:xn,Speaker:ae};function yn(e){return n.jsxs(a.Display,{children:[n.jsxs(a.DisplayTop,{children:[n.jsx(a.DisplayLine,{width:"25%"}),n.jsx(a.DisplayHeaderText,{children:"DOT MATRIX WITH STEREO SOUND"}),n.jsx(a.DisplayLine,{width:"12%"})]}),n.jsxs(a.DisplayContent,{children:[n.jsxs(a.Battery,{children:[n.jsx(a.BatteryIndicator,{$enabled:e.enabled}),"BATTERY"]}),n.jsxs(a.Screen,{children:[e.children,n.jsx(a.ScreenOverlay,{})]})]})]})}const T=160,W=144;function Sn({running:e},t){const{zoom:r}=Mt(),{input:o,onKeyDown:i,onKeyUp:u}=Pt(),c=o.includes(_.A),d=o.includes(_.B),l=o.includes(_.Start),w=o.includes(_.Select),h=o.includes(_.ArrowLeft),m=o.includes(_.ArrowRight),A=o.includes(_.ArrowUp),L=o.includes(_.ArrowDown);return n.jsx(a.Wrapper,{children:n.jsxs(a.Device,{children:[n.jsx(yn,{enabled:e,children:n.jsx("canvas",{ref:t,style:{display:"block",imageRendering:"pixelated",zoom:r},height:W,width:T})}),n.jsxs("div",{className:"flex items-baseline",children:[n.jsx(a.NintendoText,{className:"font-pretendo",children:"Nintendo"}),n.jsx(a.GameBoyText,{className:"font-gills-sans font-medium italic",children:"GAME BOY"}),n.jsx(a.TradeMarkText,{className:"font-bold",children:"TM"})]}),n.jsxs(a.Controls,{children:[n.jsxs(a.Arrows,{children:[n.jsx(a.ArrowsLine,{children:n.jsxs(a.ArrowUp,{onPointerDown:()=>i(_.ArrowUp),onPointerUp:()=>u(_.ArrowUp),$orientation:P.HORIZONTAL,$pressed:A,children:[n.jsx(a.ArrowStripe,{}),n.jsx(a.ArrowStripe,{}),n.jsx(a.ArrowStripe,{})]})}),n.jsxs(a.ArrowsLine,{children:[n.jsxs(a.ArrowLeft,{onPointerDown:()=>i(_.ArrowLeft),onPointerUp:()=>u(_.ArrowLeft),$orientation:P.VERTICAL,$pressed:h,children:[n.jsx(a.ArrowStripe,{}),n.jsx(a.ArrowStripe,{}),n.jsx(a.ArrowStripe,{})]}),n.jsx(a.ArrowCenter,{}),n.jsxs(a.ArrowRight,{onPointerDown:()=>i(_.ArrowRight),onPointerUp:()=>u(_.ArrowRight),$orientation:P.VERTICAL,$pressed:m,children:[n.jsx(a.ArrowStripe,{}),n.jsx(a.ArrowStripe,{}),n.jsx(a.ArrowStripe,{})]})]}),n.jsx(a.ArrowsLine,{children:n.jsxs(a.ArrowDown,{onPointerDown:()=>i(_.ArrowDown),onPointerUp:()=>u(_.ArrowDown),$orientation:P.HORIZONTAL,$pressed:L,children:[n.jsx(a.ArrowStripe,{}),n.jsx(a.ArrowStripe,{}),n.jsx(a.ArrowStripe,{})]})})]}),n.jsx("div",{className:"ml-auto",children:n.jsxs(a.ButtonsAB,{className:" font-nes",children:[n.jsxs(a.CircleButtonWrapper,{children:[n.jsx(a.CircleButton,{onPointerDown:()=>i(_.B),onPointerUp:()=>u(_.B),$pressed:d}),n.jsx(a.ButtonText,{$spacing:10,children:"B"})]}),n.jsxs(a.CircleButtonWrapper,{children:[n.jsx(a.CircleButton,{onPointerDown:()=>i(_.A),onPointerUp:()=>u(_.A),$pressed:c}),n.jsx(a.ButtonText,{$spacing:10,children:"A"})]})]})})]}),n.jsxs(a.ButtonsStartSelect,{className:"font-nes",children:[n.jsxs(a.WideButtonContainer,{children:[n.jsx(a.WideButtonWrapper,{children:n.jsx(a.WideButton,{onPointerDown:()=>i(_.Select),onPointerUp:()=>u(_.Select),$pressed:w})}),n.jsx(a.ButtonText,{$spacing:1,children:"SELECT"})]}),n.jsxs(a.WideButtonContainer,{children:[n.jsx(a.WideButtonWrapper,{children:n.jsx(a.WideButton,{onPointerDown:()=>i(_.Start),onPointerUp:()=>u(_.Start),$pressed:l})}),n.jsx(a.ButtonText,{$spacing:1,children:"START"})]})]}),n.jsxs(a.Speakers,{children:[n.jsx(a.Speaker,{}),n.jsx(a.Speaker,{}),n.jsx(a.Speaker,{}),n.jsx(a.Speaker,{}),n.jsx(a.Speaker,{}),n.jsx(a.Speaker,{})]})]})})}const An=g.forwardRef(Sn),jn="12px",K={Icon:f.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  `,Wrapper:f.div`
    font-size: ${jn};
    display: flex;
    align-items: center;
    justify-content: center;
  `,Value:f.div`
    margin: 0 5px;
  `};function vn(e){const{zoom:t,onChange:r}=e;return n.jsxs(K.Wrapper,{children:[n.jsx(K.Icon,{children:n.jsx("button",{type:"button",onClick:()=>r(Math.max(1,t-.5)),children:"-"})}),n.jsxs(K.Value,{children:["Zoom: ",t.toFixed(1)]}),n.jsx(K.Icon,{children:n.jsx("button",{type:"button",onClick:()=>r(Math.min(t+.5,5)),children:"+"})})]})}const En=f.div`
  cursor: pointer;
`;function $n(){const e=Ye();return n.jsx(En,{onClick:()=>e(-1),children:"←"})}const He=Qe.filter(e=>["demos/cgb-acid2.gbc","demos/dmg-acid2.gb","demos/gejmboj.gb","demos/oh.gb","demos/opus5.gb","demos/pocket.gb"].includes(e.name)),Tn=He.find(e=>e.name==="demos/oh.gb")||null;function Cn({onCartridgeLoad:e,selectedName:t}){const r=g.useCallback(o=>{o&&kt(o.url).then(i=>e({name:o.name,bytes:i}))},[e]);return g.useEffect(()=>{r(Tn)},[r]),n.jsx("table",{children:n.jsx("tbody",{children:He.map(o=>n.jsxs("tr",{className:t===o.name?"font-medium underline":"",children:[n.jsx("td",{className:"px-1",children:o.name}),n.jsx("td",{className:"px-1",children:n.jsx("button",{type:"button",onClick:()=>r(o),children:"Load"})})]},o.url))})})}const Ln=12,ne=20,he=30,On=64,Nn=f.span`
  font-size: ${Ln}px;
`,Bn=f.canvas`
  display: inline-block;
`,I=[];function Rn(){const e=g.useRef(window.performance.now()),t=g.useRef(null),r=g.useRef(0);return g.useEffect(()=>{function o(){r.current=window.requestAnimationFrame(()=>{const i=window.performance.now(),u=i-e.current;e.current=i;const c=Math.round(1e3/u);I.push(c),I.length>On&&I.shift();const d=Math.round(I.reduce((w,h)=>w+h)/I.length),l=t.current?.getContext("2d");l&&(l.clearRect(0,0,he,ne),l.textBaseline="middle",l.font="12px Arial",l.fillText(d.toString(),1,ne/2+1)),o()})}return o(),()=>window.cancelAnimationFrame(r.current)},[]),n.jsxs(Nn,{className:"flex items-center justify-end",children:["Average FPS:"," ",n.jsx(Bn,{width:he,height:ne,ref:t})]})}function Dn(e){const{onLoad:t,className:r,children:o}=e,i=u=>{const{files:c}=u.currentTarget;if(!c)return;const d=c[0];d.arrayBuffer().then(l=>new Uint8Array(l)).then(l=>t({name:`Custom: ${d.name}`,bytes:l,custom:!0}))};return n.jsxs(n.Fragment,{children:[n.jsx("input",{onChange:i,accept:".gb,.gbc",style:{display:"none"},id:"file",multiple:!0,type:"file"}),n.jsx("label",{className:r,htmlFor:"file",children:o})]})}const In=1.5,kn="#6D7C00",j=new AudioContext({sampleRate:44100});function Pn(e,t){const r=e.get_canvas_data_pointer(),o=t.createImageData(T,W),i=new Uint8Array(le.buffer,r,T*W*3);pe(0,W).forEach(u=>{pe(0,T).forEach(c=>{const d=(u*T+c)*3,l=(u*T+c)*4;o.data[l]=i[d],o.data[l+1]=i[d+1],o.data[l+2]=i[d+2],o.data[l+3]=255})}),t.putImageData(o,0,0)}function xe(e){e.fillStyle=kn,e.fillRect(0,0,T,W)}const k=2;function Mn(e){const{bytes:t,wasmModule:r,running:o,ctx:i,soundEnabled:u}=e,c=g.useRef(),d=g.useRef(0),l=g.useRef(0),w=Rt();g.useEffect(()=>{xe(i)},[i]);const h=g.useCallback(m=>{const A=r.get_audio_buffer_size(),L=new Float32Array(le.buffer,m,A),R=L.length/k,x=j.createBuffer(k,R,j.sampleRate);for(let E=0;E<k;E+=1){const Ke=x.getChannelData(E);for(let G=0;G<R;G+=1)Ke[G]=L[G*k+E]}const v=j.createBufferSource();v.buffer=x,v.connect(j.destination),d.current<=j.currentTime+.02&&(d.current=j.currentTime+.06),v.start(d.current),d.current+=A/k/j.sampleRate},[r.get_audio_buffer_size]);return g.useEffect(()=>{if(!t)return;const m=new r.WebCartridge(t);d.current=0,c.current=new r.WebEmulator(m,()=>{}),xe(i),w(c.current)},[i,t,r,w]),g.useEffect(()=>{const m=c.current;m&&m.set_audio_buffer_callback(u?h:()=>{})},[u,h]),g.useEffect(()=>{const m=c.current;if(m)if(o){const A=()=>{m.run_frame(),Pn(m,i),l.current=window.requestAnimationFrame(A)};A()}else window.cancelAnimationFrame(l.current)},[o,i]),null}function zn(){const[e,t]=oe.useLocalStorage("zoom",In),[r,o]=oe.useLocalStorage("sound_enabled",!1),[i,u]=g.useState(!1),[c,d]=g.useState(),[l,w]=g.useState(null),h={zoom:e},m=Dt(),A=()=>{It(j),u(x=>x?!1:!!(!x&&l))},L=g.useCallback(x=>{x&&d(v=>{if(v)return v;const E=x.getContext("2d");return E||v})},[]),R=g.useCallback(x=>{u(!1),w(x)},[]);return m?n.jsx("div",{className:"select-none",children:n.jsx(Nt,{children:n.jsxs(Je,{theme:h,children:[n.jsxs("div",{className:"grid grid-cols-3 justify-between items-center mx-2 pt-2",children:[n.jsx($n,{}),n.jsx(vn,{zoom:e,onChange:t}),n.jsx("div",{className:"justify-end",children:n.jsx(Rn,{})})]}),n.jsx(An,{running:i,ref:L}),c&&n.jsx(Mn,{bytes:l?.bytes,wasmModule:m,running:i,soundEnabled:r,ctx:c}),n.jsxs("div",{className:"mt-2 flex justify-center items-center text-xs",children:[n.jsx("button",{className:"mx-2 border rounded px-1 py-1",type:"button",onClick:A,children:i?"Stop":"Run"}),n.jsx(Dn,{className:"mx-2 border rounded px-1 py-1",onLoad:R,children:"Upload ROM"}),n.jsxs("label",{className:"flex justify-center items-center",htmlFor:"soundEnableCheckbox",children:[n.jsx("input",{id:"soundEnableCheckbox",className:"mr-1",type:"checkbox",checked:r,onChange:x=>o(x.currentTarget.checked)}),"Enable sound"]})]}),l?.custom&&n.jsx("div",{className:"mt-2 flex justify-center text-xs",children:l.name}),n.jsx("div",{className:"mt-2 flex justify-center text-xs",children:n.jsx(Cn,{selectedName:l?.name,onCartridgeLoad:R})}),n.jsx("div",{className:"mt-2 flex text-center justify-center text-xs",children:n.jsxs("div",{children:[n.jsx("p",{children:"Select one of the available demos or upload your custom *.gb file and press Run"}),n.jsxs("p",{children:["The test ROMs are available in"," ",n.jsx(fe,{className:"underline",to:"/debug",children:"debug mode"}),". You can see the test results"," ",n.jsx(fe,{className:"underline",to:"/test-results",children:"here"}),"."]})]})})]})})}):n.jsx(qe,{})}export{zn as Play,zn as default};
