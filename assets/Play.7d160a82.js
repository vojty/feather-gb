import{c as Me,r as g,j as r,_ as Ue,Z as Fe,s as f,C as ie,a as _,u as We,F as Ge,b as He,d as ze,L as ge}from"./index.40dd6035.js";import{_ as Ke}from"./__vite-plugin-wasm-helper.61b72c6d.js";import{r as Ze}from"./romsList.5b5dfa84.js";var se={},J={},de={},A={},B={};Object.defineProperty(B,"__esModule",{value:!0});B.isBrowser=void 0;B.isBrowser=function(){return typeof window<"u"&&typeof window.document<"u"};Object.defineProperty(A,"__esModule",{value:!0});A.storage=A.MemoryStorageProxy=A.LocalStorageProxy=A.localStorageAvailable=void 0;var Ve=B;function xe(){try{var e="@rehooks/local-storage:"+new Date().toISOString();return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(t){return Ve.isBrowser()&&t instanceof DOMException&&(t.code===22||t.code===1014||t.name==="QuotaExceededError"||t.name==="NS_ERROR_DOM_QUOTA_REACHED")&&localStorage&&localStorage.length!==0}}A.localStorageAvailable=xe;var ve=function(){function e(){}return e.prototype.getItem=function(t){return localStorage.getItem(t)},e.prototype.setItem=function(t,n){localStorage.setItem(t,n)},e.prototype.removeItem=function(t){localStorage.removeItem(t)},e}();A.LocalStorageProxy=ve;var Ee=function(){function e(){this._memoryStorage=new Map}return e.prototype.getItem=function(t){var n;return(n=this._memoryStorage.get(t))!==null&&n!==void 0?n:null},e.prototype.setItem=function(t,n){this._memoryStorage.set(t,n)},e.prototype.removeItem=function(t){this._memoryStorage.delete(t)},e}();A.MemoryStorageProxy=Ee;var Ye=function(e){return e?new ve:new Ee};A.storage=Ye(xe());(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.deleteFromStorage=e.writeStorage=e.isTypeOfLocalStorageChanged=e.LOCAL_STORAGE_CHANGE_EVENT_NAME=void 0;var t=A,n=B;e.LOCAL_STORAGE_CHANGE_EVENT_NAME="onLocalStorageChange",function(){if(!n.isBrowser()||typeof Me.window.CustomEvent=="function")return;function a(d,l){var m,h;l===void 0&&(l={bubbles:!1,cancelable:!1});var w=document.createEvent("CustomEvent");return w.initCustomEvent(d,(m=l?.bubbles)!==null&&m!==void 0?m:!1,(h=l?.cancelable)!==null&&h!==void 0?h:!1,l?.detail),w}window.CustomEvent=a}();function s(a){return!!a&&a.type===e.LOCAL_STORAGE_CHANGE_EVENT_NAME}e.isTypeOfLocalStorageChanged=s;function i(a,d){if(!!n.isBrowser())try{t.storage.setItem(a,typeof d=="object"?JSON.stringify(d):""+d),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:a,value:d}}))}catch(l){throw l instanceof TypeError&&l.message.includes("circular structure")?new TypeError(`The object that was given to the writeStorage function has circular references.
For more information, check here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value`):l}}e.writeStorage=i;function u(a){!n.isBrowser()||(t.storage.removeItem(a),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:a,value:null}})))}e.deleteFromStorage=u})(de);Object.defineProperty(J,"__esModule",{value:!0});J.useLocalStorage=void 0;var O=de,Je=B,Q=A,I=g.exports;function me(e){try{return JSON.parse(e)}catch{return e}}function Xe(e,t){t===void 0&&(t=null);var n=I.useState(Q.storage.getItem(e)===null?t:me(Q.storage.getItem(e))),s=n[0],i=n[1],u=I.useCallback(function(m){O.isTypeOfLocalStorageChanged(m)?m.detail.key===e&&i(m.detail.value):m.key===e&&i(m.newValue===null?null:me(m.newValue))},[i,e]);I.useEffect(function(){if(!!Je.isBrowser()){var m=function(h){u(h)};return window.addEventListener(O.LOCAL_STORAGE_CHANGE_EVENT_NAME,m),window.addEventListener("storage",m),Q.storage.getItem(e)===null&&t!==null&&O.writeStorage(e,t),function(){window.removeEventListener(O.LOCAL_STORAGE_CHANGE_EVENT_NAME,m),window.removeEventListener("storage",m)}}},[e,t,u]);var a=I.useCallback(function(m){return O.writeStorage(e,m)},[e]),d=I.useCallback(function(){return O.deleteFromStorage(e)},[e]),l=s??t;return[l,a,d]}J.useLocalStorage=Xe;(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.useLocalStorage=void 0;var t=J;Object.defineProperty(e,"useLocalStorage",{enumerable:!0,get:function(){return t.useLocalStorage}});var n=de;Object.defineProperty(e,"writeStorage",{enumerable:!0,get:function(){return n.writeStorage}}),Object.defineProperty(e,"deleteFromStorage",{enumerable:!0,get:function(){return n.deleteFromStorage}}),e.default=t.useLocalStorage})(se);const qe="/assets/gb_web_bg.50cc450c.wasm",S=new Array(32).fill(void 0);S.push(void 0,null,!0,!1);function C(e){return S[e]}let P=S.length;function W(e){P===S.length&&S.push(S.length+1);const t=P;return P=S[t],S[t]=e,t}function Qe(e){e<36||(S[e]=P,P=e)}function et(e){const t=C(e);return Qe(e),t}function ce(e){const t=typeof e;if(t=="number"||t=="boolean"||e==null)return`${e}`;if(t=="string")return`"${e}"`;if(t=="symbol"){const i=e.description;return i==null?"Symbol":`Symbol(${i})`}if(t=="function"){const i=e.name;return typeof i=="string"&&i.length>0?`Function(${i})`:"Function"}if(Array.isArray(e)){const i=e.length;let u="[";i>0&&(u+=ce(e[0]));for(let a=1;a<i;a++)u+=", "+ce(e[a]);return u+="]",u}const n=/\[object ([^\]]+)\]/.exec(toString.call(e));let s;if(n.length>1)s=n[1];else return toString.call(e);if(s=="Object")try{return"Object("+JSON.stringify(e)+")"}catch{return"Object"}return e instanceof Error?`${e.name}: ${e.message}
${e.stack}`:s}let N=0,ee=new Uint8Array;function M(){return ee.byteLength===0&&(ee=new Uint8Array(X.buffer)),ee}const tt=typeof TextEncoder>"u"?(0,module.require)("util").TextEncoder:TextEncoder;let z=new tt("utf-8");const nt=typeof z.encodeInto=="function"?function(e,t){return z.encodeInto(e,t)}:function(e,t){const n=z.encode(e);return t.set(n),{read:e.length,written:n.length}};function $e(e,t,n){if(n===void 0){const d=z.encode(e),l=t(d.length);return M().subarray(l,l+d.length).set(d),N=d.length,l}let s=e.length,i=t(s);const u=M();let a=0;for(;a<s;a++){const d=e.charCodeAt(a);if(d>127)break;u[i+a]=d}if(a!==s){a!==0&&(e=e.slice(a)),i=n(i,s,s=a+e.length*3);const d=M().subarray(i+a,i+s);a+=nt(e,d).written}return N=a,i}let te=new Int32Array;function Z(){return te.byteLength===0&&(te=new Int32Array(X.buffer)),te}const rt=typeof TextDecoder>"u"?(0,module.require)("util").TextDecoder:TextDecoder;let Te=new rt("utf-8",{ignoreBOM:!0,fatal:!0});Te.decode();function Ce(e,t){return Te.decode(M().subarray(e,e+t))}function ot(e,t){const n=t(e.length*1);return M().set(e,n/1),N=e.length,n}function Mn(){return bt()>>>0}function it(e,t){if(!(e instanceof t))throw new Error(`expected instance of ${t.name}`);return e.ptr}let U=32;function we(e){if(U==1)throw new Error("out of js stack");return S[--U]=e,U}function Un(){$t()}function st(e,t){try{return e.apply(this,t)}catch(n){Ct(W(n))}}const p=Object.freeze({ArrowDown:0,0:"ArrowDown",ArrowLeft:1,1:"ArrowLeft",ArrowRight:2,2:"ArrowRight",ArrowUp:3,3:"ArrowUp",A:4,4:"A",B:5,5:"B",Start:6,6:"Start",Select:7,7:"Select"});class V{static __wrap(t){const n=Object.create(V.prototype);return n.ptr=t,n}__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const t=this.__destroy_into_raw();mt(t)}constructor(t){const n=ot(t,fe),i=wt(n,N);return V.__wrap(i)}}class ae{static __wrap(t){const n=Object.create(ae.prototype);return n.ptr=t,n}__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const t=this.__destroy_into_raw();ht(t)}constructor(t,n){try{it(t,V);var s=t.ptr;t.ptr=0;const i=yt(s,we(n));return ae.__wrap(i)}finally{S[U++]=void 0}}run_frame(){St(this.ptr)}get_canvas_data_pointer(){return At(this.ptr)}on_key_down(t){xt(this.ptr,t)}on_key_up(t){vt(this.ptr,t)}set_audio_buffer_callback(t){try{Et(this.ptr,we(t))}finally{S[U++]=void 0}}}function ct(e){const t=C(e);return W(t)}function at(){const e=new Error;return W(e)}function lt(e,t){const n=C(t).stack,s=$e(n,fe,Le),i=N;Z()[e/4+1]=i,Z()[e/4+0]=s}function ut(e,t){try{console.error(Ce(e,t))}finally{Tt(e,t)}}function dt(e){et(e)}function ft(e){return W(e)}function pt(){return st(function(e,t,n){const s=C(e).call(C(t),C(n));return W(s)},arguments)}function _t(e,t){const n=ce(C(t)),s=$e(n,fe,Le),i=N;Z()[e/4+1]=i,Z()[e/4+0]=s}function gt(e,t){throw new Error(Ce(e,t))}const b=await Ke({"./gb_web_bg.js":{__wbindgen_object_clone_ref:ct,__wbg_new_693216e109162396:at,__wbg_stack_0ddaca5d1abfb52f:lt,__wbg_error_09919627ac0992f5:ut,__wbindgen_object_drop_ref:dt,__wbindgen_number_new:ft,__wbg_call_65af9f665ab6ade5:pt,__wbindgen_debug_string:_t,__wbindgen_throw:gt}},qe),X=b.memory,mt=b.__wbg_webcartridge_free,wt=b.webcartridge_new,bt=b.get_audio_buffer_size,ht=b.__wbg_webemulator_free,yt=b.webemulator_new,St=b.webemulator_run_frame,At=b.webemulator_get_canvas_data_pointer,xt=b.webemulator_on_key_down,vt=b.webemulator_on_key_up,Et=b.webemulator_set_audio_buffer_callback,$t=b.init,fe=b.__wbindgen_malloc,Le=b.__wbindgen_realloc,Tt=b.__wbindgen_free,Ct=b.__wbindgen_exn_store,pe=g.exports.createContext({input:[],onKeyDown:()=>{},onKeyUp:()=>{}});function Lt({children:e}){const[t,n]=g.exports.useState([]),s=g.exports.useCallback(u=>{n(a=>a.filter(d=>u!==d))},[]),i=g.exports.useCallback(u=>{n(a=>a.includes(u)?a:[...a,u])},[]);return r(pe.Provider,{value:{input:t,onKeyUp:s,onKeyDown:i},children:e})}const ne={ArrowDown:p.ArrowDown,ArrowUp:p.ArrowUp,ArrowLeft:p.ArrowLeft,ArrowRight:p.ArrowRight,KeyD:p.ArrowRight,KeyA:p.ArrowLeft,KeyW:p.ArrowUp,KeyS:p.ArrowDown,KeyJ:p.A,KeyX:p.A,KeyK:p.B,KeyC:p.B,KeyB:p.Start,KeyN:p.Select};function Ot(){const{onKeyDown:e,onKeyUp:t,input:n}=g.exports.useContext(pe),s=g.exports.useRef();return g.exports.useEffect(()=>{Object.values(ne).forEach(u=>{n.includes(u)?s.current?.on_key_down(u):s.current?.on_key_up(u)})},[n]),g.exports.useEffect(()=>{const u=d=>{const l=ne[d.code];l!==void 0&&e(l)},a=d=>{const l=ne[d.code];l!==void 0&&t(l)};return window.addEventListener("keydown",u),window.addEventListener("keyup",a),()=>{window.removeEventListener("keydown",u),window.removeEventListener("keyup",a)}},[]),g.exports.useCallback(u=>{s.current=u},[])}function Nt(){const[e,t]=g.exports.useState(null);return g.exports.useEffect(()=>{Ue(()=>import("./gb_web.6e5b26d0.js"),["assets/gb_web.6e5b26d0.js","assets/index.40dd6035.js","assets/index.bdbd3912.css","assets/__vite-plugin-wasm-helper.61b72c6d.js","assets/romsList.5b5dfa84.js"]).then(n=>{n.init(),t(n)}).catch(console.error)},[]),e}let be=!1;function Bt(e){if(be)return;be=!0;const t=e.createBuffer(1,1,e.sampleRate),n=e.createBufferSource();n.buffer=t,n.connect(e.destination),n.start(0),e.resume()}function he(e,t,n=1){if(n>0&&e>=t||n<0&&e<=t)return[];const s=[];for(let i=e;n>0?i<t:i>t;i+=n)s.push(i);return s}function Dt(e){return fetch(e).then(t=>t.arrayBuffer()).then(t=>new Uint8Array(t))}function It(){return g.exports.useContext(pe)}function Rt(){return Fe()}const Oe=45,Ne=23,Be=6,re=9,kt=20,jt=13,K=36,De=25,Y=26,Pt="#393C81",Mt="#8A205E";function o(e){return t=>`${t.theme.zoom*e}px`}function _e(){return ie`
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

  ${e=>e.$pressed&&_e()}
`,tn=f.div`
  position: relative;
`,nn=f.div`
  font-size: ${o(12)};
  letter-spacing: ${o(1)};
`,Ie=f(nn)`
  margin-top: ${e=>o(e.$spacing)};
`,rn=f.div`
  display: inline-flex;
  margin-top: ${o(10)};
  margin-right: -${o(12)};
  transform: rotate(-${De}deg);
  padding: ${o(5)};

  background-color: #dfdfdf;
  box-shadow: 0 0 0 5px #dfdfdf;
  border-radius: ${o(K)};

  > * + * {
    margin-left: ${o(18)};
  }

  ${Ie} {
    bottom: -${o(25)};
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
  }
`,le=f.div`
  transform: rotate(-${De}deg);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`,on=f.div`
  border-radius: ${o((9+2*5)/2)};
  background-color: #dfdfdf;
  padding: ${o(5)};
`,sn=f.div`
  background-color: #868a8d;
  width: ${o(38)};
  height: ${o(9)};
  border-radius: ${o(9/2)};
  ${e=>e.$pressed&&_e()}
`,cn=f.div`
  display: flex;
  margin-left: ${o(80)};
  margin-top: ${o(30)};
  margin-bottom: ${o(40)};
  ${le} + ${le} {
    margin-left: ${o(7)};
  }
`,an=f.div``;var j=(e=>(e[e.HORIZONTAL=0]="HORIZONTAL",e[e.VERTICAL=1]="VERTICAL",e))(j||{});const ln=f.div`
  display: flex;
  justify-content: center;
`,Re=f.div`
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

  ${Re} {
    ${e=>e.$pressed&&_e()}

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
`,pn=f(q)`
  border-radius: 0 0 ${o(5)} ${o(5)};
`,_n=f(ke)`
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
`,gn=f.div`
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
`,c={Wrapper:Ut,Device:Ft,Display:Wt,DisplayTop:Gt,DisplayHeaderText:Ht,DisplayContent:zt,DisplayLine:Kt,Screen:Zt,ScreenOverlay:Vt,Battery:Jt,BatteryIndicator:Yt,NintendoText:Xt,GameBoyText:qt,TradeMarkText:Qt,Controls:gn,ButtonsAB:rn,CircleButtonWrapper:tn,CircleButton:en,ButtonText:Ie,ButtonsStartSelect:cn,WideButton:sn,WideButtonWrapper:on,WideButtonContainer:le,Arrows:an,ArrowsLine:ln,ArrowUp:dn,ArrowDown:pn,ArrowLeft:un,ArrowRight:fn,ArrowCenter:_n,ArrowStripe:Re,Speakers:mn,Speaker:ue};function wn(e){return _(c.Display,{children:[_(c.DisplayTop,{children:[r(c.DisplayLine,{width:"25%"}),r(c.DisplayHeaderText,{children:"DOT MATRIX WITH STEREO SOUND"}),r(c.DisplayLine,{width:"12%"})]}),_(c.DisplayContent,{children:[_(c.Battery,{children:[r(c.BatteryIndicator,{enabled:e.enabled}),"BATTERY"]}),_(c.Screen,{children:[e.children,r(c.ScreenOverlay,{})]})]})]})}const T=160,F=144;function bn({running:e},t){const{zoom:n}=Rt(),{input:s,onKeyDown:i,onKeyUp:u}=It(),a=s.includes(p.A),d=s.includes(p.B),l=s.includes(p.Start),m=s.includes(p.Select),h=s.includes(p.ArrowLeft),w=s.includes(p.ArrowRight),x=s.includes(p.ArrowUp),L=s.includes(p.ArrowDown);return r(c.Wrapper,{children:_(c.Device,{children:[r(wn,{enabled:e,children:r("canvas",{ref:t,style:{display:"block",imageRendering:"pixelated",zoom:n},height:F,width:T})}),_("div",{className:"flex items-baseline",children:[r(c.NintendoText,{className:"font-pretendo",children:"Nintendo"}),r(c.GameBoyText,{className:"font-gills-sans font-medium italic",children:"GAME\xA0BOY"}),r(c.TradeMarkText,{className:"font-bold",children:"TM"})]}),_(c.Controls,{children:[_(c.Arrows,{children:[r(c.ArrowsLine,{children:_(c.ArrowUp,{onPointerDown:()=>i(p.ArrowUp),onPointerUp:()=>u(p.ArrowUp),$orientation:j.HORIZONTAL,$pressed:x,children:[r(c.ArrowStripe,{}),r(c.ArrowStripe,{}),r(c.ArrowStripe,{})]})}),_(c.ArrowsLine,{children:[_(c.ArrowLeft,{onPointerDown:()=>i(p.ArrowLeft),onPointerUp:()=>u(p.ArrowLeft),$orientation:j.VERTICAL,$pressed:h,children:[r(c.ArrowStripe,{}),r(c.ArrowStripe,{}),r(c.ArrowStripe,{})]}),r(c.ArrowCenter,{}),_(c.ArrowRight,{onPointerDown:()=>i(p.ArrowRight),onPointerUp:()=>u(p.ArrowRight),$orientation:j.VERTICAL,$pressed:w,children:[r(c.ArrowStripe,{}),r(c.ArrowStripe,{}),r(c.ArrowStripe,{})]})]}),r(c.ArrowsLine,{children:_(c.ArrowDown,{onPointerDown:()=>i(p.ArrowDown),onPointerUp:()=>u(p.ArrowDown),$orientation:j.HORIZONTAL,$pressed:L,children:[r(c.ArrowStripe,{}),r(c.ArrowStripe,{}),r(c.ArrowStripe,{})]})})]}),r("div",{className:"ml-auto",children:_(c.ButtonsAB,{className:" font-nes",children:[_(c.CircleButtonWrapper,{children:[r(c.CircleButton,{onPointerDown:()=>i(p.B),onPointerUp:()=>u(p.B),$pressed:d}),r(c.ButtonText,{$spacing:10,children:"B"})]}),_(c.CircleButtonWrapper,{children:[r(c.CircleButton,{onPointerDown:()=>i(p.A),onPointerUp:()=>u(p.A),$pressed:a}),r(c.ButtonText,{$spacing:10,children:"A"})]})]})})]}),_(c.ButtonsStartSelect,{className:"font-nes",children:[_(c.WideButtonContainer,{children:[r(c.WideButtonWrapper,{children:r(c.WideButton,{onPointerDown:()=>i(p.Select),onPointerUp:()=>u(p.Select),$pressed:m})}),r(c.ButtonText,{$spacing:1,children:"SELECT"})]}),_(c.WideButtonContainer,{children:[r(c.WideButtonWrapper,{children:r(c.WideButton,{onPointerDown:()=>i(p.Start),onPointerUp:()=>u(p.Start),$pressed:l})}),r(c.ButtonText,{$spacing:1,children:"START"})]})]}),_(c.Speakers,{children:[r(c.Speaker,{}),r(c.Speaker,{}),r(c.Speaker,{}),r(c.Speaker,{}),r(c.Speaker,{}),r(c.Speaker,{})]})]})})}const hn=g.exports.forwardRef(bn),yn="12px",H={Icon:f.div`
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
  `};function Sn(e){const{zoom:t,onChange:n}=e;return _(H.Wrapper,{children:[r(H.Icon,{children:r("button",{type:"button",onClick:()=>n(Math.max(1,t-.5)),children:"-"})}),_(H.Value,{children:["Zoom: ",t.toFixed(1)]}),r(H.Icon,{children:r("button",{type:"button",onClick:()=>n(Math.min(t+.5,5)),children:"+"})})]})}const An=f.div`
  cursor: pointer;
`;function xn(){const e=We();return r(An,{onClick:()=>e(-1),children:"\u2190"})}const je=Ze.filter(e=>["demos/cgb-acid2.gbc","demos/dmg-acid2.gb","demos/gejmboj.gb","demos/oh.gb","demos/opus5.gb","demos/pocket.gb"].includes(e.name)),vn=je.find(e=>e.name==="demos/oh.gb")||null;function En(e){const t=g.exports.useCallback(n=>{!n||Dt(n.url).then(s=>e.onCartridgeLoad({name:n.name,bytes:s}))},[]);return g.exports.useEffect(()=>{t(vn)},[t]),r("table",{children:r("tbody",{children:je.map(n=>_("tr",{className:e.selectedName===n.name?"font-medium underline":"",children:[r("td",{className:"px-1",children:n.name}),r("td",{className:"px-1",children:r("button",{type:"button",onClick:()=>t(n),children:"Load"})})]},n.url))})})}const $n=12,oe=20,ye=30,Tn=64,Cn=f.span`
  font-size: ${$n}px;
`,Ln=f.canvas`
  display: inline-block;
`,R=[];function On(){const e=g.exports.useRef(window.performance.now()),t=g.exports.useRef(null),n=g.exports.useRef(0);return g.exports.useEffect(()=>{function s(){n.current=window.requestAnimationFrame(()=>{const i=window.performance.now(),u=i-e.current;e.current=i;const a=Math.round(1e3/u);R.push(a),R.length>Tn&&R.shift();const d=Math.round(R.reduce((m,h)=>m+h)/R.length),l=t.current?.getContext("2d");l&&(l.clearRect(0,0,ye,oe),l.textBaseline="middle",l.font="12px Arial",l.fillText(d.toString(),1,oe/2+1)),s()})}return s(),()=>window.cancelAnimationFrame(n.current)},[]),_(Cn,{className:"flex items-center justify-end",children:["Average FPS: ",r(Ln,{width:ye,height:oe,ref:t})]})}function Nn(e){const{onLoad:t,className:n,children:s}=e;return _(Ge,{children:[r("input",{onChange:u=>{const{files:a}=u.currentTarget;if(!a)return;const d=a[0];d.arrayBuffer().then(l=>new Uint8Array(l)).then(l=>t({name:`Custom: ${d.name}`,bytes:l,custom:!0}))},accept:".gb,.gbc",style:{display:"none"},id:"file",multiple:!0,type:"file"}),r("label",{className:n,htmlFor:"file",children:s})]})}const Bn=1.5,Dn="#6D7C00",v=new AudioContext({sampleRate:44100});function In(e,t){const n=e.get_canvas_data_pointer(),s=t.createImageData(T,F),i=new Uint8Array(X.buffer,n,T*F*3);he(0,F).forEach(u=>{he(0,T).forEach(a=>{const d=(u*T+a)*3,l=(u*T+a)*4;s.data[l]=i[d],s.data[l+1]=i[d+1],s.data[l+2]=i[d+2],s.data[l+3]=255})}),t.putImageData(s,0,0)}function Se(e){e.fillStyle=Dn,e.fillRect(0,0,T,F)}const k=2;function Rn(e){const{bytes:t,wasmModule:n,running:s,ctx:i,soundEnabled:u}=e,a=g.exports.useRef(),d=g.exports.useRef(0),l=g.exports.useRef(0),m=Ot();g.exports.useEffect(()=>{Se(i)},[i]);const h=g.exports.useCallback(w=>{const x=n.get_audio_buffer_size(),L=new Float32Array(X.buffer,w,x),D=L.length/k,y=v.createBuffer(k,D,v.sampleRate);for(let $=0;$<k;$+=1){const Pe=y.getChannelData($);for(let G=0;G<D;G+=1)Pe[G]=L[G*k+$]}const E=v.createBufferSource();E.buffer=y,E.connect(v.destination),d.current<=v.currentTime+.02&&(d.current=v.currentTime+.06),E.start(d.current),d.current+=x/k/v.sampleRate},[]);return g.exports.useEffect(()=>{if(!t)return;const w=new n.WebCartridge(t);d.current=0,a.current=new n.WebEmulator(w,()=>{}),Se(i),m(a.current)},[t,n,m]),g.exports.useEffect(()=>{const w=a.current;!w||w.set_audio_buffer_callback(u?h:()=>{})},[a.current,u,h]),g.exports.useEffect(()=>{const w=a.current;if(!!w)if(s){const x=()=>{w.run_frame(),In(w,i),l.current=window.requestAnimationFrame(x)};x()}else window.cancelAnimationFrame(l.current)},[s]),null}function Ae(){const[e,t]=se.useLocalStorage("zoom",Bn),[n,s]=se.useLocalStorage("sound_enabled",!1),[i,u]=g.exports.useState(!1),[a,d]=g.exports.useState(),[l,m]=g.exports.useState(null),h={zoom:e},w=Nt(),x=()=>{Bt(v),u(y=>y?!1:!!(!y&&l))},L=g.exports.useCallback(y=>{!y||d(E=>{if(E)return E;const $=y.getContext("2d");return $||E})},[]),D=y=>{u(!1),m(y)};return w?r("div",{className:"select-none",children:r(Lt,{children:_(ze,{theme:h,children:[_("div",{className:"grid grid-cols-3 justify-between items-center mx-2 pt-2",children:[r(xn,{}),r(Sn,{zoom:e,onChange:t}),r("div",{className:"justify-end",children:r(On,{})})]}),r(hn,{running:i,ref:L}),a&&r(Rn,{bytes:l?.bytes,wasmModule:w,running:i,soundEnabled:n,ctx:a}),_("div",{className:"mt-2 flex justify-center items-center text-xs",children:[r("button",{className:"mx-2 border rounded px-1 py-1",type:"button",onClick:x,children:i?"Stop":"Run"}),r(Nn,{className:"mx-2 border rounded px-1 py-1",onLoad:D,children:"Upload ROM"}),_("label",{className:"flex justify-center items-center",htmlFor:"soundEnableCheckbox",children:[r("input",{id:"soundEnableCheckbox",className:"mr-1",type:"checkbox",checked:n,onChange:y=>s(y.currentTarget.checked)}),"Enable sound"]})]}),l?.custom&&r("div",{className:"mt-2 flex justify-center text-xs",children:l.name}),r("div",{className:"mt-2 flex justify-center text-xs",children:r(En,{selectedName:l?.name,onCartridgeLoad:D})}),r("div",{className:"mt-2 flex text-center justify-center text-xs",children:_("div",{children:[r("p",{children:"Select one of the available demos or upload your custom *.gb file and press Run"}),_("p",{children:["The test ROMs are available in"," ",r(ge,{className:"underline",to:"/debug",children:"debug mode"}),". You can see the test results"," ",r(ge,{className:"underline",to:"/test-results",children:"here"}),"."]})]})})]})})}):r(He,{})}const Fn=Object.freeze(Object.defineProperty({__proto__:null,Play:Ae,default:Ae},Symbol.toStringTag,{value:"Module"}));export{p as J,Fn as P,V as W,ct as _,ae as a,at as b,lt as c,ut as d,dt as e,ft as f,Mn as g,pt as h,Un as i,_t as j,gt as k};
