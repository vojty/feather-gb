import{r as ze,a as g,j as n,_ as Ge,n as He,d as _,l as J,u as Ke,F as Ze,o as Ve,L as ie}from"./index-CpWg6vgS.js";import{_ as qe}from"./__vite-plugin-wasm-helper-D7K_KhUE.js";import{r as Ye}from"./romsList-Ch2JJVv5.js";var K={},R={},Z={},S={},N={},se;function te(){return se||(se=1,Object.defineProperty(N,"__esModule",{value:!0}),N.isBrowser=void 0,N.isBrowser=function(){return typeof window<"u"&&typeof window.document<"u"}),N}var ae;function pe(){if(ae)return S;ae=1,Object.defineProperty(S,"__esModule",{value:!0}),S.storage=S.MemoryStorageProxy=S.LocalStorageProxy=S.localStorageAvailable=void 0;var e=te();function t(){try{var c="@rehooks/local-storage:"+new Date().toISOString();return localStorage.setItem(c,c),localStorage.removeItem(c),!0}catch(r){return e.isBrowser()&&r instanceof DOMException&&(r.code===22||r.code===1014||r.name==="QuotaExceededError"||r.name==="NS_ERROR_DOM_QUOTA_REACHED")&&localStorage&&localStorage.length!==0}}S.localStorageAvailable=t;var o=(function(){function c(){}return c.prototype.getItem=function(r){return localStorage.getItem(r)},c.prototype.setItem=function(r,u){localStorage.setItem(r,u)},c.prototype.removeItem=function(r){localStorage.removeItem(r)},c})();S.LocalStorageProxy=o;var i=(function(){function c(){this._memoryStorage=new Map}return c.prototype.getItem=function(r){var u;return(u=this._memoryStorage.get(r))!==null&&u!==void 0?u:null},c.prototype.setItem=function(r,u){this._memoryStorage.set(r,u)},c.prototype.removeItem=function(r){this._memoryStorage.delete(r)},c})();S.MemoryStorageProxy=i;var s=function(c){return c?new o:new i};return S.storage=s(t()),S}var ce;function he(){return ce||(ce=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.deleteFromStorage=e.writeStorage=e.isTypeOfLocalStorageChanged=e.LOCAL_STORAGE_CHANGE_EVENT_NAME=void 0;var t=pe(),o=te();e.LOCAL_STORAGE_CHANGE_EVENT_NAME="onLocalStorageChange",(function(){if(!o.isBrowser()||typeof window.CustomEvent=="function")return;function r(u,d){var h,x;d===void 0&&(d={bubbles:!1,cancelable:!1});var m=document.createEvent("CustomEvent");return m.initCustomEvent(u,(h=d?.bubbles)!==null&&h!==void 0?h:!1,(x=d?.cancelable)!==null&&x!==void 0?x:!1,d?.detail),m}window.CustomEvent=r})();function i(r){return!!r&&r.type===e.LOCAL_STORAGE_CHANGE_EVENT_NAME}e.isTypeOfLocalStorageChanged=i;function s(r,u){if(o.isBrowser())try{t.storage.setItem(r,typeof u=="object"?JSON.stringify(u):""+u),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:r,value:u}}))}catch(d){throw d instanceof TypeError&&d.message.includes("circular structure")?new TypeError(`The object that was given to the writeStorage function has circular references.
For more information, check here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value`):d}}e.writeStorage=s;function c(r){o.isBrowser()&&(t.storage.removeItem(r),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:r,value:null}})))}e.deleteFromStorage=c})(Z)),Z}var le;function Je(){if(le)return R;le=1,Object.defineProperty(R,"__esModule",{value:!0}),R.useLocalStorage=void 0;var e=he(),t=te(),o=pe(),i=ze();function s(r){try{return JSON.parse(r)}catch{return r}}function c(r,u){u===void 0&&(u=null);var d=i.useState(o.storage.getItem(r)===null?u:s(o.storage.getItem(r))),h=d[0],x=d[1],m=i.useCallback(function(w){e.isTypeOfLocalStorageChanged(w)?w.detail.key===r&&x(w.detail.value):w.key===r&&x(w.newValue===null?null:s(w.newValue))},[x,r]);i.useEffect(function(){if(t.isBrowser()){var w=function(A){m(A)};return window.addEventListener(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,w),window.addEventListener("storage",w),o.storage.getItem(r)===null&&u!==null&&e.writeStorage(r,u),function(){window.removeEventListener(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,w),window.removeEventListener("storage",w)}}},[r,u,m]);var y=i.useCallback(function(w){return w instanceof Function?e.writeStorage(r,w(h)):e.writeStorage(r,w)},[r]),v=i.useCallback(function(){return e.deleteFromStorage(r)},[r]),E=h??u;return[E,y,v]}return R.useLocalStorage=c,R}var ue;function Xe(){return ue||(ue=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.useLocalStorage=void 0;var t=Je();Object.defineProperty(e,"useLocalStorage",{enumerable:!0,get:function(){return t.useLocalStorage}});var o=he();Object.defineProperty(e,"writeStorage",{enumerable:!0,get:function(){return o.writeStorage}}),Object.defineProperty(e,"deleteFromStorage",{enumerable:!0,get:function(){return o.deleteFromStorage}}),e.default=t.useLocalStorage})(K)),K}var de=Xe();const Qe="/feather-gb/assets/gb_web_bg-iMxAK9OC.wasm";let b;function xe(e){b=e}function et(e){const t=b.__externref_table_alloc();return b.__wbindgen_export_2.set(t,e),t}function tt(e,t){try{return e.apply(this,t)}catch(o){const i=et(o);b.__wbindgen_exn_store(i)}}const nt=typeof TextDecoder>"u"?(0,module.require)("util").TextDecoder:TextDecoder;let ye=new nt("utf-8",{ignoreBOM:!0,fatal:!0});ye.decode();let P=null;function I(){return(P===null||P.byteLength===0)&&(P=new Uint8Array(b.memory.buffer)),P}function Se(e,t){return e=e>>>0,ye.decode(I().subarray(e,e+t))}let L=0;const rt=typeof TextEncoder>"u"?(0,module.require)("util").TextEncoder:TextEncoder;let F=new rt("utf-8");const ot=typeof F.encodeInto=="function"?function(e,t){return F.encodeInto(e,t)}:function(e,t){const o=F.encode(e);return t.set(o),{read:e.length,written:o.length}};function Ae(e,t,o){if(o===void 0){const u=F.encode(e),d=t(u.length,1)>>>0;return I().subarray(d,d+u.length).set(u),L=u.length,d}let i=e.length,s=t(i,1)>>>0;const c=I();let r=0;for(;r<i;r++){const u=e.charCodeAt(r);if(u>127)break;c[s+r]=u}if(r!==i){r!==0&&(e=e.slice(r)),s=o(s,i,i=r+e.length*3,1)>>>0;const u=I().subarray(s+r,s+i),d=ot(e,u);r+=d.written,s=o(s,i,r,1)>>>0}return L=r,s}let C=null;function z(){return(C===null||C.buffer.detached===!0||C.buffer.detached===void 0&&C.buffer!==b.memory.buffer)&&(C=new DataView(b.memory.buffer)),C}function X(e){const t=typeof e;if(t=="number"||t=="boolean"||e==null)return`${e}`;if(t=="string")return`"${e}"`;if(t=="symbol"){const s=e.description;return s==null?"Symbol":`Symbol(${s})`}if(t=="function"){const s=e.name;return typeof s=="string"&&s.length>0?`Function(${s})`:"Function"}if(Array.isArray(e)){const s=e.length;let c="[";s>0&&(c+=X(e[0]));for(let r=1;r<s;r++)c+=", "+X(e[r]);return c+="]",c}const o=/\[object ([^\]]+)\]/.exec(toString.call(e));let i;if(o&&o.length>1)i=o[1];else return toString.call(e);if(i=="Object")try{return"Object("+JSON.stringify(e)+")"}catch{return"Object"}return e instanceof Error?`${e.name}: ${e.message}
${e.stack}`:i}function it(e,t){if(!(e instanceof t))throw new Error(`expected instance of ${t.name}`)}function st(e,t){const o=t(e.length*1,1)>>>0;return I().set(e,o/1),L=e.length,o}function at(){b.init()}function ct(){return b.get_audio_buffer_size()>>>0}const f=Object.freeze({ArrowDown:0,0:"ArrowDown",ArrowLeft:1,1:"ArrowLeft",ArrowRight:2,2:"ArrowRight",ArrowUp:3,3:"ArrowUp",A:4,4:"A",B:5,5:"B",Start:6,6:"Start",Select:7,7:"Select"}),_e=typeof FinalizationRegistry>"u"?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(e=>b.__wbg_webcartridge_free(e>>>0,1));class ve{__destroy_into_raw(){const t=this.__wbg_ptr;return this.__wbg_ptr=0,_e.unregister(this),t}free(){const t=this.__destroy_into_raw();b.__wbg_webcartridge_free(t,0)}constructor(t){const o=st(t,b.__wbindgen_malloc),i=L,s=b.webcartridge_new(o,i);return this.__wbg_ptr=s>>>0,_e.register(this,this.__wbg_ptr,this),this}}const fe=typeof FinalizationRegistry>"u"?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(e=>b.__wbg_webemulator_free(e>>>0,1));class lt{__destroy_into_raw(){const t=this.__wbg_ptr;return this.__wbg_ptr=0,fe.unregister(this),t}free(){const t=this.__destroy_into_raw();b.__wbg_webemulator_free(t,0)}on_key_down(t){b.webemulator_on_key_down(this.__wbg_ptr,t)}get_canvas_data_pointer(){return b.webemulator_get_canvas_data_pointer(this.__wbg_ptr)>>>0}set_audio_buffer_callback(t){b.webemulator_set_audio_buffer_callback(this.__wbg_ptr,t)}constructor(t,o){it(t,ve);var i=t.__destroy_into_raw();const s=b.webemulator_new(i,o);return this.__wbg_ptr=s>>>0,fe.register(this,this.__wbg_ptr,this),this}on_key_up(t){b.webemulator_on_key_up(this.__wbg_ptr,t)}run_frame(){b.webemulator_run_frame(this.__wbg_ptr)}}function je(){return tt(function(e,t,o){return e.call(t,o)},arguments)}function Ee(e,t){let o,i;try{o=e,i=t,console.error(Se(e,t))}finally{b.__wbindgen_free(o,i,1)}}function Te(){return new Error}function $e(e,t){const o=t.stack,i=Ae(o,b.__wbindgen_malloc,b.__wbindgen_realloc),s=L;z().setInt32(e+4,s,!0),z().setInt32(e+0,i,!0)}function Ce(e,t){const o=X(t),i=Ae(o,b.__wbindgen_malloc,b.__wbindgen_realloc),s=L;z().setInt32(e+4,s,!0),z().setInt32(e+0,i,!0)}function Le(){const e=b.__wbindgen_export_2,t=e.grow(4);e.set(0,void 0),e.set(t+0,void 0),e.set(t+1,null),e.set(t+2,!0),e.set(t+3,!1)}function Re(e){return e}function Ne(e,t){throw new Error(Se(e,t))}URL=globalThis.URL;const p=await qe({"./gb_web_bg.js":{__wbg_new_8a6f238a6ece86ea:Te,__wbg_stack_0ed75d68575b0f3c:$e,__wbg_error_7534b8e9a36f1ab4:Ee,__wbindgen_number_new:Re,__wbg_call_7cccdd69e0791ae2:je,__wbindgen_throw:Ne,__wbindgen_debug_string:Ce,__wbindgen_init_externref_table:Le}},Qe),ne=p.memory,ut=p.__wbg_webcartridge_free,dt=p.__wbg_webemulator_free,_t=p.get_audio_buffer_size,ft=p.init,gt=p.webcartridge_new,wt=p.webemulator_get_canvas_data_pointer,bt=p.webemulator_new,mt=p.webemulator_on_key_down,pt=p.webemulator_on_key_up,ht=p.webemulator_run_frame,xt=p.webemulator_set_audio_buffer_callback,yt=p.__wbindgen_exn_store,St=p.__externref_table_alloc,At=p.__wbindgen_export_2,vt=p.__wbindgen_free,jt=p.__wbindgen_malloc,Et=p.__wbindgen_realloc,Oe=p.__wbindgen_start,Tt=Object.freeze(Object.defineProperty({__proto__:null,__externref_table_alloc:St,__wbg_webcartridge_free:ut,__wbg_webemulator_free:dt,__wbindgen_exn_store:yt,__wbindgen_export_2:At,__wbindgen_free:vt,__wbindgen_malloc:jt,__wbindgen_realloc:Et,__wbindgen_start:Oe,get_audio_buffer_size:_t,init:ft,memory:ne,webcartridge_new:gt,webemulator_get_canvas_data_pointer:wt,webemulator_new:bt,webemulator_on_key_down:mt,webemulator_on_key_up:pt,webemulator_run_frame:ht,webemulator_set_audio_buffer_callback:xt},Symbol.toStringTag,{value:"Module"})),re=g.createContext({input:[],onKeyDown:()=>{},onKeyUp:()=>{}});function $t({children:e}){const[t,o]=g.useState([]),i=g.useCallback(c=>{o(r=>r.filter(u=>c!==u))},[]),s=g.useCallback(c=>{o(r=>r.includes(c)?r:[...r,c])},[]);return n.jsx(re.Provider,{value:{input:t,onKeyUp:i,onKeyDown:s},children:e})}xe(Tt);Oe();const Ct=Object.freeze(Object.defineProperty({__proto__:null,JsKeys:f,WebCartridge:ve,WebEmulator:lt,__wbg_call_7cccdd69e0791ae2:je,__wbg_error_7534b8e9a36f1ab4:Ee,__wbg_new_8a6f238a6ece86ea:Te,__wbg_set_wasm:xe,__wbg_stack_0ed75d68575b0f3c:$e,__wbindgen_debug_string:Ce,__wbindgen_init_externref_table:Le,__wbindgen_number_new:Re,__wbindgen_throw:Ne,get_audio_buffer_size:ct,init:at},Symbol.toStringTag,{value:"Module"})),V={ArrowDown:f.ArrowDown,ArrowUp:f.ArrowUp,ArrowLeft:f.ArrowLeft,ArrowRight:f.ArrowRight,KeyD:f.ArrowRight,KeyA:f.ArrowLeft,KeyW:f.ArrowUp,KeyS:f.ArrowDown,KeyJ:f.A,KeyX:f.A,KeyK:f.B,KeyC:f.B,KeyB:f.Start,KeyN:f.Select};function Lt(){const{onKeyDown:e,onKeyUp:t,input:o}=g.useContext(re),i=g.useRef(void 0);return g.useEffect(()=>{Object.values(V).forEach(c=>{o.includes(c)?i.current?.on_key_down(c):i.current?.on_key_up(c)})},[o]),g.useEffect(()=>{const c=u=>{const d=V[u.code];d!==void 0&&e(d)},r=u=>{const d=V[u.code];d!==void 0&&t(d)};return window.addEventListener("keydown",c),window.addEventListener("keyup",r),()=>{window.removeEventListener("keydown",c),window.removeEventListener("keyup",r)}},[e,t]),g.useCallback(c=>{i.current=c},[])}function Rt(){const[e,t]=g.useState(null);return g.useEffect(()=>{Ge(()=>Promise.resolve().then(()=>Ct),void 0).then(o=>{o.init(),t(o)}).catch(console.error)},[]),e}let ge=!1;function Nt(e){if(ge)return;ge=!0;const t=e.createBuffer(1,1,e.sampleRate),o=e.createBufferSource();o.buffer=t,o.connect(e.destination),o.start(0),e.resume()}function we(e,t,o=1){if(o>0&&e>=t||o<0&&e<=t)return[];const i=[];for(let s=e;o>0?s<t:s>t;s+=o)i.push(s);return i}function Ot(e){return fetch(e).then(t=>t.arrayBuffer()).then(t=>new Uint8Array(t))}function Bt(){return g.useContext(re)}function Dt(){return He()}const Be=45,De=23,Ie=6,q=9,It=20,kt=13,W=36,ke=25,G=26,Mt="#393C81",Pt="#8A205E";function a(e){return t=>`${t.theme.zoom*e}px`}function oe(){return J`
    filter: brightness(80%);
  `}const Ut=_.div`
  display: flex;
  justify-content: center;
`,Ft=_.div`
  display: inline-block;
  margin: 10px;
  background: #eee;
  border-radius: 10px 10px 60px 10px;
  box-shadow: 5px 5px rgba(0, 0, 0, 0.1);
  padding: ${a(20)};
  color: ${Mt};
  position: relative;
`,Wt=_.div`
  background-color: #777;
  border-radius: ${a(7)} ${a(7)} ${a(40)} ${a(7)};
  box-shadow: inset 0px 0px 20px 0px rgba(0, 0, 0, 0.66);
`,zt=_.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${a(De)};
  font-size: ${a(Ie)};
  font-family: Arial;
  color: #b3b3b3;
  padding: 0 ${a(8)} 0;
`,Gt=_.div`
  flex: 0 0 auto;
  margin: 0 ${a(5)};
`,Ht=_.div`
  display: flex;
  margin-right: ${a(Be)};
  padding-bottom: ${a(De)};
`,Kt=_.div`
  flex: 1 1 ${e=>e.width};
  height: ${a(3)};
  background-color: #8b1d90;
  box-shadow: 0 ${a(6)} 0 #283593;
  margin-top: -${a(6)};
`,Zt=_.div`
  margin-left: auto;
  margin-right: auto;
  position: relative;
`,Vt=_.div`
  position: absolute;
  box-shadow: inset 5px 5px 5px 0px rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`,qt=_.div`
  background-color: ${e=>e.$enabled?"#f00":"#000"};
  box-shadow: 0 0 3px 1px #ef5350;
  height: ${a(q)};
  width: ${a(q)};
  border-radius: ${e=>e.theme.zoom*q/2}px;
  margin: 10px 20px 10px 10px;
  box-shadow: inset 0px 0px 5px 0px rgba(0, 0, 0, 0.66);
`,Yt=_.div`
  font-family: Arial;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #b3b3b3;
  width: ${a(Be)};
  font-size: ${a(Ie)};
  margin-bottom: 80px;
`,Jt=_.div`
  letter-spacing: 1px;
  font-size: ${a(kt)};
`,Xt=_.div`
  margin-left: ${a(2)};
  font-size: ${a(It)};
`,Qt=_.div`
  font-size: ${a(6)};
`,en=_.div`
  background-color: ${Pt};
  height: ${a(W)};
  width: ${a(W)};
  border-radius: ${a(W/2)};

  ${e=>e.$pressed&&oe()}
`,tn=_.div`
  position: relative;
`,nn=_.div`
  font-size: ${a(12)};
  letter-spacing: ${a(1)};
`,Me=_(nn)`
  margin-top: ${e=>a(e.$spacing)};
`,rn=_.div`
  display: inline-flex;
  margin-top: ${a(10)};
  margin-right: -${a(12)};
  transform: rotate(-${ke}deg);
  padding: ${a(5)};

  background-color: #dfdfdf;
  box-shadow: 0 0 0 5px #dfdfdf;
  border-radius: ${a(W)};

  > * + * {
    margin-left: ${a(18)};
  }

  ${Me} {
    bottom: -${a(25)};
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
  }
`,Q=_.div`
  transform: rotate(-${ke}deg);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`,on=_.div`
  border-radius: ${a(19/2)};
  background-color: #dfdfdf;
  padding: ${a(5)};
`,sn=_.div`
  background-color: #868a8d;
  width: ${a(38)};
  height: ${a(9)};
  border-radius: ${a(9/2)};
  ${e=>e.$pressed&&oe()}
`,an=_.div`
  display: flex;
  margin-left: ${a(80)};
  margin-top: ${a(30)};
  margin-bottom: ${a(40)};
  ${Q} + ${Q} {
    margin-left: ${a(7)};
  }
`,cn=_.div``;var D=(e=>(e[e.HORIZONTAL=0]="HORIZONTAL",e[e.VERTICAL=1]="VERTICAL",e))(D||{});const ln=_.div`
  display: flex;
  justify-content: center;
`,Pe=_.div`
  width: ${a(2)};
  height: 80%;
  background-color: #353535;
  margin: ${a(2)};
  border-radius: ${a(5)};
`,Ue=_.div`
  position: relative;
  height: ${a(G)};
  width: ${a(G)};
  background-color: #1b1d1d;
`,H=_(Ue)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${e=>e.$orientation===1?"row":"column"};

  ${Pe} {
    ${e=>e.$pressed&&oe()}

    ${e=>e.$orientation===1?J`
            width: ${a(3)};
            height: 60%;
          `:J`
            height: ${a(3)};
            width: 60%;
          `};
  }
`,un=_(H)`
  border-radius: ${a(5)} 0 0 ${a(5)};
`,dn=_(H)`
  border-radius: ${a(5)} ${a(5)} 0 0;
`,_n=_(H)`
  border-radius: 0 ${a(5)} ${a(5)} 0;
`,fn=_(H)`
  border-radius: 0 0 ${a(5)} ${a(5)};
`,gn=_(Ue)`
  &:before {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: ${a(G-7)};
    width: ${a(G-7)};
    background-color: #353535;
    border-radius: 100%;
  }
`,wn=_.div`
  display: flex;
  margin-top: ${a(35)};
`,ee=_.div`
  height: ${a(48)};
  width: ${a(5)};
  background-color: #a7a49f;
  border-radius: ${a(5)};
  box-shadow: inset 0px 0px 5px 0px rgb(95 95 95 / 66%);
`,bn=_.div`
  display: inline-flex;
  transform: rotate(-28deg);
  position: absolute;
  bottom: ${a(19)};
  right: ${a(15)};

  ${ee} + ${ee} {
    margin-left: ${a(8)};
  }
`,l={Wrapper:Ut,Device:Ft,Display:Wt,DisplayTop:zt,DisplayHeaderText:Gt,DisplayContent:Ht,DisplayLine:Kt,Screen:Zt,ScreenOverlay:Vt,Battery:Yt,BatteryIndicator:qt,NintendoText:Jt,GameBoyText:Xt,TradeMarkText:Qt,Controls:wn,ButtonsAB:rn,CircleButtonWrapper:tn,CircleButton:en,ButtonText:Me,ButtonsStartSelect:an,WideButton:sn,WideButtonWrapper:on,WideButtonContainer:Q,Arrows:cn,ArrowsLine:ln,ArrowUp:dn,ArrowDown:fn,ArrowLeft:un,ArrowRight:_n,ArrowCenter:gn,ArrowStripe:Pe,Speakers:bn,Speaker:ee};function mn(e){return n.jsxs(l.Display,{children:[n.jsxs(l.DisplayTop,{children:[n.jsx(l.DisplayLine,{width:"25%"}),n.jsx(l.DisplayHeaderText,{children:"DOT MATRIX WITH STEREO SOUND"}),n.jsx(l.DisplayLine,{width:"12%"})]}),n.jsxs(l.DisplayContent,{children:[n.jsxs(l.Battery,{children:[n.jsx(l.BatteryIndicator,{$enabled:e.enabled}),"BATTERY"]}),n.jsxs(l.Screen,{children:[e.children,n.jsx(l.ScreenOverlay,{})]})]})]})}const $=160,k=144;function pn({running:e},t){const{zoom:o}=Dt(),{input:i,onKeyDown:s,onKeyUp:c}=Bt(),r=i.includes(f.A),u=i.includes(f.B),d=i.includes(f.Start),h=i.includes(f.Select),x=i.includes(f.ArrowLeft),m=i.includes(f.ArrowRight),y=i.includes(f.ArrowUp),v=i.includes(f.ArrowDown);return n.jsx(l.Wrapper,{children:n.jsxs(l.Device,{children:[n.jsx(mn,{enabled:e,children:n.jsx("canvas",{ref:t,style:{display:"block",imageRendering:"pixelated",zoom:o},height:k,width:$})}),n.jsxs("div",{className:"flex items-baseline",children:[n.jsx(l.NintendoText,{className:"font-pretendo",children:"Nintendo"}),n.jsx(l.GameBoyText,{className:"font-gills-sans font-medium italic",children:"GAME BOY"}),n.jsx(l.TradeMarkText,{className:"font-bold",children:"TM"})]}),n.jsxs(l.Controls,{children:[n.jsxs(l.Arrows,{children:[n.jsx(l.ArrowsLine,{children:n.jsxs(l.ArrowUp,{onPointerDown:()=>s(f.ArrowUp),onPointerUp:()=>c(f.ArrowUp),$orientation:D.HORIZONTAL,$pressed:y,children:[n.jsx(l.ArrowStripe,{}),n.jsx(l.ArrowStripe,{}),n.jsx(l.ArrowStripe,{})]})}),n.jsxs(l.ArrowsLine,{children:[n.jsxs(l.ArrowLeft,{onPointerDown:()=>s(f.ArrowLeft),onPointerUp:()=>c(f.ArrowLeft),$orientation:D.VERTICAL,$pressed:x,children:[n.jsx(l.ArrowStripe,{}),n.jsx(l.ArrowStripe,{}),n.jsx(l.ArrowStripe,{})]}),n.jsx(l.ArrowCenter,{}),n.jsxs(l.ArrowRight,{onPointerDown:()=>s(f.ArrowRight),onPointerUp:()=>c(f.ArrowRight),$orientation:D.VERTICAL,$pressed:m,children:[n.jsx(l.ArrowStripe,{}),n.jsx(l.ArrowStripe,{}),n.jsx(l.ArrowStripe,{})]})]}),n.jsx(l.ArrowsLine,{children:n.jsxs(l.ArrowDown,{onPointerDown:()=>s(f.ArrowDown),onPointerUp:()=>c(f.ArrowDown),$orientation:D.HORIZONTAL,$pressed:v,children:[n.jsx(l.ArrowStripe,{}),n.jsx(l.ArrowStripe,{}),n.jsx(l.ArrowStripe,{})]})})]}),n.jsx("div",{className:"ml-auto",children:n.jsxs(l.ButtonsAB,{className:" font-nes",children:[n.jsxs(l.CircleButtonWrapper,{children:[n.jsx(l.CircleButton,{onPointerDown:()=>s(f.B),onPointerUp:()=>c(f.B),$pressed:u}),n.jsx(l.ButtonText,{$spacing:10,children:"B"})]}),n.jsxs(l.CircleButtonWrapper,{children:[n.jsx(l.CircleButton,{onPointerDown:()=>s(f.A),onPointerUp:()=>c(f.A),$pressed:r}),n.jsx(l.ButtonText,{$spacing:10,children:"A"})]})]})})]}),n.jsxs(l.ButtonsStartSelect,{className:"font-nes",children:[n.jsxs(l.WideButtonContainer,{children:[n.jsx(l.WideButtonWrapper,{children:n.jsx(l.WideButton,{onPointerDown:()=>s(f.Select),onPointerUp:()=>c(f.Select),$pressed:h})}),n.jsx(l.ButtonText,{$spacing:1,children:"SELECT"})]}),n.jsxs(l.WideButtonContainer,{children:[n.jsx(l.WideButtonWrapper,{children:n.jsx(l.WideButton,{onPointerDown:()=>s(f.Start),onPointerUp:()=>c(f.Start),$pressed:d})}),n.jsx(l.ButtonText,{$spacing:1,children:"START"})]})]}),n.jsxs(l.Speakers,{children:[n.jsx(l.Speaker,{}),n.jsx(l.Speaker,{}),n.jsx(l.Speaker,{}),n.jsx(l.Speaker,{}),n.jsx(l.Speaker,{}),n.jsx(l.Speaker,{})]})]})})}const hn=g.forwardRef(pn),xn="12px",U={Icon:_.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  `,Wrapper:_.div`
    font-size: ${xn};
    display: flex;
    align-items: center;
    justify-content: center;
  `,Value:_.div`
    margin: 0 5px;
  `};function yn(e){const{zoom:t,onChange:o}=e;return n.jsxs(U.Wrapper,{children:[n.jsx(U.Icon,{children:n.jsx("button",{type:"button",onClick:()=>o(Math.max(1,t-.5)),children:"-"})}),n.jsxs(U.Value,{children:["Zoom: ",t.toFixed(1)]}),n.jsx(U.Icon,{children:n.jsx("button",{type:"button",onClick:()=>o(Math.min(t+.5,5)),children:"+"})})]})}const Sn=_.div`
  cursor: pointer;
`;function An(){const e=Ke();return n.jsx(Sn,{onClick:()=>e(-1),children:"←"})}const Fe=Ye.filter(e=>["demos/cgb-acid2.gbc","demos/dmg-acid2.gb","demos/gejmboj.gb","demos/oh.gb","demos/opus5.gb","demos/pocket.gb"].includes(e.name)),vn=Fe.find(e=>e.name==="demos/oh.gb")||null;function jn({onCartridgeLoad:e,selectedName:t}){const o=g.useCallback(i=>{i&&Ot(i.url).then(s=>e({name:i.name,bytes:s}))},[e]);return g.useEffect(()=>{o(vn)},[o]),n.jsx("table",{children:n.jsx("tbody",{children:Fe.map(i=>n.jsxs("tr",{className:t===i.name?"font-medium underline":"",children:[n.jsx("td",{className:"px-1",children:i.name}),n.jsx("td",{className:"px-1",children:n.jsx("button",{type:"button",onClick:()=>o(i),children:"Load"})})]},i.url))})})}const En=12,Y=20,be=30,Tn=64,$n=_.span`
  font-size: ${En}px;
`,Cn=_.canvas`
  display: inline-block;
`,O=[];function Ln(){const e=g.useRef(window.performance.now()),t=g.useRef(null),o=g.useRef(0);return g.useEffect(()=>{function i(){o.current=window.requestAnimationFrame(()=>{const s=window.performance.now(),c=s-e.current;e.current=s;const r=Math.round(1e3/c);O.push(r),O.length>Tn&&O.shift();const u=Math.round(O.reduce((h,x)=>h+x)/O.length),d=t.current?.getContext("2d");d&&(d.clearRect(0,0,be,Y),d.textBaseline="middle",d.font="12px Arial",d.fillText(u.toString(),1,Y/2+1)),i()})}return i(),()=>window.cancelAnimationFrame(o.current)},[]),n.jsxs($n,{className:"flex items-center justify-end",children:["Average FPS:"," ",n.jsx(Cn,{width:be,height:Y,ref:t})]})}function Rn(e){const{onLoad:t,className:o,children:i}=e,s=c=>{const{files:r}=c.currentTarget;if(!r)return;const u=r[0];u.arrayBuffer().then(d=>new Uint8Array(d)).then(d=>t({name:`Custom: ${u.name}`,bytes:d,custom:!0}))};return n.jsxs(n.Fragment,{children:[n.jsx("input",{onChange:s,accept:".gb,.gbc",style:{display:"none"},id:"file",multiple:!0,type:"file"}),n.jsx("label",{className:o,htmlFor:"file",children:i})]})}const Nn=1.5,On="#6D7C00",j=new AudioContext({sampleRate:44100});function Bn(e,t){const o=e.get_canvas_data_pointer(),i=t.createImageData($,k),s=new Uint8Array(ne.buffer,o,$*k*3);we(0,k).forEach(c=>{we(0,$).forEach(r=>{const u=(c*$+r)*3,d=(c*$+r)*4;i.data[d]=s[u],i.data[d+1]=s[u+1],i.data[d+2]=s[u+2],i.data[d+3]=255})}),t.putImageData(i,0,0)}function me(e){e.fillStyle=On,e.fillRect(0,0,$,k)}const B=2;function Dn(e){const{bytes:t,wasmModule:o,running:i,ctx:s,soundEnabled:c}=e,r=g.useRef(void 0),u=g.useRef(0),d=g.useRef(0),h=Lt();g.useEffect(()=>{me(s)},[s]);const x=g.useCallback(m=>{const y=o.get_audio_buffer_size(),v=new Float32Array(ne.buffer,m,y),E=v.length/B,w=j.createBuffer(B,E,j.sampleRate);for(let T=0;T<B;T+=1){const We=w.getChannelData(T);for(let M=0;M<E;M+=1)We[M]=v[M*B+T]}const A=j.createBufferSource();A.buffer=w,A.connect(j.destination),u.current<=j.currentTime+.02&&(u.current=j.currentTime+.06),A.start(u.current),u.current+=y/B/j.sampleRate},[o.get_audio_buffer_size]);return g.useEffect(()=>{if(!t)return;const m=new o.WebCartridge(t);u.current=0,r.current=new o.WebEmulator(m,()=>{}),me(s),h(r.current)},[s,t,o,h]),g.useEffect(()=>{const m=r.current;m&&m.set_audio_buffer_callback(c?x:()=>{})},[c,x]),g.useEffect(()=>{const m=r.current;if(m)if(i){const y=()=>{m.run_frame(),Bn(m,s),d.current=window.requestAnimationFrame(y)};y()}else window.cancelAnimationFrame(d.current)},[i,s]),null}function Pn(){const[e,t]=de.useLocalStorage("zoom",Nn),[o,i]=de.useLocalStorage("sound_enabled",!1),[s,c]=g.useState(!1),[r,u]=g.useState(),[d,h]=g.useState(null),x={zoom:e},m=Rt(),y=()=>{Nt(j),c(w=>w?!1:!!(!w&&d))},v=g.useCallback(w=>{w&&u(A=>{if(A)return A;const T=w.getContext("2d");return T||A})},[]),E=g.useCallback(w=>{c(!1),h(w)},[]);return m?n.jsx("div",{className:"select-none",children:n.jsx($t,{children:n.jsxs(Ve,{theme:x,children:[n.jsxs("div",{className:"grid grid-cols-3 justify-between items-center mx-2 pt-2",children:[n.jsx(An,{}),n.jsx(yn,{zoom:e,onChange:t}),n.jsx("div",{className:"justify-end",children:n.jsx(Ln,{})})]}),n.jsx(hn,{running:s,ref:v}),r&&n.jsx(Dn,{bytes:d?.bytes,wasmModule:m,running:s,soundEnabled:o,ctx:r}),n.jsxs("div",{className:"mt-2 flex justify-center items-center text-xs",children:[n.jsx("button",{className:"mx-2 border rounded px-1 py-1",type:"button",onClick:y,children:s?"Stop":"Run"}),n.jsx(Rn,{className:"mx-2 border rounded px-1 py-1",onLoad:E,children:"Upload ROM"}),n.jsxs("label",{className:"flex justify-center items-center",htmlFor:"soundEnableCheckbox",children:[n.jsx("input",{id:"soundEnableCheckbox",className:"mr-1",type:"checkbox",checked:o,onChange:w=>i(w.currentTarget.checked)}),"Enable sound"]})]}),d?.custom&&n.jsx("div",{className:"mt-2 flex justify-center text-xs",children:d.name}),n.jsx("div",{className:"mt-2 flex justify-center text-xs",children:n.jsx(jn,{selectedName:d?.name,onCartridgeLoad:E})}),n.jsx("div",{className:"mt-2 flex text-center justify-center text-xs",children:n.jsxs("div",{children:[n.jsx("p",{children:"Select one of the available demos or upload your custom *.gb file and press Run"}),n.jsxs("p",{children:["The test ROMs are available in"," ",n.jsx(ie,{className:"underline",to:"/debug",children:"debug mode"}),". You can see the test results"," ",n.jsx(ie,{className:"underline",to:"/test-results",children:"here"}),"."]})]})})]})})}):n.jsx(Ze,{})}export{Pn as Play,Pn as default};
