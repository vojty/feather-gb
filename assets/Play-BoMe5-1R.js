import{r as g,j as n,_ as Ue,n as We,d as _,l as q,u as ze,F as Ge,o as He,L as ae}from"./index-B9EhzYa3.js";import{_ as Ke}from"./__vite-plugin-wasm-helper-D7K_KhUE.js";import{r as Ze}from"./romsList-Ch2JJVv5.js";var Q={},K={},re={},y={},N={};Object.defineProperty(N,"__esModule",{value:!0});N.isBrowser=void 0;N.isBrowser=function(){return typeof window<"u"&&typeof window.document<"u"};Object.defineProperty(y,"__esModule",{value:!0});y.storage=y.MemoryStorageProxy=y.LocalStorageProxy=y.localStorageAvailable=void 0;var Ve=N;function we(){try{var e="@rehooks/local-storage:"+new Date().toISOString();return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(t){return Ve.isBrowser()&&t instanceof DOMException&&(t.code===22||t.code===1014||t.name==="QuotaExceededError"||t.name==="NS_ERROR_DOM_QUOTA_REACHED")&&localStorage&&localStorage.length!==0}}y.localStorageAvailable=we;var be=function(){function e(){}return e.prototype.getItem=function(t){return localStorage.getItem(t)},e.prototype.setItem=function(t,r){localStorage.setItem(t,r)},e.prototype.removeItem=function(t){localStorage.removeItem(t)},e}();y.LocalStorageProxy=be;var me=function(){function e(){this._memoryStorage=new Map}return e.prototype.getItem=function(t){var r;return(r=this._memoryStorage.get(t))!==null&&r!==void 0?r:null},e.prototype.setItem=function(t,r){this._memoryStorage.set(t,r)},e.prototype.removeItem=function(t){this._memoryStorage.delete(t)},e}();y.MemoryStorageProxy=me;var Ye=function(e){return e?new be:new me};y.storage=Ye(we());(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.deleteFromStorage=e.writeStorage=e.isTypeOfLocalStorageChanged=e.LOCAL_STORAGE_CHANGE_EVENT_NAME=void 0;var t=y,r=N;e.LOCAL_STORAGE_CHANGE_EVENT_NAME="onLocalStorageChange",function(){if(!r.isBrowser()||typeof window.CustomEvent=="function")return;function c(d,l){var w,h;l===void 0&&(l={bubbles:!1,cancelable:!1});var p=document.createEvent("CustomEvent");return p.initCustomEvent(d,(w=l?.bubbles)!==null&&w!==void 0?w:!1,(h=l?.cancelable)!==null&&h!==void 0?h:!1,l?.detail),p}window.CustomEvent=c}();function o(c){return!!c&&c.type===e.LOCAL_STORAGE_CHANGE_EVENT_NAME}e.isTypeOfLocalStorageChanged=o;function s(c,d){if(r.isBrowser())try{t.storage.setItem(c,typeof d=="object"?JSON.stringify(d):""+d),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:c,value:d}}))}catch(l){throw l instanceof TypeError&&l.message.includes("circular structure")?new TypeError(`The object that was given to the writeStorage function has circular references.
For more information, check here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value`):l}}e.writeStorage=s;function u(c){r.isBrowser()&&(t.storage.removeItem(c),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:c,value:null}})))}e.deleteFromStorage=u})(re);Object.defineProperty(K,"__esModule",{value:!0});K.useLocalStorage=void 0;var E=re,Je=N,V=y,B=g;function ce(e){try{return JSON.parse(e)}catch{return e}}function Xe(e,t){t===void 0&&(t=null);var r=B.useState(V.storage.getItem(e)===null?t:ce(V.storage.getItem(e))),o=r[0],s=r[1],u=B.useCallback(function(w){E.isTypeOfLocalStorageChanged(w)?w.detail.key===e&&s(w.detail.value):w.key===e&&s(w.newValue===null?null:ce(w.newValue))},[s,e]);B.useEffect(function(){if(Je.isBrowser()){var w=function(h){u(h)};return window.addEventListener(E.LOCAL_STORAGE_CHANGE_EVENT_NAME,w),window.addEventListener("storage",w),V.storage.getItem(e)===null&&t!==null&&E.writeStorage(e,t),function(){window.removeEventListener(E.LOCAL_STORAGE_CHANGE_EVENT_NAME,w),window.removeEventListener("storage",w)}}},[e,t,u]);var c=B.useCallback(function(w){return w instanceof Function?E.writeStorage(e,w(o)):E.writeStorage(e,w)},[e]),d=B.useCallback(function(){return E.deleteFromStorage(e)},[e]),l=o??t;return[l,c,d]}K.useLocalStorage=Xe;(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.useLocalStorage=void 0;var t=K;Object.defineProperty(e,"useLocalStorage",{enumerable:!0,get:function(){return t.useLocalStorage}});var r=re;Object.defineProperty(e,"writeStorage",{enumerable:!0,get:function(){return r.writeStorage}}),Object.defineProperty(e,"deleteFromStorage",{enumerable:!0,get:function(){return r.deleteFromStorage}}),e.default=t.useLocalStorage})(Q);const qe="/feather-gb/assets/gb_web_bg-CuAnmn9X.wasm";let b;function pe(e){b=e}function Qe(e){const t=b.__externref_table_alloc();return b.__wbindgen_export_2.set(t,e),t}function et(e,t){try{return e.apply(this,t)}catch(r){const o=Qe(r);b.__wbindgen_exn_store(o)}}const tt=typeof TextDecoder>"u"?(0,module.require)("util").TextDecoder:TextDecoder;let he=new tt("utf-8",{ignoreBOM:!0,fatal:!0});he.decode();let F=null;function k(){return(F===null||F.byteLength===0)&&(F=new Uint8Array(b.memory.buffer)),F}function xe(e,t){return e=e>>>0,he.decode(k().subarray(e,e+t))}let L=0;const nt=typeof TextEncoder>"u"?(0,module.require)("util").TextEncoder:TextEncoder;let W=new nt("utf-8");const rt=typeof W.encodeInto=="function"?function(e,t){return W.encodeInto(e,t)}:function(e,t){const r=W.encode(e);return t.set(r),{read:e.length,written:r.length}};function ye(e,t,r){if(r===void 0){const d=W.encode(e),l=t(d.length,1)>>>0;return k().subarray(l,l+d.length).set(d),L=d.length,l}let o=e.length,s=t(o,1)>>>0;const u=k();let c=0;for(;c<o;c++){const d=e.charCodeAt(c);if(d>127)break;u[s+c]=d}if(c!==o){c!==0&&(e=e.slice(c)),s=r(s,o,o=c+e.length*3,1)>>>0;const d=k().subarray(s+c,s+o),l=rt(e,d);c+=l.written,s=r(s,o,c,1)>>>0}return L=c,s}let C=null;function G(){return(C===null||C.buffer.detached===!0||C.buffer.detached===void 0&&C.buffer!==b.memory.buffer)&&(C=new DataView(b.memory.buffer)),C}function ee(e){const t=typeof e;if(t=="number"||t=="boolean"||e==null)return`${e}`;if(t=="string")return`"${e}"`;if(t=="symbol"){const s=e.description;return s==null?"Symbol":`Symbol(${s})`}if(t=="function"){const s=e.name;return typeof s=="string"&&s.length>0?`Function(${s})`:"Function"}if(Array.isArray(e)){const s=e.length;let u="[";s>0&&(u+=ee(e[0]));for(let c=1;c<s;c++)u+=", "+ee(e[c]);return u+="]",u}const r=/\[object ([^\]]+)\]/.exec(toString.call(e));let o;if(r&&r.length>1)o=r[1];else return toString.call(e);if(o=="Object")try{return"Object("+JSON.stringify(e)+")"}catch{return"Object"}return e instanceof Error?`${e.name}: ${e.message}
${e.stack}`:o}function ot(e,t){const r=t(e.length*1,1)>>>0;return k().set(e,r/1),L=e.length,r}function st(){return b.get_audio_buffer_size()>>>0}function it(e,t){if(!(e instanceof t))throw new Error(`expected instance of ${t.name}`)}function at(){b.init()}const f=Object.freeze({ArrowDown:0,0:"ArrowDown",ArrowLeft:1,1:"ArrowLeft",ArrowRight:2,2:"ArrowRight",ArrowUp:3,3:"ArrowUp",A:4,4:"A",B:5,5:"B",Start:6,6:"Start",Select:7,7:"Select"}),le=typeof FinalizationRegistry>"u"?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(e=>b.__wbg_webcartridge_free(e>>>0,1));class Se{__destroy_into_raw(){const t=this.__wbg_ptr;return this.__wbg_ptr=0,le.unregister(this),t}free(){const t=this.__destroy_into_raw();b.__wbg_webcartridge_free(t,0)}constructor(t){const r=ot(t,b.__wbindgen_malloc),o=L,s=b.webcartridge_new(r,o);return this.__wbg_ptr=s>>>0,le.register(this,this.__wbg_ptr,this),this}}const ue=typeof FinalizationRegistry>"u"?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(e=>b.__wbg_webemulator_free(e>>>0,1));class ct{__destroy_into_raw(){const t=this.__wbg_ptr;return this.__wbg_ptr=0,ue.unregister(this),t}free(){const t=this.__destroy_into_raw();b.__wbg_webemulator_free(t,0)}constructor(t,r){it(t,Se);var o=t.__destroy_into_raw();const s=b.webemulator_new(o,r);return this.__wbg_ptr=s>>>0,ue.register(this,this.__wbg_ptr,this),this}run_frame(){b.webemulator_run_frame(this.__wbg_ptr)}get_canvas_data_pointer(){return b.webemulator_get_canvas_data_pointer(this.__wbg_ptr)>>>0}on_key_down(t){b.webemulator_on_key_down(this.__wbg_ptr,t)}on_key_up(t){b.webemulator_on_key_up(this.__wbg_ptr,t)}set_audio_buffer_callback(t){b.webemulator_set_audio_buffer_callback(this.__wbg_ptr,t)}}function Ae(){return et(function(e,t,r){return e.call(t,r)},arguments)}function je(e,t){let r,o;try{r=e,o=t,console.error(xe(e,t))}finally{b.__wbindgen_free(r,o,1)}}function ve(){return new Error}function Ee(e,t){const r=t.stack,o=ye(r,b.__wbindgen_malloc,b.__wbindgen_realloc),s=L;G().setInt32(e+4*1,s,!0),G().setInt32(e+4*0,o,!0)}function $e(e,t){const r=ee(t),o=ye(r,b.__wbindgen_malloc,b.__wbindgen_realloc),s=L;G().setInt32(e+4*1,s,!0),G().setInt32(e+4*0,o,!0)}function Te(){const e=b.__wbindgen_export_2,t=e.grow(4);e.set(0,void 0),e.set(t+0,void 0),e.set(t+1,null),e.set(t+2,!0),e.set(t+3,!1)}function Ce(e){return e}function Le(e,t){throw new Error(xe(e,t))}URL=globalThis.URL;const m=await Ke({"./gb_web_bg.js":{__wbg_new_8a6f238a6ece86ea:ve,__wbg_stack_0ed75d68575b0f3c:Ee,__wbg_error_7534b8e9a36f1ab4:je,__wbindgen_number_new:Ce,__wbg_call_7cccdd69e0791ae2:Ae,__wbindgen_throw:Le,__wbindgen_debug_string:$e,__wbindgen_init_externref_table:Te}},qe),oe=m.memory,lt=m.__wbg_webcartridge_free,ut=m.webcartridge_new,dt=m.get_audio_buffer_size,_t=m.__wbg_webemulator_free,ft=m.webemulator_new,gt=m.webemulator_run_frame,wt=m.webemulator_get_canvas_data_pointer,bt=m.webemulator_on_key_down,mt=m.webemulator_on_key_up,pt=m.webemulator_set_audio_buffer_callback,ht=m.init,xt=m.__wbindgen_exn_store,yt=m.__externref_table_alloc,St=m.__wbindgen_export_2,At=m.__wbindgen_free,jt=m.__wbindgen_malloc,vt=m.__wbindgen_realloc,Ne=m.__wbindgen_start,Et=Object.freeze(Object.defineProperty({__proto__:null,__externref_table_alloc:yt,__wbg_webcartridge_free:lt,__wbg_webemulator_free:_t,__wbindgen_exn_store:xt,__wbindgen_export_2:St,__wbindgen_free:At,__wbindgen_malloc:jt,__wbindgen_realloc:vt,__wbindgen_start:Ne,get_audio_buffer_size:dt,init:ht,memory:oe,webcartridge_new:ut,webemulator_get_canvas_data_pointer:wt,webemulator_new:ft,webemulator_on_key_down:bt,webemulator_on_key_up:mt,webemulator_run_frame:gt,webemulator_set_audio_buffer_callback:pt},Symbol.toStringTag,{value:"Module"})),se=g.createContext({input:[],onKeyDown:()=>{},onKeyUp:()=>{}});function $t({children:e}){const[t,r]=g.useState([]),o=g.useCallback(u=>{r(c=>c.filter(d=>u!==d))},[]),s=g.useCallback(u=>{r(c=>c.includes(u)?c:[...c,u])},[]);return n.jsx(se.Provider,{value:{input:t,onKeyUp:o,onKeyDown:s},children:e})}pe(Et);Ne();const Tt=Object.freeze(Object.defineProperty({__proto__:null,JsKeys:f,WebCartridge:Se,WebEmulator:ct,__wbg_call_7cccdd69e0791ae2:Ae,__wbg_error_7534b8e9a36f1ab4:je,__wbg_new_8a6f238a6ece86ea:ve,__wbg_set_wasm:pe,__wbg_stack_0ed75d68575b0f3c:Ee,__wbindgen_debug_string:$e,__wbindgen_init_externref_table:Te,__wbindgen_number_new:Ce,__wbindgen_throw:Le,get_audio_buffer_size:st,init:at},Symbol.toStringTag,{value:"Module"})),Y={ArrowDown:f.ArrowDown,ArrowUp:f.ArrowUp,ArrowLeft:f.ArrowLeft,ArrowRight:f.ArrowRight,KeyD:f.ArrowRight,KeyA:f.ArrowLeft,KeyW:f.ArrowUp,KeyS:f.ArrowDown,KeyJ:f.A,KeyX:f.A,KeyK:f.B,KeyC:f.B,KeyB:f.Start,KeyN:f.Select};function Ct(){const{onKeyDown:e,onKeyUp:t,input:r}=g.useContext(se),o=g.useRef();return g.useEffect(()=>{Object.values(Y).forEach(u=>{r.includes(u)?o.current?.on_key_down(u):o.current?.on_key_up(u)})},[r]),g.useEffect(()=>{const u=d=>{const l=Y[d.code];l!==void 0&&e(l)},c=d=>{const l=Y[d.code];l!==void 0&&t(l)};return window.addEventListener("keydown",u),window.addEventListener("keyup",c),()=>{window.removeEventListener("keydown",u),window.removeEventListener("keyup",c)}},[e,t]),g.useCallback(u=>{o.current=u},[])}function Lt(){const[e,t]=g.useState(null);return g.useEffect(()=>{Ue(()=>Promise.resolve().then(()=>Tt),void 0).then(r=>{r.init(),t(r)}).catch(console.error)},[]),e}let de=!1;function Nt(e){if(de)return;de=!0;const t=e.createBuffer(1,1,e.sampleRate),r=e.createBufferSource();r.buffer=t,r.connect(e.destination),r.start(0),e.resume()}function _e(e,t,r=1){if(r>0&&e>=t||r<0&&e<=t)return[];const o=[];for(let s=e;r>0?s<t:s>t;s+=r)o.push(s);return o}function Ot(e){return fetch(e).then(t=>t.arrayBuffer()).then(t=>new Uint8Array(t))}function Bt(){return g.useContext(se)}function Rt(){return We()}const Oe=45,Be=23,Re=6,J=9,Dt=20,It=13,z=36,De=25,H=26,kt="#393C81",Pt="#8A205E";function i(e){return t=>`${t.theme.zoom*e}px`}function ie(){return q`
    filter: brightness(80%);
  `}const Mt=_.div`
  display: flex;
  justify-content: center;
`,Ft=_.div`
  display: inline-block;
  margin: 10px;
  background: #eee;
  border-radius: 10px 10px 60px 10px;
  box-shadow: 5px 5px rgba(0, 0, 0, 0.1);
  padding: ${i(20)};
  color: ${kt};
  position: relative;
`,Ut=_.div`
  background-color: #777;
  border-radius: ${i(7)} ${i(7)} ${i(40)} ${i(7)};
  box-shadow: inset 0px 0px 20px 0px rgba(0, 0, 0, 0.66);
`,Wt=_.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${i(Be)};
  font-size: ${i(Re)};
  font-family: Arial;
  color: #b3b3b3;
  padding: 0 ${i(8)} 0;
`,zt=_.div`
  flex: 0 0 auto;
  margin: 0 ${i(5)};
`,Gt=_.div`
  display: flex;
  margin-right: ${i(Oe)};
  padding-bottom: ${i(Be)};
`,Ht=_.div`
  flex: 1 1 ${e=>e.width};
  height: ${i(3)};
  background-color: #8b1d90;
  box-shadow: 0 ${i(2*3)} 0 #283593;
  margin-top: -${i(2*3)};
`,Kt=_.div`
  margin-left: auto;
  margin-right: auto;
  position: relative;
`,Zt=_.div`
  position: absolute;
  box-shadow: inset 5px 5px 5px 0px rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`,Vt=_.div`
  background-color: ${e=>e.$enabled?"#f00":"#000"};
  box-shadow: 0 0 3px 1px #ef5350;
  height: ${i(J)};
  width: ${i(J)};
  border-radius: ${e=>e.theme.zoom*J/2}px;
  margin: 10px 20px 10px 10px;
  box-shadow: inset 0px 0px 5px 0px rgba(0, 0, 0, 0.66);
`,Yt=_.div`
  font-family: Arial;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #b3b3b3;
  width: ${i(Oe)};
  font-size: ${i(Re)};
  margin-bottom: 80px;
`,Jt=_.div`
  letter-spacing: 1px;
  font-size: ${i(It)};
`,Xt=_.div`
  margin-left: ${i(2)};
  font-size: ${i(Dt)};
`,qt=_.div`
  font-size: ${i(6)};
`,Qt=_.div`
  background-color: ${Pt};
  height: ${i(z)};
  width: ${i(z)};
  border-radius: ${i(z/2)};

  ${e=>e.$pressed&&ie()}
`,en=_.div`
  position: relative;
`,tn=_.div`
  font-size: ${i(12)};
  letter-spacing: ${i(1)};
`,Ie=_(tn)`
  margin-top: ${e=>i(e.$spacing)};
`,nn=_.div`
  display: inline-flex;
  margin-top: ${i(10)};
  margin-right: -${i(12)};
  transform: rotate(-${De}deg);
  padding: ${i(5)};

  background-color: #dfdfdf;
  box-shadow: 0 0 0 5px #dfdfdf;
  border-radius: ${i(z)};

  > * + * {
    margin-left: ${i(18)};
  }

  ${Ie} {
    bottom: -${i(25)};
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
  }
`,te=_.div`
  transform: rotate(-${De}deg);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`,rn=_.div`
  border-radius: ${i((9+2*5)/2)};
  background-color: #dfdfdf;
  padding: ${i(5)};
`,on=_.div`
  background-color: #868a8d;
  width: ${i(38)};
  height: ${i(9)};
  border-radius: ${i(9/2)};
  ${e=>e.$pressed&&ie()}
`,sn=_.div`
  display: flex;
  margin-left: ${i(80)};
  margin-top: ${i(30)};
  margin-bottom: ${i(40)};
  ${te} + ${te} {
    margin-left: ${i(7)};
  }
`,an=_.div``;var I=(e=>(e[e.HORIZONTAL=0]="HORIZONTAL",e[e.VERTICAL=1]="VERTICAL",e))(I||{});const cn=_.div`
  display: flex;
  justify-content: center;
`,ke=_.div`
  width: ${i(2)};
  height: 80%;
  background-color: #353535;
  margin: ${i(2)};
  border-radius: ${i(5)};
`,Pe=_.div`
  position: relative;
  height: ${i(H)};
  width: ${i(H)};
  background-color: #1b1d1d;
`,Z=_(Pe)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${e=>e.$orientation===1?"row":"column"};

  ${ke} {
    ${e=>e.$pressed&&ie()}

    ${e=>e.$orientation===1?q`
            width: ${i(3)};
            height: 60%;
          `:q`
            height: ${i(3)};
            width: 60%;
          `};
  }
`,ln=_(Z)`
  border-radius: ${i(5)} 0 0 ${i(5)};
`,un=_(Z)`
  border-radius: ${i(5)} ${i(5)} 0 0;
`,dn=_(Z)`
  border-radius: 0 ${i(5)} ${i(5)} 0;
`,_n=_(Z)`
  border-radius: 0 0 ${i(5)} ${i(5)};
`,fn=_(Pe)`
  &:before {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: ${i(H-7)};
    width: ${i(H-7)};
    background-color: #353535;
    border-radius: 100%;
  }
`,gn=_.div`
  display: flex;
  margin-top: ${i(35)};
`,ne=_.div`
  height: ${i(48)};
  width: ${i(5)};
  background-color: #a7a49f;
  border-radius: ${i(5)};
  box-shadow: inset 0px 0px 5px 0px rgb(95 95 95 / 66%);
`,wn=_.div`
  display: inline-flex;
  transform: rotate(-28deg);
  position: absolute;
  bottom: ${i(19)};
  right: ${i(15)};

  ${ne} + ${ne} {
    margin-left: ${i(8)};
  }
`,a={Wrapper:Mt,Device:Ft,Display:Ut,DisplayTop:Wt,DisplayHeaderText:zt,DisplayContent:Gt,DisplayLine:Ht,Screen:Kt,ScreenOverlay:Zt,Battery:Yt,BatteryIndicator:Vt,NintendoText:Jt,GameBoyText:Xt,TradeMarkText:qt,Controls:gn,ButtonsAB:nn,CircleButtonWrapper:en,CircleButton:Qt,ButtonText:Ie,ButtonsStartSelect:sn,WideButton:on,WideButtonWrapper:rn,WideButtonContainer:te,Arrows:an,ArrowsLine:cn,ArrowUp:un,ArrowDown:_n,ArrowLeft:ln,ArrowRight:dn,ArrowCenter:fn,ArrowStripe:ke,Speakers:wn,Speaker:ne};function bn(e){return n.jsxs(a.Display,{children:[n.jsxs(a.DisplayTop,{children:[n.jsx(a.DisplayLine,{width:"25%"}),n.jsx(a.DisplayHeaderText,{children:"DOT MATRIX WITH STEREO SOUND"}),n.jsx(a.DisplayLine,{width:"12%"})]}),n.jsxs(a.DisplayContent,{children:[n.jsxs(a.Battery,{children:[n.jsx(a.BatteryIndicator,{$enabled:e.enabled}),"BATTERY"]}),n.jsxs(a.Screen,{children:[e.children,n.jsx(a.ScreenOverlay,{})]})]})]})}const $=160,P=144;function mn({running:e},t){const{zoom:r}=Rt(),{input:o,onKeyDown:s,onKeyUp:u}=Bt(),c=o.includes(f.A),d=o.includes(f.B),l=o.includes(f.Start),w=o.includes(f.Select),h=o.includes(f.ArrowLeft),p=o.includes(f.ArrowRight),S=o.includes(f.ArrowUp),T=o.includes(f.ArrowDown);return n.jsx(a.Wrapper,{children:n.jsxs(a.Device,{children:[n.jsx(bn,{enabled:e,children:n.jsx("canvas",{ref:t,style:{display:"block",imageRendering:"pixelated",zoom:r},height:P,width:$})}),n.jsxs("div",{className:"flex items-baseline",children:[n.jsx(a.NintendoText,{className:"font-pretendo",children:"Nintendo"}),n.jsx(a.GameBoyText,{className:"font-gills-sans font-medium italic",children:"GAME BOY"}),n.jsx(a.TradeMarkText,{className:"font-bold",children:"TM"})]}),n.jsxs(a.Controls,{children:[n.jsxs(a.Arrows,{children:[n.jsx(a.ArrowsLine,{children:n.jsxs(a.ArrowUp,{onPointerDown:()=>s(f.ArrowUp),onPointerUp:()=>u(f.ArrowUp),$orientation:I.HORIZONTAL,$pressed:S,children:[n.jsx(a.ArrowStripe,{}),n.jsx(a.ArrowStripe,{}),n.jsx(a.ArrowStripe,{})]})}),n.jsxs(a.ArrowsLine,{children:[n.jsxs(a.ArrowLeft,{onPointerDown:()=>s(f.ArrowLeft),onPointerUp:()=>u(f.ArrowLeft),$orientation:I.VERTICAL,$pressed:h,children:[n.jsx(a.ArrowStripe,{}),n.jsx(a.ArrowStripe,{}),n.jsx(a.ArrowStripe,{})]}),n.jsx(a.ArrowCenter,{}),n.jsxs(a.ArrowRight,{onPointerDown:()=>s(f.ArrowRight),onPointerUp:()=>u(f.ArrowRight),$orientation:I.VERTICAL,$pressed:p,children:[n.jsx(a.ArrowStripe,{}),n.jsx(a.ArrowStripe,{}),n.jsx(a.ArrowStripe,{})]})]}),n.jsx(a.ArrowsLine,{children:n.jsxs(a.ArrowDown,{onPointerDown:()=>s(f.ArrowDown),onPointerUp:()=>u(f.ArrowDown),$orientation:I.HORIZONTAL,$pressed:T,children:[n.jsx(a.ArrowStripe,{}),n.jsx(a.ArrowStripe,{}),n.jsx(a.ArrowStripe,{})]})})]}),n.jsx("div",{className:"ml-auto",children:n.jsxs(a.ButtonsAB,{className:" font-nes",children:[n.jsxs(a.CircleButtonWrapper,{children:[n.jsx(a.CircleButton,{onPointerDown:()=>s(f.B),onPointerUp:()=>u(f.B),$pressed:d}),n.jsx(a.ButtonText,{$spacing:10,children:"B"})]}),n.jsxs(a.CircleButtonWrapper,{children:[n.jsx(a.CircleButton,{onPointerDown:()=>s(f.A),onPointerUp:()=>u(f.A),$pressed:c}),n.jsx(a.ButtonText,{$spacing:10,children:"A"})]})]})})]}),n.jsxs(a.ButtonsStartSelect,{className:"font-nes",children:[n.jsxs(a.WideButtonContainer,{children:[n.jsx(a.WideButtonWrapper,{children:n.jsx(a.WideButton,{onPointerDown:()=>s(f.Select),onPointerUp:()=>u(f.Select),$pressed:w})}),n.jsx(a.ButtonText,{$spacing:1,children:"SELECT"})]}),n.jsxs(a.WideButtonContainer,{children:[n.jsx(a.WideButtonWrapper,{children:n.jsx(a.WideButton,{onPointerDown:()=>s(f.Start),onPointerUp:()=>u(f.Start),$pressed:l})}),n.jsx(a.ButtonText,{$spacing:1,children:"START"})]})]}),n.jsxs(a.Speakers,{children:[n.jsx(a.Speaker,{}),n.jsx(a.Speaker,{}),n.jsx(a.Speaker,{}),n.jsx(a.Speaker,{}),n.jsx(a.Speaker,{}),n.jsx(a.Speaker,{})]})]})})}const pn=g.forwardRef(mn),hn="12px",U={Icon:_.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  `,Wrapper:_.div`
    font-size: ${hn};
    display: flex;
    align-items: center;
    justify-content: center;
  `,Value:_.div`
    margin: 0 5px;
  `};function xn(e){const{zoom:t,onChange:r}=e;return n.jsxs(U.Wrapper,{children:[n.jsx(U.Icon,{children:n.jsx("button",{type:"button",onClick:()=>r(Math.max(1,t-.5)),children:"-"})}),n.jsxs(U.Value,{children:["Zoom: ",t.toFixed(1)]}),n.jsx(U.Icon,{children:n.jsx("button",{type:"button",onClick:()=>r(Math.min(t+.5,5)),children:"+"})})]})}const yn=_.div`
  cursor: pointer;
`;function Sn(){const e=ze();return n.jsx(yn,{onClick:()=>e(-1),children:"←"})}const Me=Ze.filter(e=>["demos/cgb-acid2.gbc","demos/dmg-acid2.gb","demos/gejmboj.gb","demos/oh.gb","demos/opus5.gb","demos/pocket.gb"].includes(e.name)),An=Me.find(e=>e.name==="demos/oh.gb")||null;function jn({onCartridgeLoad:e,selectedName:t}){const r=g.useCallback(o=>{o&&Ot(o.url).then(s=>e({name:o.name,bytes:s}))},[e]);return g.useEffect(()=>{r(An)},[r]),n.jsx("table",{children:n.jsx("tbody",{children:Me.map(o=>n.jsxs("tr",{className:t===o.name?"font-medium underline":"",children:[n.jsx("td",{className:"px-1",children:o.name}),n.jsx("td",{className:"px-1",children:n.jsx("button",{type:"button",onClick:()=>r(o),children:"Load"})})]},o.url))})})}const vn=12,X=20,fe=30,En=64,$n=_.span`
  font-size: ${vn}px;
`,Tn=_.canvas`
  display: inline-block;
`,R=[];function Cn(){const e=g.useRef(window.performance.now()),t=g.useRef(null),r=g.useRef(0);return g.useEffect(()=>{function o(){r.current=window.requestAnimationFrame(()=>{const s=window.performance.now(),u=s-e.current;e.current=s;const c=Math.round(1e3/u);R.push(c),R.length>En&&R.shift();const d=Math.round(R.reduce((w,h)=>w+h)/R.length),l=t.current?.getContext("2d");l&&(l.clearRect(0,0,fe,X),l.textBaseline="middle",l.font="12px Arial",l.fillText(d.toString(),1,X/2+1)),o()})}return o(),()=>window.cancelAnimationFrame(r.current)},[]),n.jsxs($n,{className:"flex items-center justify-end",children:["Average FPS:"," ",n.jsx(Tn,{width:fe,height:X,ref:t})]})}function Ln(e){const{onLoad:t,className:r,children:o}=e,s=u=>{const{files:c}=u.currentTarget;if(!c)return;const d=c[0];d.arrayBuffer().then(l=>new Uint8Array(l)).then(l=>t({name:`Custom: ${d.name}`,bytes:l,custom:!0}))};return n.jsxs(n.Fragment,{children:[n.jsx("input",{onChange:s,accept:".gb,.gbc",style:{display:"none"},id:"file",multiple:!0,type:"file"}),n.jsx("label",{className:r,htmlFor:"file",children:o})]})}const Nn=1.5,On="#6D7C00",A=new AudioContext({sampleRate:44100});function Bn(e,t){const r=e.get_canvas_data_pointer(),o=t.createImageData($,P),s=new Uint8Array(oe.buffer,r,$*P*3);_e(0,P).forEach(u=>{_e(0,$).forEach(c=>{const d=(u*$+c)*3,l=(u*$+c)*4;o.data[l]=s[d],o.data[l+1]=s[d+1],o.data[l+2]=s[d+2],o.data[l+3]=255})}),t.putImageData(o,0,0)}function ge(e){e.fillStyle=On,e.fillRect(0,0,$,P)}const D=2;function Rn(e){const{bytes:t,wasmModule:r,running:o,ctx:s,soundEnabled:u}=e,c=g.useRef(),d=g.useRef(0),l=g.useRef(0),w=Ct();g.useEffect(()=>{ge(s)},[s]);const h=g.useCallback(p=>{const S=r.get_audio_buffer_size(),T=new Float32Array(oe.buffer,p,S),O=T.length/D,x=A.createBuffer(D,O,A.sampleRate);for(let v=0;v<D;v+=1){const Fe=x.getChannelData(v);for(let M=0;M<O;M+=1)Fe[M]=T[M*D+v]}const j=A.createBufferSource();j.buffer=x,j.connect(A.destination),d.current<=A.currentTime+.02&&(d.current=A.currentTime+.06),j.start(d.current),d.current+=S/D/A.sampleRate},[r.get_audio_buffer_size]);return g.useEffect(()=>{if(!t)return;const p=new r.WebCartridge(t);d.current=0,c.current=new r.WebEmulator(p,()=>{}),ge(s),w(c.current)},[s,t,r,w]),g.useEffect(()=>{const p=c.current;p&&p.set_audio_buffer_callback(u?h:()=>{})},[u,h]),g.useEffect(()=>{const p=c.current;if(p)if(o){const S=()=>{p.run_frame(),Bn(p,s),l.current=window.requestAnimationFrame(S)};S()}else window.cancelAnimationFrame(l.current)},[o,s]),null}function Pn(){const[e,t]=Q.useLocalStorage("zoom",Nn),[r,o]=Q.useLocalStorage("sound_enabled",!1),[s,u]=g.useState(!1),[c,d]=g.useState(),[l,w]=g.useState(null),h={zoom:e},p=Lt(),S=()=>{Nt(A),u(x=>x?!1:!!(!x&&l))},T=g.useCallback(x=>{x&&d(j=>{if(j)return j;const v=x.getContext("2d");return v||j})},[]),O=g.useCallback(x=>{u(!1),w(x)},[]);return p?n.jsx("div",{className:"select-none",children:n.jsx($t,{children:n.jsxs(He,{theme:h,children:[n.jsxs("div",{className:"grid grid-cols-3 justify-between items-center mx-2 pt-2",children:[n.jsx(Sn,{}),n.jsx(xn,{zoom:e,onChange:t}),n.jsx("div",{className:"justify-end",children:n.jsx(Cn,{})})]}),n.jsx(pn,{running:s,ref:T}),c&&n.jsx(Rn,{bytes:l?.bytes,wasmModule:p,running:s,soundEnabled:r,ctx:c}),n.jsxs("div",{className:"mt-2 flex justify-center items-center text-xs",children:[n.jsx("button",{className:"mx-2 border rounded px-1 py-1",type:"button",onClick:S,children:s?"Stop":"Run"}),n.jsx(Ln,{className:"mx-2 border rounded px-1 py-1",onLoad:O,children:"Upload ROM"}),n.jsxs("label",{className:"flex justify-center items-center",htmlFor:"soundEnableCheckbox",children:[n.jsx("input",{id:"soundEnableCheckbox",className:"mr-1",type:"checkbox",checked:r,onChange:x=>o(x.currentTarget.checked)}),"Enable sound"]})]}),l?.custom&&n.jsx("div",{className:"mt-2 flex justify-center text-xs",children:l.name}),n.jsx("div",{className:"mt-2 flex justify-center text-xs",children:n.jsx(jn,{selectedName:l?.name,onCartridgeLoad:O})}),n.jsx("div",{className:"mt-2 flex text-center justify-center text-xs",children:n.jsxs("div",{children:[n.jsx("p",{children:"Select one of the available demos or upload your custom *.gb file and press Run"}),n.jsxs("p",{children:["The test ROMs are available in"," ",n.jsx(ae,{className:"underline",to:"/debug",children:"debug mode"}),". You can see the test results"," ",n.jsx(ae,{className:"underline",to:"/test-results",children:"here"}),"."]})]})})]})})}):n.jsx(Ge,{})}export{Pn as Play,Pn as default};
