import{a as We,r as g,j as n,_ as ze,s as Ge,g as f,f as Y,u as He,F as Ke,b as Ze,L as oe}from"./index-DZObs9_S.js";import{_ as Ve}from"./__vite-plugin-wasm-helper-D7K_KhUE.js";import{r as qe}from"./romsList-Ch2JJVv5.js";var H={},L={},K={},y={},R={},ie;function ee(){return ie||(ie=1,Object.defineProperty(R,"__esModule",{value:!0}),R.isBrowser=void 0,R.isBrowser=function(){return typeof window<"u"&&typeof window.document<"u"}),R}var se;function me(){if(se)return y;se=1,Object.defineProperty(y,"__esModule",{value:!0}),y.storage=y.MemoryStorageProxy=y.LocalStorageProxy=y.localStorageAvailable=void 0;var e=ee();function t(){try{var c="@rehooks/local-storage:"+new Date().toISOString();return localStorage.setItem(c,c),localStorage.removeItem(c),!0}catch(r){return e.isBrowser()&&r instanceof DOMException&&(r.code===22||r.code===1014||r.name==="QuotaExceededError"||r.name==="NS_ERROR_DOM_QUOTA_REACHED")&&localStorage&&localStorage.length!==0}}y.localStorageAvailable=t;var o=(function(){function c(){}return c.prototype.getItem=function(r){return localStorage.getItem(r)},c.prototype.setItem=function(r,u){localStorage.setItem(r,u)},c.prototype.removeItem=function(r){localStorage.removeItem(r)},c})();y.LocalStorageProxy=o;var i=(function(){function c(){this._memoryStorage=new Map}return c.prototype.getItem=function(r){var u;return(u=this._memoryStorage.get(r))!==null&&u!==void 0?u:null},c.prototype.setItem=function(r,u){this._memoryStorage.set(r,u)},c.prototype.removeItem=function(r){this._memoryStorage.delete(r)},c})();y.MemoryStorageProxy=i;var s=function(c){return c?new o:new i};return y.storage=s(t()),y}var ae;function pe(){return ae||(ae=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.deleteFromStorage=e.writeStorage=e.isTypeOfLocalStorageChanged=e.LOCAL_STORAGE_CHANGE_EVENT_NAME=void 0;var t=me(),o=ee();e.LOCAL_STORAGE_CHANGE_EVENT_NAME="onLocalStorageChange",(function(){if(!o.isBrowser()||typeof window.CustomEvent=="function")return;function r(u,d){var p,h;d===void 0&&(d={bubbles:!1,cancelable:!1});var m=document.createEvent("CustomEvent");return m.initCustomEvent(u,(p=d?.bubbles)!==null&&p!==void 0?p:!1,(h=d?.cancelable)!==null&&h!==void 0?h:!1,d?.detail),m}window.CustomEvent=r})();function i(r){return!!r&&r.type===e.LOCAL_STORAGE_CHANGE_EVENT_NAME}e.isTypeOfLocalStorageChanged=i;function s(r,u){if(o.isBrowser())try{t.storage.setItem(r,typeof u=="object"?JSON.stringify(u):""+u),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:r,value:u}}))}catch(d){throw d instanceof TypeError&&d.message.includes("circular structure")?new TypeError(`The object that was given to the writeStorage function has circular references.
For more information, check here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value`):d}}e.writeStorage=s;function c(r){o.isBrowser()&&(t.storage.removeItem(r),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:r,value:null}})))}e.deleteFromStorage=c})(K)),K}var ce;function Ye(){if(ce)return L;ce=1,Object.defineProperty(L,"__esModule",{value:!0}),L.useLocalStorage=void 0;var e=pe(),t=ee(),o=me(),i=We();function s(r){try{return JSON.parse(r)}catch{return r}}function c(r,u){u===void 0&&(u=null);var d=i.useState(o.storage.getItem(r)===null?u:s(o.storage.getItem(r))),p=d[0],h=d[1],m=i.useCallback(function(w){e.isTypeOfLocalStorageChanged(w)?w.detail.key===r&&h(w.detail.value):w.key===r&&h(w.newValue===null?null:s(w.newValue))},[h,r]);i.useEffect(function(){if(t.isBrowser()){var w=function(S){m(S)};return window.addEventListener(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,w),window.addEventListener("storage",w),o.storage.getItem(r)===null&&u!==null&&e.writeStorage(r,u),function(){window.removeEventListener(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,w),window.removeEventListener("storage",w)}}},[r,u,m]);var x=i.useCallback(function(w){return w instanceof Function?e.writeStorage(r,w(p)):e.writeStorage(r,w)},[r]),A=i.useCallback(function(){return e.deleteFromStorage(r)},[r]),j=p??u;return[j,x,A]}return L.useLocalStorage=c,L}var le;function Je(){return le||(le=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.useLocalStorage=void 0;var t=Ye();Object.defineProperty(e,"useLocalStorage",{enumerable:!0,get:function(){return t.useLocalStorage}});var o=pe();Object.defineProperty(e,"writeStorage",{enumerable:!0,get:function(){return o.writeStorage}}),Object.defineProperty(e,"deleteFromStorage",{enumerable:!0,get:function(){return o.deleteFromStorage}}),e.default=t.useLocalStorage})(H)),H}var ue=Je();const Xe="/feather-gb/assets/gb_web_bg-dQ4P8gYF.wasm";let b;function he(e){b=e}function Qe(e){const t=b.__externref_table_alloc();return b.__wbindgen_export_2.set(t,e),t}function et(e,t){try{return e.apply(this,t)}catch(o){const i=Qe(o);b.__wbindgen_exn_store(i)}}const tt=typeof TextDecoder>"u"?(0,module.require)("util").TextDecoder:TextDecoder;let xe=new tt("utf-8",{ignoreBOM:!0,fatal:!0});xe.decode();let P=null;function D(){return(P===null||P.byteLength===0)&&(P=new Uint8Array(b.memory.buffer)),P}function ye(e,t){return e=e>>>0,xe.decode(D().subarray(e,e+t))}let C=0;const nt=typeof TextEncoder>"u"?(0,module.require)("util").TextEncoder:TextEncoder;let U=new nt("utf-8");const rt=typeof U.encodeInto=="function"?function(e,t){return U.encodeInto(e,t)}:function(e,t){const o=U.encode(e);return t.set(o),{read:e.length,written:o.length}};function Se(e,t,o){if(o===void 0){const u=U.encode(e),d=t(u.length,1)>>>0;return D().subarray(d,d+u.length).set(u),C=u.length,d}let i=e.length,s=t(i,1)>>>0;const c=D();let r=0;for(;r<i;r++){const u=e.charCodeAt(r);if(u>127)break;c[s+r]=u}if(r!==i){r!==0&&(e=e.slice(r)),s=o(s,i,i=r+e.length*3,1)>>>0;const u=D().subarray(s+r,s+i),d=rt(e,u);r+=d.written,s=o(s,i,r,1)>>>0}return C=r,s}let T=null;function W(){return(T===null||T.buffer.detached===!0||T.buffer.detached===void 0&&T.buffer!==b.memory.buffer)&&(T=new DataView(b.memory.buffer)),T}function J(e){const t=typeof e;if(t=="number"||t=="boolean"||e==null)return`${e}`;if(t=="string")return`"${e}"`;if(t=="symbol"){const s=e.description;return s==null?"Symbol":`Symbol(${s})`}if(t=="function"){const s=e.name;return typeof s=="string"&&s.length>0?`Function(${s})`:"Function"}if(Array.isArray(e)){const s=e.length;let c="[";s>0&&(c+=J(e[0]));for(let r=1;r<s;r++)c+=", "+J(e[r]);return c+="]",c}const o=/\[object ([^\]]+)\]/.exec(toString.call(e));let i;if(o&&o.length>1)i=o[1];else return toString.call(e);if(i=="Object")try{return"Object("+JSON.stringify(e)+")"}catch{return"Object"}return e instanceof Error?`${e.name}: ${e.message}
${e.stack}`:i}function ot(e,t){if(!(e instanceof t))throw new Error(`expected instance of ${t.name}`)}function it(e,t){const o=t(e.length*1,1)>>>0;return D().set(e,o/1),C=e.length,o}function st(){b.init()}function at(){return b.get_audio_buffer_size()>>>0}const _=Object.freeze({ArrowDown:0,0:"ArrowDown",ArrowLeft:1,1:"ArrowLeft",ArrowRight:2,2:"ArrowRight",ArrowUp:3,3:"ArrowUp",A:4,4:"A",B:5,5:"B",Start:6,6:"Start",Select:7,7:"Select"}),de=typeof FinalizationRegistry>"u"?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(e=>b.__wbg_webcartridge_free(e>>>0,1));class Ae{__destroy_into_raw(){const t=this.__wbg_ptr;return this.__wbg_ptr=0,de.unregister(this),t}free(){const t=this.__destroy_into_raw();b.__wbg_webcartridge_free(t,0)}constructor(t){const o=it(t,b.__wbindgen_malloc),i=C,s=b.webcartridge_new(o,i);return this.__wbg_ptr=s>>>0,de.register(this,this.__wbg_ptr,this),this}}const fe=typeof FinalizationRegistry>"u"?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(e=>b.__wbg_webemulator_free(e>>>0,1));class ct{__destroy_into_raw(){const t=this.__wbg_ptr;return this.__wbg_ptr=0,fe.unregister(this),t}free(){const t=this.__destroy_into_raw();b.__wbg_webemulator_free(t,0)}on_key_down(t){b.webemulator_on_key_down(this.__wbg_ptr,t)}get_canvas_data_pointer(){return b.webemulator_get_canvas_data_pointer(this.__wbg_ptr)>>>0}set_audio_buffer_callback(t){b.webemulator_set_audio_buffer_callback(this.__wbg_ptr,t)}constructor(t,o){ot(t,Ae);var i=t.__destroy_into_raw();const s=b.webemulator_new(i,o);return this.__wbg_ptr=s>>>0,fe.register(this,this.__wbg_ptr,this),this}on_key_up(t){b.webemulator_on_key_up(this.__wbg_ptr,t)}run_frame(){b.webemulator_run_frame(this.__wbg_ptr)}}function ve(){return et(function(e,t,o){return e.call(t,o)},arguments)}function je(e,t){let o,i;try{o=e,i=t,console.error(ye(e,t))}finally{b.__wbindgen_free(o,i,1)}}function Ee(){return new Error}function $e(e,t){const o=t.stack,i=Se(o,b.__wbindgen_malloc,b.__wbindgen_realloc),s=C;W().setInt32(e+4,s,!0),W().setInt32(e+0,i,!0)}function Te(e,t){const o=J(t),i=Se(o,b.__wbindgen_malloc,b.__wbindgen_realloc),s=C;W().setInt32(e+4,s,!0),W().setInt32(e+0,i,!0)}function Ce(){const e=b.__wbindgen_export_2,t=e.grow(4);e.set(0,void 0),e.set(t+0,void 0),e.set(t+1,null),e.set(t+2,!0),e.set(t+3,!1)}function Le(e){return e}function Re(e,t){throw new Error(ye(e,t))}URL=globalThis.URL;const lt=await Ve({"./gb_web_bg.js":{__wbindgen_number_new:Le,__wbg_call_7cccdd69e0791ae2:ve,__wbg_new_8a6f238a6ece86ea:Ee,__wbg_stack_0ed75d68575b0f3c:$e,__wbg_error_7534b8e9a36f1ab4:je,__wbindgen_throw:Re,__wbindgen_debug_string:Te,__wbindgen_init_externref_table:Ce}},Xe),{memory:te,__wbg_webcartridge_free:ut,__wbg_webemulator_free:dt,get_audio_buffer_size:ft,init:_t,webcartridge_new:gt,webemulator_get_canvas_data_pointer:wt,webemulator_new:bt,webemulator_on_key_down:mt,webemulator_on_key_up:pt,webemulator_run_frame:ht,webemulator_set_audio_buffer_callback:xt,__wbindgen_exn_store:yt,__externref_table_alloc:St,__wbindgen_export_2:At,__wbindgen_free:vt,__wbindgen_malloc:jt,__wbindgen_realloc:Et,__wbindgen_start:Ne}=lt,$t=Object.freeze(Object.defineProperty({__proto__:null,__externref_table_alloc:St,__wbg_webcartridge_free:ut,__wbg_webemulator_free:dt,__wbindgen_exn_store:yt,__wbindgen_export_2:At,__wbindgen_free:vt,__wbindgen_malloc:jt,__wbindgen_realloc:Et,__wbindgen_start:Ne,get_audio_buffer_size:ft,init:_t,memory:te,webcartridge_new:gt,webemulator_get_canvas_data_pointer:wt,webemulator_new:bt,webemulator_on_key_down:mt,webemulator_on_key_up:pt,webemulator_run_frame:ht,webemulator_set_audio_buffer_callback:xt},Symbol.toStringTag,{value:"Module"})),ne=g.createContext({input:[],onKeyDown:()=>{},onKeyUp:()=>{}});function Tt({children:e}){const[t,o]=g.useState([]),i=g.useCallback(c=>{o(r=>r.filter(u=>c!==u))},[]),s=g.useCallback(c=>{o(r=>r.includes(c)?r:[...r,c])},[]);return n.jsx(ne.Provider,{value:{input:t,onKeyUp:i,onKeyDown:s},children:e})}he($t);Ne();const Ct=Object.freeze(Object.defineProperty({__proto__:null,JsKeys:_,WebCartridge:Ae,WebEmulator:ct,__wbg_call_7cccdd69e0791ae2:ve,__wbg_error_7534b8e9a36f1ab4:je,__wbg_new_8a6f238a6ece86ea:Ee,__wbg_set_wasm:he,__wbg_stack_0ed75d68575b0f3c:$e,__wbindgen_debug_string:Te,__wbindgen_init_externref_table:Ce,__wbindgen_number_new:Le,__wbindgen_throw:Re,get_audio_buffer_size:at,init:st},Symbol.toStringTag,{value:"Module"})),Z={ArrowDown:_.ArrowDown,ArrowUp:_.ArrowUp,ArrowLeft:_.ArrowLeft,ArrowRight:_.ArrowRight,KeyD:_.ArrowRight,KeyA:_.ArrowLeft,KeyW:_.ArrowUp,KeyS:_.ArrowDown,KeyJ:_.A,KeyX:_.A,KeyK:_.B,KeyC:_.B,KeyB:_.Start,KeyN:_.Select};function Lt(){const{onKeyDown:e,onKeyUp:t,input:o}=g.useContext(ne),i=g.useRef(void 0);return g.useEffect(()=>{Object.values(Z).forEach(c=>{o.includes(c)?i.current?.on_key_down(c):i.current?.on_key_up(c)})},[o]),g.useEffect(()=>{const c=u=>{const d=Z[u.code];d!==void 0&&e(d)},r=u=>{const d=Z[u.code];d!==void 0&&t(d)};return window.addEventListener("keydown",c),window.addEventListener("keyup",r),()=>{window.removeEventListener("keydown",c),window.removeEventListener("keyup",r)}},[e,t]),g.useCallback(c=>{i.current=c},[])}function Rt(){const[e,t]=g.useState(null);return g.useEffect(()=>{ze(()=>Promise.resolve().then(()=>Ct),void 0).then(o=>{o.init(),t(o)}).catch(console.error)},[]),e}let _e=!1;function Nt(e){if(_e)return;_e=!0;const t=e.createBuffer(1,1,e.sampleRate),o=e.createBufferSource();o.buffer=t,o.connect(e.destination),o.start(0),e.resume()}function ge(e,t,o=1){if(o>0&&e>=t||o<0&&e<=t)return[];const i=[];for(let s=e;o>0?s<t:s>t;s+=o)i.push(s);return i}function Bt(e){return fetch(e).then(t=>t.arrayBuffer()).then(t=>new Uint8Array(t))}function Ot(){return g.useContext(ne)}function Dt(){return Ge()}const Be=45,Oe=23,De=6,V=9,It=20,kt=13,F=36,Ie=25,z=26,Pt="#393C81",Mt="#8A205E";function a(e){return t=>`${t.theme.zoom*e}px`}function re(){return Y`
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
  padding: ${a(20)};
  color: ${Pt};
  position: relative;
`,Wt=f.div`
  background-color: #777;
  border-radius: ${a(7)} ${a(7)} ${a(40)} ${a(7)};
  box-shadow: inset 0px 0px 20px 0px rgba(0, 0, 0, 0.66);
`,zt=f.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${a(Oe)};
  font-size: ${a(De)};
  font-family: Arial;
  color: #b3b3b3;
  padding: 0 ${a(8)} 0;
`,Gt=f.div`
  flex: 0 0 auto;
  margin: 0 ${a(5)};
`,Ht=f.div`
  display: flex;
  margin-right: ${a(Be)};
  padding-bottom: ${a(Oe)};
`,Kt=f.div`
  flex: 1 1 ${e=>e.width};
  height: ${a(3)};
  background-color: #8b1d90;
  box-shadow: 0 ${a(6)} 0 #283593;
  margin-top: -${a(6)};
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
`,qt=f.div`
  background-color: ${e=>e.$enabled?"#f00":"#000"};
  box-shadow: 0 0 3px 1px #ef5350;
  height: ${a(V)};
  width: ${a(V)};
  border-radius: ${e=>e.theme.zoom*V/2}px;
  margin: 10px 20px 10px 10px;
  box-shadow: inset 0px 0px 5px 0px rgba(0, 0, 0, 0.66);
`,Yt=f.div`
  font-family: Arial;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #b3b3b3;
  width: ${a(Be)};
  font-size: ${a(De)};
  margin-bottom: 80px;
`,Jt=f.div`
  letter-spacing: 1px;
  font-size: ${a(kt)};
`,Xt=f.div`
  margin-left: ${a(2)};
  font-size: ${a(It)};
`,Qt=f.div`
  font-size: ${a(6)};
`,en=f.div`
  background-color: ${Mt};
  height: ${a(F)};
  width: ${a(F)};
  border-radius: ${a(F/2)};

  ${e=>e.$pressed&&re()}
`,tn=f.div`
  position: relative;
`,nn=f.div`
  font-size: ${a(12)};
  letter-spacing: ${a(1)};
`,ke=f(nn)`
  margin-top: ${e=>a(e.$spacing)};
`,rn=f.div`
  display: inline-flex;
  margin-top: ${a(10)};
  margin-right: -${a(12)};
  transform: rotate(-${Ie}deg);
  padding: ${a(5)};

  background-color: #dfdfdf;
  box-shadow: 0 0 0 5px #dfdfdf;
  border-radius: ${a(F)};

  > * + * {
    margin-left: ${a(18)};
  }

  ${ke} {
    bottom: -${a(25)};
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
  }
`,X=f.div`
  transform: rotate(-${Ie}deg);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`,on=f.div`
  border-radius: ${a(19/2)};
  background-color: #dfdfdf;
  padding: ${a(5)};
`,sn=f.div`
  background-color: #868a8d;
  width: ${a(38)};
  height: ${a(9)};
  border-radius: ${a(9/2)};
  ${e=>e.$pressed&&re()}
`,an=f.div`
  display: flex;
  margin-left: ${a(80)};
  margin-top: ${a(30)};
  margin-bottom: ${a(40)};
  ${X} + ${X} {
    margin-left: ${a(7)};
  }
`,cn=f.div``;var O=(e=>(e[e.HORIZONTAL=0]="HORIZONTAL",e[e.VERTICAL=1]="VERTICAL",e))(O||{});const ln=f.div`
  display: flex;
  justify-content: center;
`,Pe=f.div`
  width: ${a(2)};
  height: 80%;
  background-color: #353535;
  margin: ${a(2)};
  border-radius: ${a(5)};
`,Me=f.div`
  position: relative;
  height: ${a(z)};
  width: ${a(z)};
  background-color: #1b1d1d;
`,G=f(Me)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${e=>e.$orientation===1?"row":"column"};

  ${Pe} {
    ${e=>e.$pressed&&re()}

    ${e=>e.$orientation===1?Y`
            width: ${a(3)};
            height: 60%;
          `:Y`
            height: ${a(3)};
            width: 60%;
          `};
  }
`,un=f(G)`
  border-radius: ${a(5)} 0 0 ${a(5)};
`,dn=f(G)`
  border-radius: ${a(5)} ${a(5)} 0 0;
`,fn=f(G)`
  border-radius: 0 ${a(5)} ${a(5)} 0;
`,_n=f(G)`
  border-radius: 0 0 ${a(5)} ${a(5)};
`,gn=f(Me)`
  &:before {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: ${a(z-7)};
    width: ${a(z-7)};
    background-color: #353535;
    border-radius: 100%;
  }
`,wn=f.div`
  display: flex;
  margin-top: ${a(35)};
`,Q=f.div`
  height: ${a(48)};
  width: ${a(5)};
  background-color: #a7a49f;
  border-radius: ${a(5)};
  box-shadow: inset 0px 0px 5px 0px rgb(95 95 95 / 66%);
`,bn=f.div`
  display: inline-flex;
  transform: rotate(-28deg);
  position: absolute;
  bottom: ${a(19)};
  right: ${a(15)};

  ${Q} + ${Q} {
    margin-left: ${a(8)};
  }
`,l={Wrapper:Ut,Device:Ft,Display:Wt,DisplayTop:zt,DisplayHeaderText:Gt,DisplayContent:Ht,DisplayLine:Kt,Screen:Zt,ScreenOverlay:Vt,Battery:Yt,BatteryIndicator:qt,NintendoText:Jt,GameBoyText:Xt,TradeMarkText:Qt,Controls:wn,ButtonsAB:rn,CircleButtonWrapper:tn,CircleButton:en,ButtonText:ke,ButtonsStartSelect:an,WideButton:sn,WideButtonWrapper:on,WideButtonContainer:X,Arrows:cn,ArrowsLine:ln,ArrowUp:dn,ArrowDown:_n,ArrowLeft:un,ArrowRight:fn,ArrowCenter:gn,ArrowStripe:Pe,Speakers:bn,Speaker:Q};function mn(e){return n.jsxs(l.Display,{children:[n.jsxs(l.DisplayTop,{children:[n.jsx(l.DisplayLine,{width:"25%"}),n.jsx(l.DisplayHeaderText,{children:"DOT MATRIX WITH STEREO SOUND"}),n.jsx(l.DisplayLine,{width:"12%"})]}),n.jsxs(l.DisplayContent,{children:[n.jsxs(l.Battery,{children:[n.jsx(l.BatteryIndicator,{$enabled:e.enabled}),"BATTERY"]}),n.jsxs(l.Screen,{children:[e.children,n.jsx(l.ScreenOverlay,{})]})]})]})}const $=160,I=144;function pn({running:e},t){const{zoom:o}=Dt(),{input:i,onKeyDown:s,onKeyUp:c}=Ot(),r=i.includes(_.A),u=i.includes(_.B),d=i.includes(_.Start),p=i.includes(_.Select),h=i.includes(_.ArrowLeft),m=i.includes(_.ArrowRight),x=i.includes(_.ArrowUp),A=i.includes(_.ArrowDown);return n.jsx(l.Wrapper,{children:n.jsxs(l.Device,{children:[n.jsx(mn,{enabled:e,children:n.jsx("canvas",{ref:t,style:{display:"block",imageRendering:"pixelated",zoom:o},height:I,width:$})}),n.jsxs("div",{className:"flex items-baseline",children:[n.jsx(l.NintendoText,{className:"font-pretendo",children:"Nintendo"}),n.jsx(l.GameBoyText,{className:"font-gills-sans font-medium italic",children:"GAME BOY"}),n.jsx(l.TradeMarkText,{className:"font-bold",children:"TM"})]}),n.jsxs(l.Controls,{children:[n.jsxs(l.Arrows,{children:[n.jsx(l.ArrowsLine,{children:n.jsxs(l.ArrowUp,{onPointerDown:()=>s(_.ArrowUp),onPointerUp:()=>c(_.ArrowUp),$orientation:O.HORIZONTAL,$pressed:x,children:[n.jsx(l.ArrowStripe,{}),n.jsx(l.ArrowStripe,{}),n.jsx(l.ArrowStripe,{})]})}),n.jsxs(l.ArrowsLine,{children:[n.jsxs(l.ArrowLeft,{onPointerDown:()=>s(_.ArrowLeft),onPointerUp:()=>c(_.ArrowLeft),$orientation:O.VERTICAL,$pressed:h,children:[n.jsx(l.ArrowStripe,{}),n.jsx(l.ArrowStripe,{}),n.jsx(l.ArrowStripe,{})]}),n.jsx(l.ArrowCenter,{}),n.jsxs(l.ArrowRight,{onPointerDown:()=>s(_.ArrowRight),onPointerUp:()=>c(_.ArrowRight),$orientation:O.VERTICAL,$pressed:m,children:[n.jsx(l.ArrowStripe,{}),n.jsx(l.ArrowStripe,{}),n.jsx(l.ArrowStripe,{})]})]}),n.jsx(l.ArrowsLine,{children:n.jsxs(l.ArrowDown,{onPointerDown:()=>s(_.ArrowDown),onPointerUp:()=>c(_.ArrowDown),$orientation:O.HORIZONTAL,$pressed:A,children:[n.jsx(l.ArrowStripe,{}),n.jsx(l.ArrowStripe,{}),n.jsx(l.ArrowStripe,{})]})})]}),n.jsx("div",{className:"ml-auto",children:n.jsxs(l.ButtonsAB,{className:" font-nes",children:[n.jsxs(l.CircleButtonWrapper,{children:[n.jsx(l.CircleButton,{onPointerDown:()=>s(_.B),onPointerUp:()=>c(_.B),$pressed:u}),n.jsx(l.ButtonText,{$spacing:10,children:"B"})]}),n.jsxs(l.CircleButtonWrapper,{children:[n.jsx(l.CircleButton,{onPointerDown:()=>s(_.A),onPointerUp:()=>c(_.A),$pressed:r}),n.jsx(l.ButtonText,{$spacing:10,children:"A"})]})]})})]}),n.jsxs(l.ButtonsStartSelect,{className:"font-nes",children:[n.jsxs(l.WideButtonContainer,{children:[n.jsx(l.WideButtonWrapper,{children:n.jsx(l.WideButton,{onPointerDown:()=>s(_.Select),onPointerUp:()=>c(_.Select),$pressed:p})}),n.jsx(l.ButtonText,{$spacing:1,children:"SELECT"})]}),n.jsxs(l.WideButtonContainer,{children:[n.jsx(l.WideButtonWrapper,{children:n.jsx(l.WideButton,{onPointerDown:()=>s(_.Start),onPointerUp:()=>c(_.Start),$pressed:d})}),n.jsx(l.ButtonText,{$spacing:1,children:"START"})]})]}),n.jsxs(l.Speakers,{children:[n.jsx(l.Speaker,{}),n.jsx(l.Speaker,{}),n.jsx(l.Speaker,{}),n.jsx(l.Speaker,{}),n.jsx(l.Speaker,{}),n.jsx(l.Speaker,{})]})]})})}const hn=g.forwardRef(pn),xn="12px",M={Icon:f.div`
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
  `};function yn(e){const{zoom:t,onChange:o}=e;return n.jsxs(M.Wrapper,{children:[n.jsx(M.Icon,{children:n.jsx("button",{type:"button",onClick:()=>o(Math.max(1,t-.5)),children:"-"})}),n.jsxs(M.Value,{children:["Zoom: ",t.toFixed(1)]}),n.jsx(M.Icon,{children:n.jsx("button",{type:"button",onClick:()=>o(Math.min(t+.5,5)),children:"+"})})]})}const Sn=f.div`
  cursor: pointer;
`;function An(){const e=He();return n.jsx(Sn,{onClick:()=>e(-1),children:"←"})}const Ue=qe.filter(e=>["demos/cgb-acid2.gbc","demos/dmg-acid2.gb","demos/gejmboj.gb","demos/oh.gb","demos/opus5.gb","demos/pocket.gb"].includes(e.name)),vn=Ue.find(e=>e.name==="demos/oh.gb")||null;function jn({onCartridgeLoad:e,selectedName:t}){const o=g.useCallback(i=>{i&&Bt(i.url).then(s=>e({name:i.name,bytes:s}))},[e]);return g.useEffect(()=>{o(vn)},[o]),n.jsx("table",{children:n.jsx("tbody",{children:Ue.map(i=>n.jsxs("tr",{className:t===i.name?"font-medium underline":"",children:[n.jsx("td",{className:"px-1",children:i.name}),n.jsx("td",{className:"px-1",children:n.jsx("button",{type:"button",onClick:()=>o(i),children:"Load"})})]},i.url))})})}const En=12,q=20,we=30,$n=64,Tn=f.span`
  font-size: ${En}px;
`,Cn=f.canvas`
  display: inline-block;
`,N=[];function Ln(){const e=g.useRef(window.performance.now()),t=g.useRef(null),o=g.useRef(0);return g.useEffect(()=>{function i(){o.current=window.requestAnimationFrame(()=>{const s=window.performance.now(),c=s-e.current;e.current=s;const r=Math.round(1e3/c);N.push(r),N.length>$n&&N.shift();const u=Math.round(N.reduce((p,h)=>p+h)/N.length),d=t.current?.getContext("2d");d&&(d.clearRect(0,0,we,q),d.textBaseline="middle",d.font="12px Arial",d.fillText(u.toString(),1,q/2+1)),i()})}return i(),()=>window.cancelAnimationFrame(o.current)},[]),n.jsxs(Tn,{className:"flex items-center justify-end",children:["Average FPS: ",n.jsx(Cn,{width:we,height:q,ref:t})]})}function Rn(e){const{onLoad:t,className:o,children:i}=e,s=c=>{const{files:r}=c.currentTarget;if(!r)return;const u=r[0];u.arrayBuffer().then(d=>new Uint8Array(d)).then(d=>t({name:`Custom: ${u.name}`,bytes:d,custom:!0}))};return n.jsxs(n.Fragment,{children:[n.jsx("input",{onChange:s,accept:".gb,.gbc",style:{display:"none"},id:"file",multiple:!0,type:"file"}),n.jsx("label",{className:o,htmlFor:"file",children:i})]})}const Nn=1.5,Bn="#6D7C00",v=new AudioContext({sampleRate:44100});function On(e,t){const o=e.get_canvas_data_pointer(),i=t.createImageData($,I),s=new Uint8Array(te.buffer,o,$*I*3);ge(0,I).forEach(c=>{ge(0,$).forEach(r=>{const u=(c*$+r)*3,d=(c*$+r)*4;i.data[d]=s[u],i.data[d+1]=s[u+1],i.data[d+2]=s[u+2],i.data[d+3]=255})}),t.putImageData(i,0,0)}function be(e){e.fillStyle=Bn,e.fillRect(0,0,$,I)}const B=2;function Dn(e){const{bytes:t,wasmModule:o,running:i,ctx:s,soundEnabled:c}=e,r=g.useRef(void 0),u=g.useRef(0),d=g.useRef(0),p=Lt();g.useEffect(()=>{be(s)},[s]);const h=g.useCallback(m=>{const x=o.get_audio_buffer_size(),A=new Float32Array(te.buffer,m,x),j=A.length/B,w=v.createBuffer(B,j,v.sampleRate);for(let E=0;E<B;E+=1){const Fe=w.getChannelData(E);for(let k=0;k<j;k+=1)Fe[k]=A[k*B+E]}const S=v.createBufferSource();S.buffer=w,S.connect(v.destination),u.current<=v.currentTime+.02&&(u.current=v.currentTime+.06),S.start(u.current),u.current+=x/B/v.sampleRate},[o.get_audio_buffer_size]);return g.useEffect(()=>{if(!t)return;const m=new o.WebCartridge(t);u.current=0,r.current=new o.WebEmulator(m,()=>{}),be(s),p(r.current)},[s,t,o,p]),g.useEffect(()=>{const m=r.current;m&&m.set_audio_buffer_callback(c?h:()=>{})},[c,h]),g.useEffect(()=>{const m=r.current;if(m)if(i){const x=()=>{m.run_frame(),On(m,s),d.current=window.requestAnimationFrame(x)};x()}else window.cancelAnimationFrame(d.current)},[i,s]),null}function Mn(){const[e,t]=ue.useLocalStorage("zoom",Nn),[o,i]=ue.useLocalStorage("sound_enabled",!1),[s,c]=g.useState(!1),[r,u]=g.useState(),[d,p]=g.useState(null),h={zoom:e},m=Rt(),x=()=>{Nt(v),c(w=>w?!1:!!(!w&&d))},A=g.useCallback(w=>{w&&u(S=>{if(S)return S;const E=w.getContext("2d");return E||S})},[]),j=g.useCallback(w=>{c(!1),p(w)},[]);return m?n.jsx("div",{className:"select-none",children:n.jsx(Tt,{children:n.jsxs(Ze,{theme:h,children:[n.jsxs("div",{className:"grid grid-cols-3 justify-between items-center mx-2 pt-2",children:[n.jsx(An,{}),n.jsx(yn,{zoom:e,onChange:t}),n.jsx("div",{className:"justify-end",children:n.jsx(Ln,{})})]}),n.jsx(hn,{running:s,ref:A}),r&&n.jsx(Dn,{bytes:d?.bytes,wasmModule:m,running:s,soundEnabled:o,ctx:r}),n.jsxs("div",{className:"mt-2 flex justify-center items-center text-xs",children:[n.jsx("button",{className:"mx-2 border rounded px-1 py-1",type:"button",onClick:x,children:s?"Stop":"Run"}),n.jsx(Rn,{className:"mx-2 border rounded px-1 py-1",onLoad:j,children:"Upload ROM"}),n.jsxs("label",{className:"flex justify-center items-center",htmlFor:"soundEnableCheckbox",children:[n.jsx("input",{id:"soundEnableCheckbox",className:"mr-1",type:"checkbox",checked:o,onChange:w=>i(w.currentTarget.checked)}),"Enable sound"]})]}),d?.custom&&n.jsx("div",{className:"mt-2 flex justify-center text-xs",children:d.name}),n.jsx("div",{className:"mt-2 flex justify-center text-xs",children:n.jsx(jn,{selectedName:d?.name,onCartridgeLoad:j})}),n.jsx("div",{className:"mt-2 flex text-center justify-center text-xs",children:n.jsxs("div",{children:[n.jsx("p",{children:"Select one of the available demos or upload your custom *.gb file and press Run"}),n.jsxs("p",{children:["The test ROMs are available in"," ",n.jsx(oe,{className:"underline",to:"/debug",children:"debug mode"}),". You can see the test results"," ",n.jsx(oe,{className:"underline",to:"/test-results",children:"here"}),"."]})]})})]})})}):n.jsx(Ke,{})}export{Mn as Play,Mn as default};
