(self.webpackChunkfeather_gb=self.webpackChunkfeather_gb||[]).push([[288],{3595:(e,n,t)=>{"use strict";t.d(n,{O_:()=>h,S1:()=>v,Lt:()=>S,n6:()=>A,O7:()=>k,m_:()=>L,h9:()=>C,Dz:()=>P,kF:()=>T,ug:()=>E,pT:()=>B,tw:()=>Z,fY:()=>D,Or:()=>N});var r=t(5988);e=t.hmd(e);const i=new Array(32).fill(void 0);function o(e){return i[e]}i.push(void 0,null,!0,!1);let a=i.length;function s(e){a===i.length&&i.push(i.length+1);const n=a;return a=i[n],i[n]=e,n}function c(e){const n=typeof e;if("number"==n||"boolean"==n||null==e)return`${e}`;if("string"==n)return`"${e}"`;if("symbol"==n){const n=e.description;return null==n?"Symbol":`Symbol(${n})`}if("function"==n){const n=e.name;return"string"==typeof n&&n.length>0?`Function(${n})`:"Function"}if(Array.isArray(e)){const n=e.length;let t="[";n>0&&(t+=c(e[0]));for(let r=1;r<n;r++)t+=", "+c(e[r]);return t+="]",t}const t=/\[object ([^\]]+)\]/.exec(toString.call(e));let r;if(!(t.length>1))return toString.call(e);if(r=t[1],"Object"==r)try{return"Object("+JSON.stringify(e)+")"}catch(e){return"Object"}return e instanceof Error?`${e.name}: ${e.message}\n${e.stack}`:r}let l=0,d=null;function u(){return null!==d&&d.buffer===r.memory.buffer||(d=new Uint8Array(r.memory.buffer)),d}let f=new("undefined"==typeof TextEncoder?(0,e.require)("util").TextEncoder:TextEncoder)("utf-8");const b="function"==typeof f.encodeInto?function(e,n){return f.encodeInto(e,n)}:function(e,n){const t=f.encode(e);return n.set(t),{read:e.length,written:t.length}};function p(e,n,t){if(void 0===t){const t=f.encode(e),r=n(t.length);return u().subarray(r,r+t.length).set(t),l=t.length,r}let r=e.length,i=n(r);const o=u();let a=0;for(;a<r;a++){const n=e.charCodeAt(a);if(n>127)break;o[i+a]=n}if(a!==r){0!==a&&(e=e.slice(a)),i=t(i,r,r=a+3*e.length);const n=u().subarray(i+a,i+r);a+=b(e,n).written}return l=a,i}let g=null;function m(){return null!==g&&g.buffer===r.memory.buffer||(g=new Int32Array(r.memory.buffer)),g}let x=new("undefined"==typeof TextDecoder?(0,e.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});function w(e,n){return x.decode(u().subarray(e,e+n))}function h(){return r.get_audio_buffer_size()>>>0}x.decode();let _=32;function y(e){if(1==_)throw new Error("out of js stack");return i[--_]=e,_}function v(){r.init()}function j(e,n){try{return e.apply(this,n)}catch(e){r.__wbindgen_exn_store(s(e))}}const S=Object.freeze({ArrowDown:0,0:"ArrowDown",ArrowLeft:1,1:"ArrowLeft",ArrowRight:2,2:"ArrowRight",ArrowUp:3,3:"ArrowUp",A:4,4:"A",B:5,5:"B",Start:6,6:"Start",Select:7,7:"Select"});class A{static __wrap(e){const n=Object.create(A.prototype);return n.ptr=e,n}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();r.__wbg_webcartridge_free(e)}constructor(e){var n=function(e,n){const t=n(1*e.length);return u().set(e,t/1),l=e.length,t}(e,r.__wbindgen_malloc),t=l,i=r.webcartridge_new(n,t);return A.__wrap(i)}}class k{static __wrap(e){const n=Object.create(k.prototype);return n.ptr=e,n}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();r.__wbg_webemulator_free(e)}constructor(e,n){try{!function(e,n){if(!(e instanceof n))throw new Error(`expected instance of ${n.name}`);e.ptr}(e,A);var t=e.ptr;e.ptr=0;var o=r.webemulator_new(t,y(n));return k.__wrap(o)}finally{i[_++]=void 0}}run_frame(){r.webemulator_run_frame(this.ptr)}get_canvas_data_pointer(){return r.webemulator_get_canvas_data_pointer(this.ptr)}on_key_down(e){r.webemulator_on_key_down(this.ptr,e)}on_key_up(e){r.webemulator_on_key_up(this.ptr,e)}set_audio_buffer_callback(e){try{r.webemulator_set_audio_buffer_callback(this.ptr,y(e))}finally{i[_++]=void 0}}}function L(e){return s(o(e))}function C(){return s(new Error)}function P(e,n){var t=p(o(n).stack,r.__wbindgen_malloc,r.__wbindgen_realloc),i=l;m()[e/4+1]=i,m()[e/4+0]=t}function T(e,n){try{console.error(w(e,n))}finally{r.__wbindgen_free(e,n)}}function E(e){!function(e){const n=o(e);(function(e){e<36||(i[e]=a,a=e)})(e)}(e)}function B(e){return s(e)}function Z(){return j((function(e,n,t){return s(o(e).call(o(n),o(t)))}),arguments)}function D(e,n){var t=p(c(o(n)),r.__wbindgen_malloc,r.__wbindgen_realloc),i=l;m()[e/4+1]=i,m()[e/4+0]=t}function N(e,n){throw new Error(w(e,n))}},5988:(e,n,t)=>{"use strict";var r=t.w[e.id];e.exports=r,t(3595),r[""]()},5832:(e,n,t)=>{"use strict";const r=t(2096);n._=r.useLocalStorage;var i=t(7455);i.writeStorage,i.deleteFromStorage,r.useLocalStorage},7455:(e,n)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0});class t extends CustomEvent{constructor(e){super(t.eventName,{detail:e})}}t.eventName="onLocalStorageChange",n.LocalStorageChanged=t,n.isTypeOfLocalStorageChanged=function(e){return!!e&&(e instanceof t||e.detail&&e.type===t.eventName)},n.writeStorage=function(e,n){try{localStorage.setItem(e,"object"==typeof n?JSON.stringify(n):`${n}`),window.dispatchEvent(new t({key:e,value:n}))}catch(e){if(e instanceof TypeError&&e.message.includes("circular structure"))throw new TypeError("The object that was given to the writeStorage function has circular references.\nFor more information, check here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value");throw e}},n.deleteFromStorage=function(e){localStorage.removeItem(e),window.dispatchEvent(new t({key:e,value:""}))}},2096:(e,n,t)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0});const r=t(7455),i=t(7294);function o(e){try{return JSON.parse(e)}catch(n){return e}}n.useLocalStorage=function(e,n){const[t,a]=i.useState(null===localStorage.getItem(e)?n:o(localStorage.getItem(e)));i.useEffect((()=>{a(null===localStorage.getItem(e)?n:o(localStorage.getItem(e)))}),[e]),i.useEffect((()=>{const t=n=>{return t=n,void(r.isTypeOfLocalStorageChanged(t)?t.detail.key===e&&a(t.detail.value):t.key===e&&t.newValue&&a(o(t.newValue)));var t};window.addEventListener(r.LocalStorageChanged.eventName,t),window.addEventListener("storage",t);const i=null===localStorage.getItem(e);return void 0!==n&&i&&r.writeStorage(e,n),()=>{window.removeEventListener(r.LocalStorageChanged.eventName,t),window.removeEventListener("storage",t)}}),[e]);const s=i.useCallback((n=>r.writeStorage(e,n)),[e]),c=i.useCallback((()=>r.deleteFromStorage(e)),[e]);return[null===t?n:t,s,c]}},3288:(e,n,t)=>{"use strict";t.r(n),t.d(n,{Play:()=>yn,default:()=>vn});var r=t(9163),i=t(5832),o=t(7294),a=t(3727),s=t(5893),c=function(e,n){for(var t=0,r=n.length,i=e.length;t<r;t++,i++)e[i]=n[t];return e},l=(0,o.createContext)({input:[],onKeyDown:function(){},onKeyUp:function(){}});function d(e){var n=e.children,t=(0,o.useState)([]),r=t[0],i=t[1],a=(0,o.useCallback)((function(e){i((function(n){return n.filter((function(n){return e!==n}))}))}),[]),d=(0,o.useCallback)((function(e){i((function(n){return n.includes(e)?n:c(c([],n),[e])}))}),[]);return(0,s.jsx)(l.Provider,{value:{input:r,onKeyUp:a,onKeyDown:d},children:n})}var u=function(e,n){return Object.defineProperty?Object.defineProperty(e,"raw",{value:n}):e.raw=n,e};function f(e){return function(n){return n.theme.zoom*e+"px"}}function b(){return(0,r.iv)(U||(U=u(["\n    filter: brightness(80%);\n  "],["\n    filter: brightness(80%);\n  "])))}var p,g=r.ZP.div($||($=u(["\n  display: flex;\n  justify-content: center;\n"],["\n  display: flex;\n  justify-content: center;\n"]))),m=r.ZP.div(I||(I=u(["\n  display: inline-block;\n  margin: 10px;\n  background: #eee;\n  border-radius: 10px 10px 60px 10px;\n  box-shadow: 5px 5px rgba(0, 0, 0, 0.1);\n  padding: ",";\n  color: ",";\n  position: relative;\n"],["\n  display: inline-block;\n  margin: 10px;\n  background: #eee;\n  border-radius: 10px 10px 60px 10px;\n  box-shadow: 5px 5px rgba(0, 0, 0, 0.1);\n  padding: ",";\n  color: ",";\n  position: relative;\n"])),f(20),"#393C81"),x=r.ZP.div(W||(W=u(["\n  background-color: #777;\n  border-radius: "," "," "," ",";\n  box-shadow: inset 0px 0px 20px 0px rgba(0, 0, 0, 0.66);\n"],["\n  background-color: #777;\n  border-radius: "," "," "," ",";\n  box-shadow: inset 0px 0px 20px 0px rgba(0, 0, 0, 0.66);\n"])),f(7),f(7),f(40),f(7)),w=r.ZP.div(K||(K=u(["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: ",";\n  font-size: ",";\n  font-family: Arial;\n  color: #b3b3b3;\n  padding: 0 "," 0;\n"],["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: ",";\n  font-size: ",";\n  font-family: Arial;\n  color: #b3b3b3;\n  padding: 0 "," 0;\n"])),f(23),f(6),f(8)),h=r.ZP.div(F||(F=u(["\n  flex: 0 0 auto;\n  margin: 0 ",";\n"],["\n  flex: 0 0 auto;\n  margin: 0 ",";\n"])),f(5)),_=r.ZP.div(G||(G=u(["\n  display: flex;\n  margin-right: ",";\n  padding-bottom: ",";\n"],["\n  display: flex;\n  margin-right: ",";\n  padding-bottom: ",";\n"])),f(45),f(23)),y=r.ZP.div(M||(M=u(["\n  flex: 1 1 ",";\n  height: ",";\n  background-color: #8b1d90;\n  box-shadow: 0 "," 0 #283593;\n  margin-top: -",";\n"],["\n  flex: 1 1 ",";\n  height: ",";\n  background-color: #8b1d90;\n  box-shadow: 0 "," 0 #283593;\n  margin-top: -",";\n"])),(function(e){return e.width}),f(3),f(6),f(6)),v=r.ZP.div(V||(V=u(["\n  margin-left: auto;\n  margin-right: auto;\n  position: relative;\n"],["\n  margin-left: auto;\n  margin-right: auto;\n  position: relative;\n"]))),j=r.ZP.div(H||(H=u(["\n  position: absolute;\n  box-shadow: inset 5px 5px 5px 0px rgba(0, 0, 0, 0.6);\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n"],["\n  position: absolute;\n  box-shadow: inset 5px 5px 5px 0px rgba(0, 0, 0, 0.6);\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n"]))),S=r.ZP.div(q||(q=u(["\n  background-color: ",";\n  box-shadow: 0 0 3px 1px #ef5350;\n  height: ",";\n  width: ",";\n  border-radius: ","px;\n  margin: 10px 20px 10px 10px;\n  box-shadow: inset 0px 0px 5px 0px rgba(0, 0, 0, 0.66);\n"],["\n  background-color: ",";\n  box-shadow: 0 0 3px 1px #ef5350;\n  height: ",";\n  width: ",";\n  border-radius: ","px;\n  margin: 10px 20px 10px 10px;\n  box-shadow: inset 0px 0px 5px 0px rgba(0, 0, 0, 0.66);\n"])),(function(e){return e.enabled?"#f00":"#000"}),f(9),f(9),(function(e){return 9*e.theme.zoom/2})),A=r.ZP.div(J||(J=u(["\n  font-family: Arial;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  color: #b3b3b3;\n  width: ",";\n  font-size: ",";\n  margin-bottom: 80px;\n"],["\n  font-family: Arial;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  color: #b3b3b3;\n  width: ",";\n  font-size: ",";\n  margin-bottom: 80px;\n"])),f(45),f(6)),k=r.ZP.div(Y||(Y=u(["\n  letter-spacing: 1px;\n  font-size: ",";\n"],["\n  letter-spacing: 1px;\n  font-size: ",";\n"])),f(13)),L=r.ZP.div(X||(X=u(["\n  margin-left: ",";\n  font-size: ",";\n"],["\n  margin-left: ",";\n  font-size: ",";\n"])),f(2),f(20)),C=r.ZP.div(Q||(Q=u(["\n  font-size: ",";\n"],["\n  font-size: ",";\n"])),f(6)),P=r.ZP.div(ee||(ee=u(["\n  background-color: ",";\n  height: ",";\n  width: ",";\n  border-radius: ",";\n\n  ","\n"],["\n  background-color: ",";\n  height: ",";\n  width: ",";\n  border-radius: ",";\n\n  ","\n"])),"#8A205E",f(36),f(36),f(18),(function(e){return e.$pressed&&b()})),T=r.ZP.div(ne||(ne=u(["\n  position: relative;\n"],["\n  position: relative;\n"]))),E=r.ZP.div(te||(te=u(["\n  font-size: ",";\n  letter-spacing: ",";\n"],["\n  font-size: ",";\n  letter-spacing: ",";\n"])),f(12),f(1)),B=(0,r.ZP)(E)(re||(re=u(["\n  margin-top: ",";\n"],["\n  margin-top: ",";\n"])),(function(e){return f(e.$spacing)})),Z=r.ZP.div(ie||(ie=u(["\n  display: inline-flex;\n  margin-top: ",";\n  margin-right: -",";\n  transform: rotate(-","deg);\n  padding: ",";\n\n  background-color: #dfdfdf;\n  box-shadow: 0 0 0 5px #dfdfdf;\n  border-radius: ",";\n\n  > * + * {\n    margin-left: ",";\n  }\n\n  "," {\n    bottom: -",";\n    position: absolute;\n    left: 0;\n    right: 0;\n    text-align: center;\n  }\n"],["\n  display: inline-flex;\n  margin-top: ",";\n  margin-right: -",";\n  transform: rotate(-","deg);\n  padding: ",";\n\n  background-color: #dfdfdf;\n  box-shadow: 0 0 0 5px #dfdfdf;\n  border-radius: ",";\n\n  > * + * {\n    margin-left: ",";\n  }\n\n  "," {\n    bottom: -",";\n    position: absolute;\n    left: 0;\n    right: 0;\n    text-align: center;\n  }\n"])),f(10),f(12),25,f(5),f(36),f(18),B,f(25)),D=r.ZP.div(oe||(oe=u(["\n  transform: rotate(-","deg);\n  display: flex;\n  justify-content: center;\n  flex-direction: column;\n  align-items: center;\n"],["\n  transform: rotate(-","deg);\n  display: flex;\n  justify-content: center;\n  flex-direction: column;\n  align-items: center;\n"])),25),N=r.ZP.div(ae||(ae=u(["\n  border-radius: ",";\n  background-color: #dfdfdf;\n  padding: ",";\n"],["\n  border-radius: ",";\n  background-color: #dfdfdf;\n  padding: ",";\n"])),f(9.5),f(5)),R=r.ZP.div(se||(se=u(["\n  background-color: #868a8d;\n  width: ",";\n  height: ",";\n  border-radius: ",";\n  ","\n"],["\n  background-color: #868a8d;\n  width: ",";\n  height: ",";\n  border-radius: ",";\n  ","\n"])),f(38),f(9),f(4.5),(function(e){return e.$pressed&&b()})),O=r.ZP.div(ce||(ce=u(["\n  display: flex;\n  margin-left: ",";\n  margin-top: ",";\n  margin-bottom: ",";\n  "," + "," {\n    margin-left: ",";\n  }\n"],["\n  display: flex;\n  margin-left: ",";\n  margin-top: ",";\n  margin-bottom: ",";\n  "," + "," {\n    margin-left: ",";\n  }\n"])),f(80),f(30),f(40),D,D,f(7)),z=r.ZP.div(le||(le=u([""],[""])));!function(e){e[e.HORIZONTAL=0]="HORIZONTAL",e[e.VERTICAL=1]="VERTICAL"}(p||(p={}));var U,$,I,W,K,F,G,M,V,H,q,J,Y,X,Q,ee,ne,te,re,ie,oe,ae,se,ce,le,de,ue,fe,be,pe,ge,me,xe,we,he,_e,ye,ve,je,Se=r.ZP.div(de||(de=u(["\n  display: flex;\n  justify-content: center;\n"],["\n  display: flex;\n  justify-content: center;\n"]))),Ae=r.ZP.div(ue||(ue=u(["\n  width: ",";\n  height: 80%;\n  background-color: #353535;\n  margin: ",";\n  border-radius: ",";\n"],["\n  width: ",";\n  height: 80%;\n  background-color: #353535;\n  margin: ",";\n  border-radius: ",";\n"])),f(2),f(2),f(5)),ke=r.ZP.div(fe||(fe=u(["\n  position: relative;\n  height: ",";\n  width: ",";\n  background-color: #1b1d1d;\n"],["\n  position: relative;\n  height: ",";\n  width: ",";\n  background-color: #1b1d1d;\n"])),f(26),f(26)),Le=(0,r.ZP)(ke)(ge||(ge=u(["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: ",";\n\n  "," {\n    ","\n\n    ",";\n  }\n"],["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: ",";\n\n  "," {\n    ","\n\n    ",";\n  }\n"])),(function(e){return e.$orientation===p.VERTICAL?"row":"column"}),Ae,(function(e){return e.$pressed&&b()}),(function(e){return e.$orientation===p.VERTICAL?(0,r.iv)(be||(be=u(["\n            width: ",";\n            height: 60%;\n          "],["\n            width: ",";\n            height: 60%;\n          "])),f(3)):(0,r.iv)(pe||(pe=u(["\n            height: ",";\n            width: 60%;\n          "],["\n            height: ",";\n            width: 60%;\n          "])),f(3))})),Ce=(0,r.ZP)(Le)(me||(me=u(["\n  border-radius: "," 0 0 ",";\n"],["\n  border-radius: "," 0 0 ",";\n"])),f(5),f(5)),Pe=(0,r.ZP)(Le)(xe||(xe=u(["\n  border-radius: "," "," 0 0;\n"],["\n  border-radius: "," "," 0 0;\n"])),f(5),f(5)),Te=(0,r.ZP)(Le)(we||(we=u(["\n  border-radius: 0 "," "," 0;\n"],["\n  border-radius: 0 "," "," 0;\n"])),f(5),f(5)),Ee=(0,r.ZP)(Le)(he||(he=u(["\n  border-radius: 0 0 "," ",";\n"],["\n  border-radius: 0 0 "," ",";\n"])),f(5),f(5)),Be=(0,r.ZP)(ke)(_e||(_e=u(["\n  &:before {\n    content: '';\n    position: absolute;\n    z-index: 1;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    margin: auto;\n    height: ",";\n    width: ",";\n    background-color: #353535;\n    border-radius: 100%;\n  }\n"],["\n  &:before {\n    content: '';\n    position: absolute;\n    z-index: 1;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    margin: auto;\n    height: ",";\n    width: ",";\n    background-color: #353535;\n    border-radius: 100%;\n  }\n"])),f(19),f(19)),Ze=r.ZP.div(ye||(ye=u(["\n  display: flex;\n  margin-top: ",";\n"],["\n  display: flex;\n  margin-top: ",";\n"])),f(35)),De=r.ZP.div(ve||(ve=u(["\n  height: ",";\n  width: ",";\n  background-color: #a7a49f;\n  border-radius: ",";\n  box-shadow: inset 0px 0px 5px 0px rgb(95 95 95 / 66%);\n"],["\n  height: ",";\n  width: ",";\n  background-color: #a7a49f;\n  border-radius: ",";\n  box-shadow: inset 0px 0px 5px 0px rgb(95 95 95 / 66%);\n"])),f(48),f(5),f(5)),Ne={Wrapper:g,Device:m,Display:x,DisplayTop:w,DisplayHeaderText:h,DisplayContent:_,DisplayLine:y,Screen:v,ScreenOverlay:j,Battery:A,BatteryIndicator:S,NintendoText:k,GameBoyText:L,TradeMarkText:C,Controls:Ze,ButtonsAB:Z,CircleButtonWrapper:T,CircleButton:P,ButtonText:B,ButtonsStartSelect:O,WideButton:R,WideButtonWrapper:N,WideButtonContainer:D,Arrows:z,ArrowsLine:Se,ArrowUp:Pe,ArrowDown:Ee,ArrowLeft:Ce,ArrowRight:Te,ArrowCenter:Be,ArrowStripe:Ae,Speakers:r.ZP.div(je||(je=u(["\n  display: inline-flex;\n  transform: rotate(-28deg);\n  position: absolute;\n  bottom: ",";\n  right: ",";\n\n  "," + "," {\n    margin-left: ",";\n  }\n"],["\n  display: inline-flex;\n  transform: rotate(-28deg);\n  position: absolute;\n  bottom: ",";\n  right: ",";\n\n  "," + "," {\n    margin-left: ",";\n  }\n"])),f(19),f(15),De,De,f(8)),Speaker:De};function Re(e){return(0,s.jsxs)(Ne.Display,{children:[(0,s.jsxs)(Ne.DisplayTop,{children:[(0,s.jsx)(Ne.DisplayLine,{width:"25%"}),(0,s.jsx)(Ne.DisplayHeaderText,{children:"DOT MATRIX WITH STEREO SOUND"}),(0,s.jsx)(Ne.DisplayLine,{width:"12%"})]}),(0,s.jsxs)(Ne.DisplayContent,{children:[(0,s.jsxs)(Ne.Battery,{children:[(0,s.jsx)(Ne.BatteryIndicator,{enabled:e.enabled}),"BATTERY"]}),(0,s.jsxs)(Ne.Screen,{children:[e.children,(0,s.jsx)(Ne.ScreenOverlay,{})]})]})]})}var Oe=t(3595),ze=160,Ue=144;function $e(e,n){var t=e.running,i=(0,r.Fg)().zoom,a=(0,o.useContext)(l),c=a.input,d=a.onKeyDown,u=a.onKeyUp,f=c.includes(Oe.Lt.A),b=c.includes(Oe.Lt.B),g=c.includes(Oe.Lt.Start),m=c.includes(Oe.Lt.Select),x=c.includes(Oe.Lt.ArrowLeft),w=c.includes(Oe.Lt.ArrowRight),h=c.includes(Oe.Lt.ArrowUp),_=c.includes(Oe.Lt.ArrowDown);return(0,s.jsx)(Ne.Wrapper,{children:(0,s.jsxs)(Ne.Device,{children:[(0,s.jsx)(Re,{enabled:t,children:(0,s.jsx)("canvas",{ref:n,style:{display:"block",imageRendering:"pixelated",zoom:i},height:Ue,width:ze})}),(0,s.jsxs)("div",{className:"flex items-baseline",children:[(0,s.jsx)(Ne.NintendoText,{className:"font-pretendo",children:"Nintendo"}),(0,s.jsx)(Ne.GameBoyText,{className:"font-gills-sans font-medium italic",children:"GAME BOY"}),(0,s.jsx)(Ne.TradeMarkText,{className:"font-bold",children:"TM"})]}),(0,s.jsxs)(Ne.Controls,{children:[(0,s.jsxs)(Ne.Arrows,{children:[(0,s.jsx)(Ne.ArrowsLine,{children:(0,s.jsxs)(Ne.ArrowUp,{onPointerDown:function(){return d(Oe.Lt.ArrowUp)},onPointerUp:function(){return u(Oe.Lt.ArrowUp)},$orientation:p.HORIZONTAL,$pressed:h,children:[(0,s.jsx)(Ne.ArrowStripe,{}),(0,s.jsx)(Ne.ArrowStripe,{}),(0,s.jsx)(Ne.ArrowStripe,{})]})}),(0,s.jsxs)(Ne.ArrowsLine,{children:[(0,s.jsxs)(Ne.ArrowLeft,{onPointerDown:function(){return d(Oe.Lt.ArrowLeft)},onPointerUp:function(){return u(Oe.Lt.ArrowLeft)},$orientation:p.VERTICAL,$pressed:x,children:[(0,s.jsx)(Ne.ArrowStripe,{}),(0,s.jsx)(Ne.ArrowStripe,{}),(0,s.jsx)(Ne.ArrowStripe,{})]}),(0,s.jsx)(Ne.ArrowCenter,{}),(0,s.jsxs)(Ne.ArrowRight,{onPointerDown:function(){return d(Oe.Lt.ArrowRight)},onPointerUp:function(){return u(Oe.Lt.ArrowRight)},$orientation:p.VERTICAL,$pressed:w,children:[(0,s.jsx)(Ne.ArrowStripe,{}),(0,s.jsx)(Ne.ArrowStripe,{}),(0,s.jsx)(Ne.ArrowStripe,{})]})]}),(0,s.jsx)(Ne.ArrowsLine,{children:(0,s.jsxs)(Ne.ArrowDown,{onPointerDown:function(){return d(Oe.Lt.ArrowDown)},onPointerUp:function(){return u(Oe.Lt.ArrowDown)},$orientation:p.HORIZONTAL,$pressed:_,children:[(0,s.jsx)(Ne.ArrowStripe,{}),(0,s.jsx)(Ne.ArrowStripe,{}),(0,s.jsx)(Ne.ArrowStripe,{})]})})]}),(0,s.jsx)("div",{className:"ml-auto",children:(0,s.jsxs)(Ne.ButtonsAB,{className:" font-nes",children:[(0,s.jsxs)(Ne.CircleButtonWrapper,{children:[(0,s.jsx)(Ne.CircleButton,{onPointerDown:function(){return d(Oe.Lt.B)},onPointerUp:function(){return u(Oe.Lt.B)},$pressed:b}),(0,s.jsx)(Ne.ButtonText,{$spacing:10,children:"B"})]}),(0,s.jsxs)(Ne.CircleButtonWrapper,{children:[(0,s.jsx)(Ne.CircleButton,{onPointerDown:function(){return d(Oe.Lt.A)},onPointerUp:function(){return u(Oe.Lt.A)},$pressed:f}),(0,s.jsx)(Ne.ButtonText,{$spacing:10,children:"A"})]})]})})]}),(0,s.jsxs)(Ne.ButtonsStartSelect,{className:"font-nes",children:[(0,s.jsxs)(Ne.WideButtonContainer,{children:[(0,s.jsx)(Ne.WideButtonWrapper,{children:(0,s.jsx)(Ne.WideButton,{onPointerDown:function(){return d(Oe.Lt.Select)},onPointerUp:function(){return u(Oe.Lt.Select)},$pressed:m})}),(0,s.jsx)(Ne.ButtonText,{$spacing:1,children:"SELECT"})]}),(0,s.jsxs)(Ne.WideButtonContainer,{children:[(0,s.jsx)(Ne.WideButtonWrapper,{children:(0,s.jsx)(Ne.WideButton,{onPointerDown:function(){return d(Oe.Lt.Start)},onPointerUp:function(){return u(Oe.Lt.Start)},$pressed:g})}),(0,s.jsx)(Ne.ButtonText,{$spacing:1,children:"START"})]})]}),(0,s.jsxs)(Ne.Speakers,{children:[(0,s.jsx)(Ne.Speaker,{}),(0,s.jsx)(Ne.Speaker,{}),(0,s.jsx)(Ne.Speaker,{}),(0,s.jsx)(Ne.Speaker,{}),(0,s.jsx)(Ne.Speaker,{}),(0,s.jsx)(Ne.Speaker,{})]})]})})}var Ie,We,Ke,Fe=(0,o.forwardRef)($e),Ge=function(e,n){return Object.defineProperty?Object.defineProperty(e,"raw",{value:n}):e.raw=n,e},Me="12px",Ve={Icon:r.ZP.div(Ie||(Ie=Ge(["\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    cursor: pointer;\n  "],["\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    cursor: pointer;\n  "]))),Wrapper:r.ZP.div(We||(We=Ge(["\n    font-size: ",";\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  "],["\n    font-size: ",";\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  "])),Me),Value:r.ZP.div(Ke||(Ke=Ge(["\n    margin: 0 5px;\n  "],["\n    margin: 0 5px;\n  "])))};function He(e){var n=e.zoom,t=e.onChange;return(0,s.jsxs)(Ve.Wrapper,{children:[(0,s.jsx)(Ve.Icon,{children:(0,s.jsx)("div",{style:{fontSize:Me},onClick:function(){return t(Math.max(1,n-.5))},children:"-"})}),(0,s.jsxs)(Ve.Value,{children:["Zoom: ",n.toFixed(1)]}),(0,s.jsx)(Ve.Icon,{children:(0,s.jsx)("div",{style:{fontSize:Me},onClick:function(){return t(Math.min(n+.5,5))},children:"+"})})]})}var qe,Je,Ye,Xe=t(5977),Qe=r.ZP.div(qe||(Je=["\n  cursor: pointer;\n"],Ye=["\n  cursor: pointer;\n"],Object.defineProperty?Object.defineProperty(Je,"raw",{value:Ye}):Je.raw=Ye,qe=Je));function en(){var e=(0,Xe.k6)();return(0,s.jsx)(Qe,{onClick:function(){return e.goBack()},children:"←"})}function nn(e,n,t){if(void 0===t&&(t=1),t>0&&e>=n||t<0&&e<=n)return[];for(var r=[],i=e;t>0?i<n:i>n;i+=t)r.push(i);return r}var tn=t(1344).y.filter((function(e){return e.name.startsWith("demos/")||e.name.startsWith("games/")})),rn=tn.find((function(e){return"demos/oh.gb"===e.name}))||null;function on(e){var n=(0,o.useCallback)((function(n){if(!n)return null;var t;(t=n.url,fetch(t).then((function(e){return e.arrayBuffer()})).then((function(e){return new Uint8Array(e)}))).then((function(t){return e.onCartridgeLoad({name:n.name,bytes:t})}))}),[]);return(0,o.useEffect)((function(){n(rn)}),[n]),(0,s.jsx)("table",{children:(0,s.jsx)("tbody",{children:tn.map((function(t){return(0,s.jsxs)("tr",{className:e.selectedName===t.name?"font-medium underline":"",children:[(0,s.jsx)("td",{className:"px-1",children:t.name}),(0,s.jsx)("td",{className:"px-1",children:(0,s.jsx)("button",{onClick:function(){return n(t)},children:"Load"})})]},t.url)}))})})}function an(e){var n=e.onLoad,t=e.className,r=e.children;return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("input",{onChange:function(e){var t=e.currentTarget.files;if(t){var r=t[0];r.arrayBuffer().then((function(e){return new Uint8Array(e)})).then((function(e){return n({name:"Custom: "+r.name,bytes:e,custom:!0})}))}},accept:".gb,.gbc",style:{display:"none"},id:"file",multiple:!0,type:"file"}),(0,s.jsx)("label",{className:t,htmlFor:"file",children:r})]})}var sn,cn,ln={ArrowDown:Oe.Lt.ArrowDown,ArrowUp:Oe.Lt.ArrowUp,ArrowLeft:Oe.Lt.ArrowLeft,ArrowRight:Oe.Lt.ArrowRight,KeyD:Oe.Lt.ArrowRight,KeyA:Oe.Lt.ArrowLeft,KeyW:Oe.Lt.ArrowUp,KeyS:Oe.Lt.ArrowDown,KeyJ:Oe.Lt.A,KeyX:Oe.Lt.A,KeyK:Oe.Lt.B,KeyC:Oe.Lt.B,KeyB:Oe.Lt.Start,KeyN:Oe.Lt.Select},dn=t(6568),un=t(5988),fn=function(e,n){return Object.defineProperty?Object.defineProperty(e,"raw",{value:n}):e.raw=n,e},bn=r.ZP.span(sn||(sn=fn(["\n  font-size: ","px;\n"],["\n  font-size: ","px;\n"])),12),pn=r.ZP.canvas(cn||(cn=fn(["\n  display: inline-block;\n"],["\n  display: inline-block;\n"]))),gn=[];function mn(){var e=(0,o.useRef)(window.performance.now()),n=(0,o.useRef)(null),t=(0,o.useRef)(0);return(0,o.useEffect)((function(){return function r(){t.current=window.requestAnimationFrame((function(){var t,i=window.performance.now(),o=i-e.current;e.current=i;var a=Math.round(1e3/o);gn.push(a),gn.length>64&&gn.shift();var s=Math.round(gn.reduce((function(e,n){return e+n}))/gn.length),c=null===(t=n.current)||void 0===t?void 0:t.getContext("2d");c&&(c.clearRect(0,0,30,20),c.textBaseline="middle",c.font="12px Arial",c.fillText(s.toString(),1,11)),r()}))}(),function(){return window.cancelAnimationFrame(t.current)}}),[]),(0,s.jsxs)(bn,{className:"flex items-center justify-end",children:["Average FPS:"," ",(0,s.jsx)(pn,{width:30,height:20,ref:n})]})}var xn=!1,wn=new AudioContext({sampleRate:44100});function hn(e){e.fillStyle="#6D7C00",e.fillRect(0,0,ze,Ue)}function _n(e){var n,t,r,i,a,s=e.bytes,c=e.wasmModule,d=e.running,u=e.ctx,f=e.soundEnabled,b=(0,o.useRef)(),p=(0,o.useRef)(0),g=(0,o.useRef)(0),m=(n=(0,o.useContext)(l),t=n.onKeyDown,r=n.onKeyUp,i=n.input,a=(0,o.useRef)(),(0,o.useEffect)((function(){Object.values(ln).forEach((function(e){var n,t;i.includes(e)?null===(n=a.current)||void 0===n||n.on_key_down(e):null===(t=a.current)||void 0===t||t.on_key_up(e)}))}),[i]),(0,o.useEffect)((function(){var e=function(e){var n=ln[e.code];void 0!==n&&t(n)},n=function(e){var n=ln[e.code];void 0!==n&&r(n)};return window.addEventListener("keydown",e),window.addEventListener("keyup",n),function(){window.removeEventListener("keydown",e),window.removeEventListener("keyup",n)}}),[]),(0,o.useCallback)((function(e){a.current=e}),[]));(0,o.useEffect)((function(){hn(u)}),[u]);var x=(0,o.useCallback)((function(e){for(var n=c.get_audio_buffer_size(),t=new Float32Array(un.memory.buffer,e,n),r=t.length/2,i=wn.createBuffer(2,r,wn.sampleRate),o=0;o<2;o++)for(var a=i.getChannelData(o),s=0;s<r;s++)a[s]=t[2*s+o];var l=wn.createBufferSource();l.buffer=i,l.connect(wn.destination),p.current<=wn.currentTime+.02&&(p.current=wn.currentTime+.06),l.start(p.current),p.current+=n/2/wn.sampleRate}),[]);return(0,o.useEffect)((function(){if(s){var e=new c.WebCartridge(s);p.current=0,b.current=new c.WebEmulator(e,(function(){})),hn(u),m(b.current)}}),[s,c,m]),(0,o.useEffect)((function(){var e=b.current;e&&e.set_audio_buffer_callback(f?x:function(){})}),[b.current,f,x]),(0,o.useEffect)((function(){var e=b.current;if(e)if(d){var n=function(){e.run_frame(),function(e,n){var t=e.get_canvas_data_pointer(),r=n.createImageData(ze,Ue),i=new Uint8Array(un.memory.buffer,t,69120);nn(0,Ue).forEach((function(e){nn(0,ze).forEach((function(n){var t=3*(e*ze+n),o=4*(e*ze+n);r.data[o]=i[t],r.data[o+1]=i[t+1],r.data[o+2]=i[t+2],r.data[o+3]=255}))})),n.putImageData(r,0,0)}(e,u),g.current=window.requestAnimationFrame(n)};n()}else window.cancelAnimationFrame(g.current)}),[d]),null}function yn(){var e=(0,i._)("zoom",1.5),n=e[0],c=e[1],l=(0,i._)("sound_enabled",!1),u=l[0],f=l[1],b=(0,o.useState)(!1),p=b[0],g=b[1],m=(0,o.useState)(),x=m[0],w=m[1],h=(0,o.useState)(null),_=h[0],y=h[1],v={zoom:n},j=function(){var e=(0,o.useState)(null),n=e[0],r=e[1];return(0,o.useEffect)((function(){t.e(670).then(t.bind(t,2670)).then((function(e){e.init(),r(e)})).catch(console.error)}),[]),n}(),S=(0,o.useCallback)((function(e){if(!e)return null;w((function(n){return n||(e.getContext("2d")||n)}))}),[]),A=function(e){g(!1),y(e)};return j?(0,s.jsx)("div",{className:"select-none",children:(0,s.jsx)(d,{children:(0,s.jsxs)(r.f6,{theme:v,children:[(0,s.jsxs)("div",{className:"grid grid-cols-3 justify-between items-center mx-2 pt-2",children:[(0,s.jsx)(en,{}),(0,s.jsx)(He,{zoom:n,onChange:c}),(0,s.jsx)("div",{className:"justify-end",children:(0,s.jsx)(mn,{})})]}),(0,s.jsx)(Fe,{running:p,ref:S}),x&&(0,s.jsx)(_n,{bytes:null==_?void 0:_.bytes,wasmModule:j,running:p,soundEnabled:u,ctx:x}),(0,s.jsxs)("div",{className:"mt-2 flex justify-center items-center text-xs",children:[(0,s.jsx)("button",{className:"mx-2 border rounded px-1 py-1",onClick:function(){!function(e){if(!xn){xn=!0;var n=e.createBuffer(1,1,e.sampleRate),t=e.createBufferSource();t.buffer=n,t.connect(e.destination),t.start(0),e.resume()}}(wn),g((function(e){return!e&&!(e||!_)}))},children:p?"Stop":"Run"}),(0,s.jsx)(an,{className:"mx-2 border rounded px-1 py-1",onLoad:A,children:"Upload ROM"}),(0,s.jsxs)("label",{className:"flex justify-center items-center",children:[(0,s.jsx)("input",{className:"mr-1",type:"checkbox",checked:u,onChange:function(e){return f(e.currentTarget.checked)}}),"Enable sound"]})]}),(null==_?void 0:_.custom)&&(0,s.jsx)("div",{className:"mt-2 flex justify-center text-xs",children:_.name}),(0,s.jsx)("div",{className:"mt-2 flex justify-center text-xs",children:(0,s.jsx)(on,{selectedName:null==_?void 0:_.name,onCartridgeLoad:A})}),(0,s.jsx)("div",{className:"mt-2 flex text-center justify-center text-xs",children:(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{children:"Select one of available demos or upload your custom *.gb file and press Run"}),(0,s.jsxs)("p",{children:["Test ROMs are available in"," ",(0,s.jsx)(a.rU,{className:"underline",to:"/debug",children:"debug mode"})," ","or see"," ",(0,s.jsx)(a.rU,{className:"underline",to:"/test-results",children:"the test results"})]})]})})]})})}):(0,s.jsx)(dn.l,{})}const vn=yn},1344:(e,n,t)=>{"use strict";t.d(n,{y:()=>r});var r=[{name:"demos/cgb-acid2.gbc",url:t.p+"26cd22abc92816c0e20290891808fc41.gbc"},{name:"demos/dmg-acid2.gb",url:t.p+"14f9da3508d034883a3725195d74af75.gb"},{name:"demos/firstwhite.gb",url:t.p+"eecbffb962d1d105cb0234e7c13c6275.gb"},{name:"demos/gejmboj.gb",url:t.p+"ff80b6f5a35c465e3ba709af42967d06.gb"},{name:"demos/lyc.gb",url:t.p+"f6d975ea9196cc1c36c1928c9f681761.gb"},{name:"demos/oh.gb",url:t.p+"657174485b9523ededc4d774eab76cbf.gb"},{name:"demos/opus5.gb",url:t.p+"e2361cd5a8e619b0b8638e5a1588b9dc.gb"},{name:"demos/pocket.gb",url:t.p+"1096465e3ab6cff920824f1ae206a59e.gb"},{name:"wilbertpol-tests/gpu/hblank_ly_scx_timing-C.gb",url:t.p+"b2d4d372e681ac909a7f38d1b75f77cb.gb"},{name:"wilbertpol-tests/gpu/hblank_ly_scx_timing-GS.gb",url:t.p+"ff6eacf9998080cc76dbfe463a2849d7.gb"},{name:"wilbertpol-tests/gpu/hblank_ly_scx_timing_nops.gb",url:t.p+"d3656937d817eb053086ee6d8bab80d3.gb"},{name:"wilbertpol-tests/gpu/hblank_ly_scx_timing_variant_nops.gb",url:t.p+"646e25875d3ae158783238910a61ee77.gb"},{name:"wilbertpol-tests/gpu/intr_0_timing.gb",url:t.p+"72e436b2112ec51ff5b40fac926b1a75.gb"},{name:"wilbertpol-tests/gpu/intr_1_2_timing-GS.gb",url:t.p+"0abff0bc4d116b786518930605edcea1.gb"},{name:"wilbertpol-tests/gpu/intr_1_timing.gb",url:t.p+"19aee2cd763e8e9138c646c47d7a70b4.gb"},{name:"wilbertpol-tests/gpu/intr_2_0_timing.gb",url:t.p+"840b650c03b7d0a5422c98e85049c4cf.gb"},{name:"wilbertpol-tests/gpu/intr_2_mode0_scx1_timing_nops.gb",url:t.p+"078d7d2d7e086d59ff473afadfda60d9.gb"},{name:"wilbertpol-tests/gpu/intr_2_mode0_scx2_timing_nops.gb",url:t.p+"10a695d092e3554d2fa73ea209913b81.gb"},{name:"wilbertpol-tests/gpu/intr_2_mode0_scx3_timing_nops.gb",url:t.p+"70954f565d1507693c92d919c54cac45.gb"},{name:"wilbertpol-tests/gpu/intr_2_mode0_scx4_timing_nops.gb",url:t.p+"717180e5601215d3604d5b3b89cc3bf8.gb"},{name:"wilbertpol-tests/gpu/intr_2_mode0_scx5_timing_nops.gb",url:t.p+"f0aea4c63c0d67309cf01273cefd5027.gb"},{name:"wilbertpol-tests/gpu/intr_2_mode0_scx6_timing_nops.gb",url:t.p+"560819f61dfd31ea08a39b02c0a9f7d3.gb"},{name:"wilbertpol-tests/gpu/intr_2_mode0_scx7_timing_nops.gb",url:t.p+"d20fa0de92ccd7508ad5b34cf6819bad.gb"},{name:"wilbertpol-tests/gpu/intr_2_mode0_scx8_timing_nops.gb",url:t.p+"f6eaca432484118ee929aa1a2e51ac2a.gb"},{name:"wilbertpol-tests/gpu/intr_2_mode0_timing.gb",url:t.p+"1cb876a21a1a402889b57a911077a7bc.gb"},{name:"wilbertpol-tests/gpu/intr_2_mode0_timing_sprites.gb",url:t.p+"64272650978d6e6dad1e4294b4bd5bf4.gb"},{name:"wilbertpol-tests/gpu/intr_2_mode0_timing_sprites_nops.gb",url:t.p+"5ec40ddba053bd4f8dcb77138dea0e1c.gb"},{name:"wilbertpol-tests/gpu/intr_2_mode0_timing_sprites_scx1_nops.gb",url:t.p+"fd15b33efa824d5f2a296e0232e601fb.gb"},{name:"wilbertpol-tests/gpu/intr_2_mode0_timing_sprites_scx2_nops.gb",url:t.p+"7329186344101f1deb9f2dbbda4e64b6.gb"},{name:"wilbertpol-tests/gpu/intr_2_mode0_timing_sprites_scx3_nops.gb",url:t.p+"f6a08adaa131d54baa514fddcd17beb4.gb"},{name:"wilbertpol-tests/gpu/intr_2_mode0_timing_sprites_scx4_nops.gb",url:t.p+"6f02336ac4f15646593c2560741ea6a0.gb"},{name:"wilbertpol-tests/gpu/intr_2_mode3_timing.gb",url:t.p+"23abf634819547be2cd6637a0db4ec75.gb"},{name:"wilbertpol-tests/gpu/intr_2_oam_ok_timing.gb",url:t.p+"ea1b0bcd77a6ec8c17952c1978e9941a.gb"},{name:"wilbertpol-tests/gpu/intr_2_timing.gb",url:t.p+"88d2401cc5291a86c14162243c7f09e3.gb"},{name:"wilbertpol-tests/gpu/lcdon_mode_timing.gb",url:t.p+"d70d8ea1a8e7c210b96e76e620bd1915.gb"},{name:"wilbertpol-tests/gpu/ly00_01_mode0_2.gb",url:t.p+"6c9e72d23b292e4f1c98acfcc496d194.gb"},{name:"wilbertpol-tests/gpu/ly00_mode0_2-GS.gb",url:t.p+"4017bc7090e1acbdbdc33f89a35a3bf2.gb"},{name:"wilbertpol-tests/gpu/ly00_mode1_0-GS.gb",url:t.p+"31b9b95deda96fce5d557e0bb78d08f6.gb"},{name:"wilbertpol-tests/gpu/ly00_mode1_2-C.gb",url:t.p+"3f2c285bc5425790a17777191fe24ecf.gb"},{name:"wilbertpol-tests/gpu/ly00_mode2_3.gb",url:t.p+"2d398f5e07719c4816e207a757955511.gb"},{name:"wilbertpol-tests/gpu/ly00_mode3_0.gb",url:t.p+"05b3149e0ace5196402154bc25e897d6.gb"},{name:"wilbertpol-tests/gpu/ly143_144_145.gb",url:t.p+"e544f621b68b8c95501d580bf9b79c59.gb"},{name:"wilbertpol-tests/gpu/ly143_144_152_153.gb",url:t.p+"8ed068388cc5213aba55b4ecf2d8361f.gb"},{name:"wilbertpol-tests/gpu/ly143_144_mode0_1.gb",url:t.p+"8781f6a07fa3c4afd9c482c93e55e3f4.gb"},{name:"wilbertpol-tests/gpu/ly143_144_mode3_0.gb",url:t.p+"242bb1df9fed18511f9d7a871e73c5e5.gb"},{name:"wilbertpol-tests/gpu/ly_lyc-C.gb",url:t.p+"b6f1da37bfa7425f2c9cd880f0ccf9b8.gb"},{name:"wilbertpol-tests/gpu/ly_lyc-GS.gb",url:t.p+"b8b0e9f82f68bb5f0ae37faad98e5e8a.gb"},{name:"wilbertpol-tests/gpu/ly_lyc_0-C.gb",url:t.p+"ff8e09bb3662ea02a4a7512d1d2ed1ee.gb"},{name:"wilbertpol-tests/gpu/ly_lyc_0-GS.gb",url:t.p+"b87c080767297b2da7540229f80d441c.gb"},{name:"wilbertpol-tests/gpu/ly_lyc_0_write-C.gb",url:t.p+"df0aa55deaea572070a0939bc0568549.gb"},{name:"wilbertpol-tests/gpu/ly_lyc_0_write-GS.gb",url:t.p+"225ee1a4661d3880cb180fd8ec4d16f2.gb"},{name:"wilbertpol-tests/gpu/ly_lyc_144-C.gb",url:t.p+"92fe065bbe94ac445c11877f04cbb834.gb"},{name:"wilbertpol-tests/gpu/ly_lyc_144-GS.gb",url:t.p+"c0bc983eb9f8c5e2d5adc04dd65d7821.gb"},{name:"wilbertpol-tests/gpu/ly_lyc_153-C.gb",url:t.p+"9924ade03ba81c06a5131b1bd40d6807.gb"},{name:"wilbertpol-tests/gpu/ly_lyc_153-GS.gb",url:t.p+"4a37fb4324c554e4746bbee0046bb564.gb"},{name:"wilbertpol-tests/gpu/ly_lyc_153_write-C.gb",url:t.p+"dddad395cdcb17e629667cddbcf21d6f.gb"},{name:"wilbertpol-tests/gpu/ly_lyc_153_write-GS.gb",url:t.p+"f9e6d94ece57e2a9ee75fb8c3ab52bdb.gb"},{name:"wilbertpol-tests/gpu/ly_lyc_write-C.gb",url:t.p+"7832d3a5a9177f6e9b3db40c4ca6e2e2.gb"},{name:"wilbertpol-tests/gpu/ly_lyc_write-GS.gb",url:t.p+"3e896a36f05dee5907ae12a0d158a17a.gb"},{name:"wilbertpol-tests/gpu/ly_new_frame-C.gb",url:t.p+"de57f1289c258971082114c3693339cc.gb"},{name:"wilbertpol-tests/gpu/ly_new_frame-GS.gb",url:t.p+"27519846ee178093ff97e955b563d337.gb"},{name:"wilbertpol-tests/gpu/stat_irq_blocking.gb",url:t.p+"44509244626134644e4d2902d90bfb5c.gb"},{name:"wilbertpol-tests/gpu/stat_write_if-C.gb",url:t.p+"8562b7fc7944bbc60fdfaa4748058baf.gb"},{name:"wilbertpol-tests/gpu/stat_write_if-GS.gb",url:t.p+"e5057147a8bbe05e9ba776ceb1e63dcf.gb"},{name:"wilbertpol-tests/gpu/vblank_if_timing.gb",url:t.p+"2dda3caec6467a1e135b6d9527283c67.gb"},{name:"wilbertpol-tests/gpu/vblank_stat_intr-GS.gb",url:t.p+"4974cc2ed081607ff23aed2ea61e51fe.gb"}]}}]);