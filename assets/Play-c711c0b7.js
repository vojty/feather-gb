import{c as Ke,r as g,j as n,_ as Ze,Z as Ve,s as f,C as se,u as Ye,F as Je,a as Xe,L as ge}from"./index-61799490.js";import{_ as qe}from"./__vite-plugin-wasm-helper-2f5b93cf.js";import{r as Qe}from"./romsList-6ed61065.js";var ie={},Q={},ue={},S={},N={};Object.defineProperty(N,"__esModule",{value:!0});N.isBrowser=void 0;N.isBrowser=function(){return typeof window<"u"&&typeof window.document<"u"};Object.defineProperty(S,"__esModule",{value:!0});S.storage=S.MemoryStorageProxy=S.LocalStorageProxy=S.localStorageAvailable=void 0;var et=N;function ye(){try{var e="@rehooks/local-storage:"+new Date().toISOString();return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(t){return et.isBrowser()&&t instanceof DOMException&&(t.code===22||t.code===1014||t.name==="QuotaExceededError"||t.name==="NS_ERROR_DOM_QUOTA_REACHED")&&localStorage&&localStorage.length!==0}}S.localStorageAvailable=ye;var Se=function(){function e(){}return e.prototype.getItem=function(t){return localStorage.getItem(t)},e.prototype.setItem=function(t,r){localStorage.setItem(t,r)},e.prototype.removeItem=function(t){localStorage.removeItem(t)},e}();S.LocalStorageProxy=Se;var je=function(){function e(){this._memoryStorage=new Map}return e.prototype.getItem=function(t){var r;return(r=this._memoryStorage.get(t))!==null&&r!==void 0?r:null},e.prototype.setItem=function(t,r){this._memoryStorage.set(t,r)},e.prototype.removeItem=function(t){this._memoryStorage.delete(t)},e}();S.MemoryStorageProxy=je;var tt=function(e){return e?new Se:new je};S.storage=tt(ye());(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.deleteFromStorage=e.writeStorage=e.isTypeOfLocalStorageChanged=e.LOCAL_STORAGE_CHANGE_EVENT_NAME=void 0;var t=S,r=N;e.LOCAL_STORAGE_CHANGE_EVENT_NAME="onLocalStorageChange",function(){if(!r.isBrowser()||typeof Ke.window.CustomEvent=="function")return;function a(d,l){var w,h;l===void 0&&(l={bubbles:!1,cancelable:!1});var b=document.createEvent("CustomEvent");return b.initCustomEvent(d,(w=l?.bubbles)!==null&&w!==void 0?w:!1,(h=l?.cancelable)!==null&&h!==void 0?h:!1,l?.detail),b}window.CustomEvent=a}();function i(a){return!!a&&a.type===e.LOCAL_STORAGE_CHANGE_EVENT_NAME}e.isTypeOfLocalStorageChanged=i;function s(a,d){if(r.isBrowser())try{t.storage.setItem(a,typeof d=="object"?JSON.stringify(d):""+d),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:a,value:d}}))}catch(l){throw l instanceof TypeError&&l.message.includes("circular structure")?new TypeError(`The object that was given to the writeStorage function has circular references.
For more information, check here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value`):l}}e.writeStorage=s;function u(a){r.isBrowser()&&(t.storage.removeItem(a),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:a,value:null}})))}e.deleteFromStorage=u})(ue);Object.defineProperty(Q,"__esModule",{value:!0});Q.useLocalStorage=void 0;var L=ue,nt=N,te=S,R=g;function we(e){try{return JSON.parse(e)}catch{return e}}function rt(e,t){t===void 0&&(t=null);var r=R.useState(te.storage.getItem(e)===null?t:we(te.storage.getItem(e))),i=r[0],s=r[1],u=R.useCallback(function(w){L.isTypeOfLocalStorageChanged(w)?w.detail.key===e&&s(w.detail.value):w.key===e&&s(w.newValue===null?null:we(w.newValue))},[s,e]);R.useEffect(function(){if(nt.isBrowser()){var w=function(h){u(h)};return window.addEventListener(L.LOCAL_STORAGE_CHANGE_EVENT_NAME,w),window.addEventListener("storage",w),te.storage.getItem(e)===null&&t!==null&&L.writeStorage(e,t),function(){window.removeEventListener(L.LOCAL_STORAGE_CHANGE_EVENT_NAME,w),window.removeEventListener("storage",w)}}},[e,t,u]);var a=R.useCallback(function(w){return L.writeStorage(e,w)},[e]),d=R.useCallback(function(){return L.deleteFromStorage(e)},[e]),l=i??t;return[l,a,d]}Q.useLocalStorage=rt;(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.useLocalStorage=void 0;var t=Q;Object.defineProperty(e,"useLocalStorage",{enumerable:!0,get:function(){return t.useLocalStorage}});var r=ue;Object.defineProperty(e,"writeStorage",{enumerable:!0,get:function(){return r.writeStorage}}),Object.defineProperty(e,"deleteFromStorage",{enumerable:!0,get:function(){return r.deleteFromStorage}}),e.default=t.useLocalStorage})(ie);const ot="/feather-gb/assets/gb_web_bg-9eacdbbc.wasm";let p;function Ae(e){p=e}const y=new Array(128).fill(void 0);y.push(void 0,null,!0,!1);function T(e){return y[e]}let P=y.length;function z(e){P===y.length&&y.push(y.length+1);const t=P;return P=y[t],y[t]=e,t}function st(e){e<132||(y[e]=P,P=e)}function it(e){const t=T(e);return st(e),t}function ce(e){const t=typeof e;if(t=="number"||t=="boolean"||e==null)return`${e}`;if(t=="string")return`"${e}"`;if(t=="symbol"){const s=e.description;return s==null?"Symbol":`Symbol(${s})`}if(t=="function"){const s=e.name;return typeof s=="string"&&s.length>0?`Function(${s})`:"Function"}if(Array.isArray(e)){const s=e.length;let u="[";s>0&&(u+=ce(e[0]));for(let a=1;a<s;a++)u+=", "+ce(e[a]);return u+="]",u}const r=/\[object ([^\]]+)\]/.exec(toString.call(e));let i;if(r.length>1)i=r[1];else return toString.call(e);if(i=="Object")try{return"Object("+JSON.stringify(e)+")"}catch{return"Object"}return e instanceof Error?`${e.name}: ${e.message}
${e.stack}`:i}let O=0,H=null;function M(){return(H===null||H.byteLength===0)&&(H=new Uint8Array(p.memory.buffer)),H}const ct=typeof TextEncoder>"u"?(0,module.require)("util").TextEncoder:TextEncoder;let V=new ct("utf-8");const at=typeof V.encodeInto=="function"?function(e,t){return V.encodeInto(e,t)}:function(e,t){const r=V.encode(e);return t.set(r),{read:e.length,written:r.length}};function ve(e,t,r){if(r===void 0){const d=V.encode(e),l=t(d.length);return M().subarray(l,l+d.length).set(d),O=d.length,l}let i=e.length,s=t(i);const u=M();let a=0;for(;a<i;a++){const d=e.charCodeAt(a);if(d>127)break;u[s+a]=d}if(a!==i){a!==0&&(e=e.slice(a)),s=r(s,i,i=a+e.length*3);const d=M().subarray(s+a,s+i),l=at(e,d);a+=l.written}return O=a,s}let K=null;function J(){return(K===null||K.byteLength===0)&&(K=new Int32Array(p.memory.buffer)),K}const lt=typeof TextDecoder>"u"?(0,module.require)("util").TextDecoder:TextDecoder;let Ee=new lt("utf-8",{ignoreBOM:!0,fatal:!0});Ee.decode();function $e(e,t){return Ee.decode(M().subarray(e,e+t))}function ut(e,t){const r=t(e.length*1);return M().set(e,r/1),O=e.length,r}function dt(){return p.get_audio_buffer_size()>>>0}function ft(e,t){if(!(e instanceof t))throw new Error(`expected instance of ${t.name}`);return e.ptr}let U=128;function pe(e){if(U==1)throw new Error("out of js stack");return y[--U]=e,U}function _t(){p.init()}function gt(e,t){try{return e.apply(this,t)}catch(r){p.__wbindgen_exn_store(z(r))}}const _=Object.freeze({ArrowDown:0,0:"ArrowDown",ArrowLeft:1,1:"ArrowLeft",ArrowRight:2,2:"ArrowRight",ArrowUp:3,3:"ArrowUp",A:4,4:"A",B:5,5:"B",Start:6,6:"Start",Select:7,7:"Select"});class W{static __wrap(t){const r=Object.create(W.prototype);return r.ptr=t,r}__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const t=this.__destroy_into_raw();p.__wbg_webcartridge_free(t)}constructor(t){const r=ut(t,p.__wbindgen_malloc),i=O,s=p.webcartridge_new(r,i);return W.__wrap(s)}}class X{static __wrap(t){const r=Object.create(X.prototype);return r.ptr=t,r}__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const t=this.__destroy_into_raw();p.__wbg_webemulator_free(t)}constructor(t,r){try{ft(t,W);var i=t.__destroy_into_raw();const s=p.webemulator_new(i,pe(r));return X.__wrap(s)}finally{y[U++]=void 0}}run_frame(){p.webemulator_run_frame(this.ptr)}get_canvas_data_pointer(){return p.webemulator_get_canvas_data_pointer(this.ptr)}on_key_down(t){p.webemulator_on_key_down(this.ptr,t)}on_key_up(t){p.webemulator_on_key_up(this.ptr,t)}set_audio_buffer_callback(t){try{p.webemulator_set_audio_buffer_callback(this.ptr,pe(t))}finally{y[U++]=void 0}}}function Te(e){const t=T(e);return z(t)}function Ce(){const e=new Error;return z(e)}function Le(e,t){const r=T(t).stack,i=ve(r,p.__wbindgen_malloc,p.__wbindgen_realloc),s=O;J()[e/4+1]=s,J()[e/4+0]=i}function Oe(e,t){try{console.error($e(e,t))}finally{p.__wbindgen_free(e,t)}}function Ne(e){it(e)}function Be(e){return z(e)}function Re(){return gt(function(e,t,r){const i=T(e).call(T(t),T(r));return z(i)},arguments)}function De(e,t){const r=ce(T(t)),i=ve(r,p.__wbindgen_malloc,p.__wbindgen_realloc),s=O;J()[e/4+1]=s,J()[e/4+0]=i}function Ie(e,t){throw new Error($e(e,t))}URL=globalThis.URL;const m=await qe({"./gb_web_bg.js":{__wbindgen_object_clone_ref:Te,__wbg_new_abda76e883ba8a5f:Ce,__wbg_stack_658279fe44541cf6:Le,__wbg_error_f851667af71bcfc6:Oe,__wbindgen_object_drop_ref:Ne,__wbindgen_number_new:Be,__wbg_call_9495de66fdbe016b:Re,__wbindgen_debug_string:De,__wbindgen_throw:Ie}},ot),de=m.memory,wt=m.__wbg_webcartridge_free,pt=m.webcartridge_new,bt=m.get_audio_buffer_size,mt=m.__wbg_webemulator_free,ht=m.webemulator_new,xt=m.webemulator_run_frame,yt=m.webemulator_get_canvas_data_pointer,St=m.webemulator_on_key_down,jt=m.webemulator_on_key_up,At=m.webemulator_set_audio_buffer_callback,vt=m.init,Et=m.__wbindgen_malloc,$t=m.__wbindgen_realloc,Tt=m.__wbindgen_free,Ct=m.__wbindgen_exn_store,Lt=Object.freeze(Object.defineProperty({__proto__:null,__wbg_webcartridge_free:wt,__wbg_webemulator_free:mt,__wbindgen_exn_store:Ct,__wbindgen_free:Tt,__wbindgen_malloc:Et,__wbindgen_realloc:$t,get_audio_buffer_size:bt,init:vt,memory:de,webcartridge_new:pt,webemulator_get_canvas_data_pointer:yt,webemulator_new:ht,webemulator_on_key_down:St,webemulator_on_key_up:jt,webemulator_run_frame:xt,webemulator_set_audio_buffer_callback:At},Symbol.toStringTag,{value:"Module"})),fe=g.createContext({input:[],onKeyDown:()=>{},onKeyUp:()=>{}});function Ot({children:e}){const[t,r]=g.useState([]),i=g.useCallback(u=>{r(a=>a.filter(d=>u!==d))},[]),s=g.useCallback(u=>{r(a=>a.includes(u)?a:[...a,u])},[]);return n.jsx(fe.Provider,{value:{input:t,onKeyUp:i,onKeyDown:s},children:e})}Ae(Lt);const Nt=Object.freeze(Object.defineProperty({__proto__:null,JsKeys:_,WebCartridge:W,WebEmulator:X,__wbg_call_9495de66fdbe016b:Re,__wbg_error_f851667af71bcfc6:Oe,__wbg_new_abda76e883ba8a5f:Ce,__wbg_set_wasm:Ae,__wbg_stack_658279fe44541cf6:Le,__wbindgen_debug_string:De,__wbindgen_number_new:Be,__wbindgen_object_clone_ref:Te,__wbindgen_object_drop_ref:Ne,__wbindgen_throw:Ie,get_audio_buffer_size:dt,init:_t},Symbol.toStringTag,{value:"Module"})),ne={ArrowDown:_.ArrowDown,ArrowUp:_.ArrowUp,ArrowLeft:_.ArrowLeft,ArrowRight:_.ArrowRight,KeyD:_.ArrowRight,KeyA:_.ArrowLeft,KeyW:_.ArrowUp,KeyS:_.ArrowDown,KeyJ:_.A,KeyX:_.A,KeyK:_.B,KeyC:_.B,KeyB:_.Start,KeyN:_.Select};function Bt(){const{onKeyDown:e,onKeyUp:t,input:r}=g.useContext(fe),i=g.useRef();return g.useEffect(()=>{Object.values(ne).forEach(u=>{r.includes(u)?i.current?.on_key_down(u):i.current?.on_key_up(u)})},[r]),g.useEffect(()=>{const u=d=>{const l=ne[d.code];l!==void 0&&e(l)},a=d=>{const l=ne[d.code];l!==void 0&&t(l)};return window.addEventListener("keydown",u),window.addEventListener("keyup",a),()=>{window.removeEventListener("keydown",u),window.removeEventListener("keyup",a)}},[]),g.useCallback(u=>{i.current=u},[])}function Rt(){const[e,t]=g.useState(null);return g.useEffect(()=>{Ze(()=>Promise.resolve().then(()=>Nt),void 0).then(r=>{r.init(),t(r)}).catch(console.error)},[]),e}let be=!1;function Dt(e){if(be)return;be=!0;const t=e.createBuffer(1,1,e.sampleRate),r=e.createBufferSource();r.buffer=t,r.connect(e.destination),r.start(0),e.resume()}function me(e,t,r=1){if(r>0&&e>=t||r<0&&e<=t)return[];const i=[];for(let s=e;r>0?s<t:s>t;s+=r)i.push(s);return i}function It(e){return fetch(e).then(t=>t.arrayBuffer()).then(t=>new Uint8Array(t))}function kt(){return g.useContext(fe)}function Pt(){return Ve()}const ke=45,Pe=23,Me=6,re=9,Mt=20,Ut=13,Y=36,Ue=25,q=26,Ft="#393C81",Wt="#8A205E";function o(e){return t=>`${t.theme.zoom*e}px`}function _e(){return se`
    filter: brightness(80%);
  `}const zt=f.div`
  display: flex;
  justify-content: center;
`,Gt=f.div`
  display: inline-block;
  margin: 10px;
  background: #eee;
  border-radius: 10px 10px 60px 10px;
  box-shadow: 5px 5px rgba(0, 0, 0, 0.1);
  padding: ${o(20)};
  color: ${Ft};
  position: relative;
`,Ht=f.div`
  background-color: #777;
  border-radius: ${o(7)} ${o(7)} ${o(40)} ${o(7)};
  box-shadow: inset 0px 0px 20px 0px rgba(0, 0, 0, 0.66);
`,Kt=f.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${o(Pe)};
  font-size: ${o(Me)};
  font-family: Arial;
  color: #b3b3b3;
  padding: 0 ${o(8)} 0;
`,Zt=f.div`
  flex: 0 0 auto;
  margin: 0 ${o(5)};
`,Vt=f.div`
  display: flex;
  margin-right: ${o(ke)};
  padding-bottom: ${o(Pe)};
`,Yt=f.div`
  flex: 1 1 ${e=>e.width};
  height: ${o(3)};
  background-color: #8b1d90;
  box-shadow: 0 ${o(2*3)} 0 #283593;
  margin-top: -${o(2*3)};
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
`,qt=f.div`
  background-color: ${e=>e.enabled?"#f00":"#000"};
  box-shadow: 0 0 3px 1px #ef5350;
  height: ${o(re)};
  width: ${o(re)};
  border-radius: ${e=>e.theme.zoom*re/2}px;
  margin: 10px 20px 10px 10px;
  box-shadow: inset 0px 0px 5px 0px rgba(0, 0, 0, 0.66);
`,Qt=f.div`
  font-family: Arial;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #b3b3b3;
  width: ${o(ke)};
  font-size: ${o(Me)};
  margin-bottom: 80px;
`,en=f.div`
  letter-spacing: 1px;
  font-size: ${o(Ut)};
`,tn=f.div`
  margin-left: ${o(2)};
  font-size: ${o(Mt)};
`,nn=f.div`
  font-size: ${o(6)};
`,rn=f.div`
  background-color: ${Wt};
  height: ${o(Y)};
  width: ${o(Y)};
  border-radius: ${o(Y/2)};

  ${e=>e.$pressed&&_e()}
`,on=f.div`
  position: relative;
`,sn=f.div`
  font-size: ${o(12)};
  letter-spacing: ${o(1)};
`,Fe=f(sn)`
  margin-top: ${e=>o(e.$spacing)};
`,cn=f.div`
  display: inline-flex;
  margin-top: ${o(10)};
  margin-right: -${o(12)};
  transform: rotate(-${Ue}deg);
  padding: ${o(5)};

  background-color: #dfdfdf;
  box-shadow: 0 0 0 5px #dfdfdf;
  border-radius: ${o(Y)};

  > * + * {
    margin-left: ${o(18)};
  }

  ${Fe} {
    bottom: -${o(25)};
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
  }
`,ae=f.div`
  transform: rotate(-${Ue}deg);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`,an=f.div`
  border-radius: ${o((9+2*5)/2)};
  background-color: #dfdfdf;
  padding: ${o(5)};
`,ln=f.div`
  background-color: #868a8d;
  width: ${o(38)};
  height: ${o(9)};
  border-radius: ${o(9/2)};
  ${e=>e.$pressed&&_e()}
`,un=f.div`
  display: flex;
  margin-left: ${o(80)};
  margin-top: ${o(30)};
  margin-bottom: ${o(40)};
  ${ae} + ${ae} {
    margin-left: ${o(7)};
  }
`,dn=f.div``;var k=(e=>(e[e.HORIZONTAL=0]="HORIZONTAL",e[e.VERTICAL=1]="VERTICAL",e))(k||{});const fn=f.div`
  display: flex;
  justify-content: center;
`,We=f.div`
  width: ${o(2)};
  height: 80%;
  background-color: #353535;
  margin: ${o(2)};
  border-radius: ${o(5)};
`,ze=f.div`
  position: relative;
  height: ${o(q)};
  width: ${o(q)};
  background-color: #1b1d1d;
`,ee=f(ze)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${e=>e.$orientation===1?"row":"column"};

  ${We} {
    ${e=>e.$pressed&&_e()}

    ${e=>e.$orientation===1?se`
            width: ${o(3)};
            height: 60%;
          `:se`
            height: ${o(3)};
            width: 60%;
          `};
  }
`,_n=f(ee)`
  border-radius: ${o(5)} 0 0 ${o(5)};
`,gn=f(ee)`
  border-radius: ${o(5)} ${o(5)} 0 0;
`,wn=f(ee)`
  border-radius: 0 ${o(5)} ${o(5)} 0;
`,pn=f(ee)`
  border-radius: 0 0 ${o(5)} ${o(5)};
`,bn=f(ze)`
  &:before {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: ${o(q-7)};
    width: ${o(q-7)};
    background-color: #353535;
    border-radius: 100%;
  }
`,mn=f.div`
  display: flex;
  margin-top: ${o(35)};
`,le=f.div`
  height: ${o(48)};
  width: ${o(5)};
  background-color: #a7a49f;
  border-radius: ${o(5)};
  box-shadow: inset 0px 0px 5px 0px rgb(95 95 95 / 66%);
`,hn=f.div`
  display: inline-flex;
  transform: rotate(-28deg);
  position: absolute;
  bottom: ${o(19)};
  right: ${o(15)};

  ${le} + ${le} {
    margin-left: ${o(8)};
  }
`,c={Wrapper:zt,Device:Gt,Display:Ht,DisplayTop:Kt,DisplayHeaderText:Zt,DisplayContent:Vt,DisplayLine:Yt,Screen:Jt,ScreenOverlay:Xt,Battery:Qt,BatteryIndicator:qt,NintendoText:en,GameBoyText:tn,TradeMarkText:nn,Controls:mn,ButtonsAB:cn,CircleButtonWrapper:on,CircleButton:rn,ButtonText:Fe,ButtonsStartSelect:un,WideButton:ln,WideButtonWrapper:an,WideButtonContainer:ae,Arrows:dn,ArrowsLine:fn,ArrowUp:gn,ArrowDown:pn,ArrowLeft:_n,ArrowRight:wn,ArrowCenter:bn,ArrowStripe:We,Speakers:hn,Speaker:le};function xn(e){return n.jsxs(c.Display,{children:[n.jsxs(c.DisplayTop,{children:[n.jsx(c.DisplayLine,{width:"25%"}),n.jsx(c.DisplayHeaderText,{children:"DOT MATRIX WITH STEREO SOUND"}),n.jsx(c.DisplayLine,{width:"12%"})]}),n.jsxs(c.DisplayContent,{children:[n.jsxs(c.Battery,{children:[n.jsx(c.BatteryIndicator,{enabled:e.enabled}),"BATTERY"]}),n.jsxs(c.Screen,{children:[e.children,n.jsx(c.ScreenOverlay,{})]})]})]})}const $=160,F=144;function yn({running:e},t){const{zoom:r}=Pt(),{input:i,onKeyDown:s,onKeyUp:u}=kt(),a=i.includes(_.A),d=i.includes(_.B),l=i.includes(_.Start),w=i.includes(_.Select),h=i.includes(_.ArrowLeft),b=i.includes(_.ArrowRight),j=i.includes(_.ArrowUp),C=i.includes(_.ArrowDown);return n.jsx(c.Wrapper,{children:n.jsxs(c.Device,{children:[n.jsx(xn,{enabled:e,children:n.jsx("canvas",{ref:t,style:{display:"block",imageRendering:"pixelated",zoom:r},height:F,width:$})}),n.jsxs("div",{className:"flex items-baseline",children:[n.jsx(c.NintendoText,{className:"font-pretendo",children:"Nintendo"}),n.jsx(c.GameBoyText,{className:"font-gills-sans font-medium italic",children:"GAME BOY"}),n.jsx(c.TradeMarkText,{className:"font-bold",children:"TM"})]}),n.jsxs(c.Controls,{children:[n.jsxs(c.Arrows,{children:[n.jsx(c.ArrowsLine,{children:n.jsxs(c.ArrowUp,{onPointerDown:()=>s(_.ArrowUp),onPointerUp:()=>u(_.ArrowUp),$orientation:k.HORIZONTAL,$pressed:j,children:[n.jsx(c.ArrowStripe,{}),n.jsx(c.ArrowStripe,{}),n.jsx(c.ArrowStripe,{})]})}),n.jsxs(c.ArrowsLine,{children:[n.jsxs(c.ArrowLeft,{onPointerDown:()=>s(_.ArrowLeft),onPointerUp:()=>u(_.ArrowLeft),$orientation:k.VERTICAL,$pressed:h,children:[n.jsx(c.ArrowStripe,{}),n.jsx(c.ArrowStripe,{}),n.jsx(c.ArrowStripe,{})]}),n.jsx(c.ArrowCenter,{}),n.jsxs(c.ArrowRight,{onPointerDown:()=>s(_.ArrowRight),onPointerUp:()=>u(_.ArrowRight),$orientation:k.VERTICAL,$pressed:b,children:[n.jsx(c.ArrowStripe,{}),n.jsx(c.ArrowStripe,{}),n.jsx(c.ArrowStripe,{})]})]}),n.jsx(c.ArrowsLine,{children:n.jsxs(c.ArrowDown,{onPointerDown:()=>s(_.ArrowDown),onPointerUp:()=>u(_.ArrowDown),$orientation:k.HORIZONTAL,$pressed:C,children:[n.jsx(c.ArrowStripe,{}),n.jsx(c.ArrowStripe,{}),n.jsx(c.ArrowStripe,{})]})})]}),n.jsx("div",{className:"ml-auto",children:n.jsxs(c.ButtonsAB,{className:" font-nes",children:[n.jsxs(c.CircleButtonWrapper,{children:[n.jsx(c.CircleButton,{onPointerDown:()=>s(_.B),onPointerUp:()=>u(_.B),$pressed:d}),n.jsx(c.ButtonText,{$spacing:10,children:"B"})]}),n.jsxs(c.CircleButtonWrapper,{children:[n.jsx(c.CircleButton,{onPointerDown:()=>s(_.A),onPointerUp:()=>u(_.A),$pressed:a}),n.jsx(c.ButtonText,{$spacing:10,children:"A"})]})]})})]}),n.jsxs(c.ButtonsStartSelect,{className:"font-nes",children:[n.jsxs(c.WideButtonContainer,{children:[n.jsx(c.WideButtonWrapper,{children:n.jsx(c.WideButton,{onPointerDown:()=>s(_.Select),onPointerUp:()=>u(_.Select),$pressed:w})}),n.jsx(c.ButtonText,{$spacing:1,children:"SELECT"})]}),n.jsxs(c.WideButtonContainer,{children:[n.jsx(c.WideButtonWrapper,{children:n.jsx(c.WideButton,{onPointerDown:()=>s(_.Start),onPointerUp:()=>u(_.Start),$pressed:l})}),n.jsx(c.ButtonText,{$spacing:1,children:"START"})]})]}),n.jsxs(c.Speakers,{children:[n.jsx(c.Speaker,{}),n.jsx(c.Speaker,{}),n.jsx(c.Speaker,{}),n.jsx(c.Speaker,{}),n.jsx(c.Speaker,{}),n.jsx(c.Speaker,{})]})]})})}const Sn=g.forwardRef(yn),jn="12px",Z={Icon:f.div`
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
  `};function An(e){const{zoom:t,onChange:r}=e;return n.jsxs(Z.Wrapper,{children:[n.jsx(Z.Icon,{children:n.jsx("button",{type:"button",onClick:()=>r(Math.max(1,t-.5)),children:"-"})}),n.jsxs(Z.Value,{children:["Zoom: ",t.toFixed(1)]}),n.jsx(Z.Icon,{children:n.jsx("button",{type:"button",onClick:()=>r(Math.min(t+.5,5)),children:"+"})})]})}const vn=f.div`
  cursor: pointer;
`;function En(){const e=Ye();return n.jsx(vn,{onClick:()=>e(-1),children:"←"})}const Ge=Qe.filter(e=>["demos/cgb-acid2.gbc","demos/dmg-acid2.gb","demos/gejmboj.gb","demos/oh.gb","demos/opus5.gb","demos/pocket.gb"].includes(e.name)),$n=Ge.find(e=>e.name==="demos/oh.gb")||null;function Tn(e){const t=g.useCallback(r=>{r&&It(r.url).then(i=>e.onCartridgeLoad({name:r.name,bytes:i}))},[]);return g.useEffect(()=>{t($n)},[t]),n.jsx("table",{children:n.jsx("tbody",{children:Ge.map(r=>n.jsxs("tr",{className:e.selectedName===r.name?"font-medium underline":"",children:[n.jsx("td",{className:"px-1",children:r.name}),n.jsx("td",{className:"px-1",children:n.jsx("button",{type:"button",onClick:()=>t(r),children:"Load"})})]},r.url))})})}const Cn=12,oe=20,he=30,Ln=64,On=f.span`
  font-size: ${Cn}px;
`,Nn=f.canvas`
  display: inline-block;
`,D=[];function Bn(){const e=g.useRef(window.performance.now()),t=g.useRef(null),r=g.useRef(0);return g.useEffect(()=>{function i(){r.current=window.requestAnimationFrame(()=>{const s=window.performance.now(),u=s-e.current;e.current=s;const a=Math.round(1e3/u);D.push(a),D.length>Ln&&D.shift();const d=Math.round(D.reduce((w,h)=>w+h)/D.length),l=t.current?.getContext("2d");l&&(l.clearRect(0,0,he,oe),l.textBaseline="middle",l.font="12px Arial",l.fillText(d.toString(),1,oe/2+1)),i()})}return i(),()=>window.cancelAnimationFrame(r.current)},[]),n.jsxs(On,{className:"flex items-center justify-end",children:["Average FPS: ",n.jsx(Nn,{width:he,height:oe,ref:t})]})}function Rn(e){const{onLoad:t,className:r,children:i}=e,s=u=>{const{files:a}=u.currentTarget;if(!a)return;const d=a[0];d.arrayBuffer().then(l=>new Uint8Array(l)).then(l=>t({name:`Custom: ${d.name}`,bytes:l,custom:!0}))};return n.jsxs(n.Fragment,{children:[n.jsx("input",{onChange:s,accept:".gb,.gbc",style:{display:"none"},id:"file",multiple:!0,type:"file"}),n.jsx("label",{className:r,htmlFor:"file",children:i})]})}const Dn=1.5,In="#6D7C00",A=new AudioContext({sampleRate:44100});function kn(e,t){const r=e.get_canvas_data_pointer(),i=t.createImageData($,F),s=new Uint8Array(de.buffer,r,$*F*3);me(0,F).forEach(u=>{me(0,$).forEach(a=>{const d=(u*$+a)*3,l=(u*$+a)*4;i.data[l]=s[d],i.data[l+1]=s[d+1],i.data[l+2]=s[d+2],i.data[l+3]=255})}),t.putImageData(i,0,0)}function xe(e){e.fillStyle=In,e.fillRect(0,0,$,F)}const I=2;function Pn(e){const{bytes:t,wasmModule:r,running:i,ctx:s,soundEnabled:u}=e,a=g.useRef(),d=g.useRef(0),l=g.useRef(0),w=Bt();g.useEffect(()=>{xe(s)},[s]);const h=g.useCallback(b=>{const j=r.get_audio_buffer_size(),C=new Float32Array(de.buffer,b,j),B=C.length/I,x=A.createBuffer(I,B,A.sampleRate);for(let E=0;E<I;E+=1){const He=x.getChannelData(E);for(let G=0;G<B;G+=1)He[G]=C[G*I+E]}const v=A.createBufferSource();v.buffer=x,v.connect(A.destination),d.current<=A.currentTime+.02&&(d.current=A.currentTime+.06),v.start(d.current),d.current+=j/I/A.sampleRate},[]);return g.useEffect(()=>{if(!t)return;const b=new r.WebCartridge(t);d.current=0,a.current=new r.WebEmulator(b,()=>{}),xe(s),w(a.current)},[t,r,w]),g.useEffect(()=>{const b=a.current;b&&b.set_audio_buffer_callback(u?h:()=>{})},[a.current,u,h]),g.useEffect(()=>{const b=a.current;if(b)if(i){const j=()=>{b.run_frame(),kn(b,s),l.current=window.requestAnimationFrame(j)};j()}else window.cancelAnimationFrame(l.current)},[i]),null}function Wn(){const[e,t]=ie.useLocalStorage("zoom",Dn),[r,i]=ie.useLocalStorage("sound_enabled",!1),[s,u]=g.useState(!1),[a,d]=g.useState(),[l,w]=g.useState(null),h={zoom:e},b=Rt(),j=()=>{Dt(A),u(x=>x?!1:!!(!x&&l))},C=g.useCallback(x=>{x&&d(v=>{if(v)return v;const E=x.getContext("2d");return E||v})},[]),B=x=>{u(!1),w(x)};return b?n.jsx("div",{className:"select-none",children:n.jsx(Ot,{children:n.jsxs(Xe,{theme:h,children:[n.jsxs("div",{className:"grid grid-cols-3 justify-between items-center mx-2 pt-2",children:[n.jsx(En,{}),n.jsx(An,{zoom:e,onChange:t}),n.jsx("div",{className:"justify-end",children:n.jsx(Bn,{})})]}),n.jsx(Sn,{running:s,ref:C}),a&&n.jsx(Pn,{bytes:l?.bytes,wasmModule:b,running:s,soundEnabled:r,ctx:a}),n.jsxs("div",{className:"mt-2 flex justify-center items-center text-xs",children:[n.jsx("button",{className:"mx-2 border rounded px-1 py-1",type:"button",onClick:j,children:s?"Stop":"Run"}),n.jsx(Rn,{className:"mx-2 border rounded px-1 py-1",onLoad:B,children:"Upload ROM"}),n.jsxs("label",{className:"flex justify-center items-center",htmlFor:"soundEnableCheckbox",children:[n.jsx("input",{id:"soundEnableCheckbox",className:"mr-1",type:"checkbox",checked:r,onChange:x=>i(x.currentTarget.checked)}),"Enable sound"]})]}),l?.custom&&n.jsx("div",{className:"mt-2 flex justify-center text-xs",children:l.name}),n.jsx("div",{className:"mt-2 flex justify-center text-xs",children:n.jsx(Tn,{selectedName:l?.name,onCartridgeLoad:B})}),n.jsx("div",{className:"mt-2 flex text-center justify-center text-xs",children:n.jsxs("div",{children:[n.jsx("p",{children:"Select one of the available demos or upload your custom *.gb file and press Run"}),n.jsxs("p",{children:["The test ROMs are available in"," ",n.jsx(ge,{className:"underline",to:"/debug",children:"debug mode"}),". You can see the test results"," ",n.jsx(ge,{className:"underline",to:"/test-results",children:"here"}),"."]})]})})]})})}):n.jsx(Je,{})}export{Wn as Play,Wn as default};
