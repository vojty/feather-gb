const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/gb_web-dSp3SMDX.js","assets/gb_web-DJqLCFIj.js","assets/rolldown-runtime-QTnfLwEv.js","assets/__vite-plugin-wasm-helper-Y7WR0nsT.js"])))=>i.map(i=>d[i]);
import{r as e,t}from"./rolldown-runtime-QTnfLwEv.js";import{a as n,i as r,o as i,r as a,s as o,t as s}from"./jsx-runtime-BD1_bWpS.js";import{t as c}from"./preload-helper-BIBIFuRL.js";import{o as l,r as u,t as d}from"./FullscreenLoader-Di4EQQWP.js";import{t as f}from"./romsList-S93O0J4k.js";import{n as p,t as m}from"./gb_web-DJqLCFIj.js";var h=t((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.isBrowser=void 0,e.isBrowser=function(){return typeof window<`u`&&window.document!==void 0}})),g=t((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.storage=e.MemoryStorageProxy=e.LocalStorageProxy=e.localStorageAvailable=void 0;var t=h();function n(){try{var e=`@rehooks/local-storage:`+new Date().toISOString();return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(e){return t.isBrowser()&&e instanceof DOMException&&(e.code===22||e.code===1014||e.name===`QuotaExceededError`||e.name===`NS_ERROR_DOM_QUOTA_REACHED`)&&localStorage&&localStorage.length!==0}}e.localStorageAvailable=n;var r=function(){function e(){}return e.prototype.getItem=function(e){return localStorage.getItem(e)},e.prototype.setItem=function(e,t){localStorage.setItem(e,t)},e.prototype.removeItem=function(e){localStorage.removeItem(e)},e}();e.LocalStorageProxy=r;var i=function(){function e(){this._memoryStorage=new Map}return e.prototype.getItem=function(e){return this._memoryStorage.get(e)??null},e.prototype.setItem=function(e,t){this._memoryStorage.set(e,t)},e.prototype.removeItem=function(e){this._memoryStorage.delete(e)},e}();e.MemoryStorageProxy=i,e.storage=function(e){return e?new r:new i}(n())})),_=t((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.deleteFromStorage=e.writeStorage=e.isTypeOfLocalStorageChanged=e.LOCAL_STORAGE_CHANGE_EVENT_NAME=void 0;var t=g(),n=h();e.LOCAL_STORAGE_CHANGE_EVENT_NAME=`onLocalStorageChange`,(function(){if(!n.isBrowser()||typeof window.CustomEvent==`function`)return;function e(e,t){t===void 0&&(t={bubbles:!1,cancelable:!1});var n=document.createEvent(`CustomEvent`);return n.initCustomEvent(e,t?.bubbles??!1,t?.cancelable??!1,t?.detail),n}window.CustomEvent=e})();function r(t){return!!t&&t.type===e.LOCAL_STORAGE_CHANGE_EVENT_NAME}e.isTypeOfLocalStorageChanged=r;function i(r,i){if(n.isBrowser())try{t.storage.setItem(r,typeof i==`object`?JSON.stringify(i):``+i),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:r,value:i}}))}catch(e){throw e instanceof TypeError&&e.message.includes(`circular structure`)?TypeError(`The object that was given to the writeStorage function has circular references.
For more information, check here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value`):e}}e.writeStorage=i;function a(r){n.isBrowser()&&(t.storage.removeItem(r),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:r,value:null}})))}e.deleteFromStorage=a})),ee=t((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.useLocalStorage=void 0;var t=_(),n=h(),r=g(),i=o();function a(e){try{return JSON.parse(e)}catch{return e}}function s(e,o){o===void 0&&(o=null);var s=i.useState(r.storage.getItem(e)===null?o:a(r.storage.getItem(e))),c=s[0],l=s[1],u=i.useCallback(function(n){t.isTypeOfLocalStorageChanged(n)?n.detail.key===e&&l(n.detail.value):n.key===e&&l(n.newValue===null?null:a(n.newValue))},[l,e]);i.useEffect(function(){if(n.isBrowser()){var i=function(e){u(e)};return window.addEventListener(t.LOCAL_STORAGE_CHANGE_EVENT_NAME,i),window.addEventListener(`storage`,i),r.storage.getItem(e)===null&&o!==null&&t.writeStorage(e,o),function(){window.removeEventListener(t.LOCAL_STORAGE_CHANGE_EVENT_NAME,i),window.removeEventListener(`storage`,i)}}},[e,o,u]);var d=i.useCallback(function(n){return n instanceof Function?t.writeStorage(e,n(c)):t.writeStorage(e,n)},[e]),f=i.useCallback(function(){return t.deleteFromStorage(e)},[e]);return[c??o,d,f]}e.useLocalStorage=s})),v=t((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.useLocalStorage=void 0;var t=ee();Object.defineProperty(e,"useLocalStorage",{enumerable:!0,get:function(){return t.useLocalStorage}});var n=_();Object.defineProperty(e,"writeStorage",{enumerable:!0,get:function(){return n.writeStorage}}),Object.defineProperty(e,"deleteFromStorage",{enumerable:!0,get:function(){return n.deleteFromStorage}}),e.default=t.useLocalStorage}))(),y=e(o(),1),b=s(),x=(0,y.createContext)({input:[],onKeyDown:()=>{},onKeyUp:()=>{}});function te({children:e}){let[t,n]=(0,y.useState)([]),r=(0,y.useCallback)(e=>{n(t=>t.filter(t=>e!==t))},[]),i=(0,y.useCallback)(e=>{n(t=>t.includes(e)?t:[...t,e])},[]);return(0,b.jsx)(x.Provider,{value:{input:t,onKeyUp:r,onKeyDown:i},children:e})}var S={ArrowDown:p.ArrowDown,ArrowUp:p.ArrowUp,ArrowLeft:p.ArrowLeft,ArrowRight:p.ArrowRight,KeyD:p.ArrowRight,KeyA:p.ArrowLeft,KeyW:p.ArrowUp,KeyS:p.ArrowDown,KeyJ:p.A,KeyX:p.A,KeyK:p.B,KeyC:p.B,KeyB:p.Start,KeyN:p.Select};function ne(){let{onKeyDown:e,onKeyUp:t,input:n}=(0,y.useContext)(x),r=(0,y.useRef)(void 0);return(0,y.useEffect)(()=>{Object.values(S).forEach(e=>{n.includes(e)?r.current?.on_key_down(e):r.current?.on_key_up(e)})},[n]),(0,y.useEffect)(()=>{let n=t=>{let n=S[t.code];n!==void 0&&e(n)},r=e=>{let n=S[e.code];n!==void 0&&t(n)};return window.addEventListener(`keydown`,n),window.addEventListener(`keyup`,r),()=>{window.removeEventListener(`keydown`,n),window.removeEventListener(`keyup`,r)}},[e,t]),(0,y.useCallback)(e=>{r.current=e},[])}function re(){let[e,t]=(0,y.useState)(null);return(0,y.useEffect)(()=>{c(()=>import(`./gb_web-dSp3SMDX.js`).then(e=>{e.init(),t(e)}),__vite__mapDeps([0,1,2,3])).catch(console.error)},[]),e}var C=!1;function ie(e){if(C)return;C=!0;let t=e.createBuffer(1,1,e.sampleRate),n=e.createBufferSource();n.buffer=t,n.connect(e.destination),n.start(0),e.resume()}function w(e,t,n=1){if(n>0&&e>=t||n<0&&e<=t)return[];let r=[];for(let i=e;n>0?i<t:i>t;i+=n)r.push(i);return r}function ae(e){return fetch(e).then(e=>e.arrayBuffer()).then(e=>new Uint8Array(e))}function oe(){return(0,y.useContext)(x)}function se(){return i()}var T=45,E=23,D=6,O=9,ce=20,le=13,k=36,A=25,j=26,ue=`#393C81`,de=`#8A205E`;function M(e){return t=>`${t.theme.zoom*e}px`}function N(){return a`
    filter: brightness(80%);
  `}var fe=r.div`
  display: flex;
  justify-content: center;
`,pe=r.div`
  display: inline-block;
  margin: 10px;
  background: #eee;
  border-radius: 10px 10px 60px 10px;
  box-shadow: 5px 5px rgba(0, 0, 0, 0.1);
  padding: ${M(20)};
  color: ${ue};
  position: relative;
`,me=r.div`
  background-color: #777;
  border-radius: ${M(7)} ${M(7)} ${M(40)} ${M(7)};
  box-shadow: inset 0px 0px 20px 0px rgba(0, 0, 0, 0.66);
`,he=r.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${M(E)};
  font-size: ${M(D)};
  font-family: Arial;
  color: #b3b3b3;
  padding: 0 ${M(8)} 0;
`,ge=r.div`
  flex: 0 0 auto;
  margin: 0 ${M(5)};
`,_e=r.div`
  display: flex;
  margin-right: ${M(T)};
  padding-bottom: ${M(E)};
`,ve=r.div`
  flex: 1 1 ${e=>e.width};
  height: ${M(3)};
  background-color: #8b1d90;
  box-shadow: 0 ${M(6)} 0 #283593;
  margin-top: -${M(6)};
`,P=r.div`
  margin-left: auto;
  margin-right: auto;
  position: relative;
`,F=r.div`
  position: absolute;
  box-shadow: inset 5px 5px 5px 0px rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`,ye=r.div`
  background-color: ${e=>e.$enabled?`#f00`:`#000`};
  box-shadow: 0 0 3px 1px #ef5350;
  height: ${M(O)};
  width: ${M(O)};
  border-radius: ${e=>e.theme.zoom*O/2}px;
  margin: 10px 20px 10px 10px;
  box-shadow: inset 0px 0px 5px 0px rgba(0, 0, 0, 0.66);
`,be=r.div`
  font-family: Arial;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #b3b3b3;
  width: ${M(T)};
  font-size: ${M(D)};
  margin-bottom: 80px;
`,xe=r.div`
  letter-spacing: 1px;
  font-size: ${M(le)};
`,Se=r.div`
  margin-left: ${M(2)};
  font-size: ${M(ce)};
`,Ce=r.div`
  font-size: ${M(6)};
`,we=r.div`
  background-color: ${de};
  height: ${M(k)};
  width: ${M(k)};
  border-radius: ${M(k/2)};

  ${e=>e.$pressed&&N()}
`,Te=r.div`
  position: relative;
`,I=r(r.div`
  font-size: ${M(12)};
  letter-spacing: ${M(1)};
`)`
  margin-top: ${e=>M(e.$spacing)};
`,Ee=r.div`
  display: inline-flex;
  margin-top: ${M(10)};
  margin-right: -${M(12)};
  transform: rotate(-${A}deg);
  padding: ${M(5)};

  background-color: #dfdfdf;
  box-shadow: 0 0 0 5px #dfdfdf;
  border-radius: ${M(k)};

  > * + * {
    margin-left: ${M(18)};
  }

  ${I} {
    bottom: -${M(25)};
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
  }
`,L=r.div`
  transform: rotate(-${A}deg);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`,De=r.div`
  border-radius: ${M(19/2)};
  background-color: #dfdfdf;
  padding: ${M(5)};
`,Oe=r.div`
  background-color: #868a8d;
  width: ${M(38)};
  height: ${M(9)};
  border-radius: ${M(9/2)};
  ${e=>e.$pressed&&N()}
`,ke=r.div`
  display: flex;
  margin-left: ${M(80)};
  margin-top: ${M(30)};
  margin-bottom: ${M(40)};
  ${L} + ${L} {
    margin-left: ${M(7)};
  }
`,Ae=r.div``,R=function(e){return e[e.HORIZONTAL=0]=`HORIZONTAL`,e[e.VERTICAL=1]=`VERTICAL`,e}({}),je=r.div`
  display: flex;
  justify-content: center;
`,z=r.div`
  width: ${M(2)};
  height: 80%;
  background-color: #353535;
  margin: ${M(2)};
  border-radius: ${M(5)};
`,B=r.div`
  position: relative;
  height: ${M(j)};
  width: ${M(j)};
  background-color: #1b1d1d;
`,V=r(B)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${e=>e.$orientation===1?`row`:`column`};

  ${z} {
    ${e=>e.$pressed&&N()}

    ${e=>e.$orientation===1?a`
            width: ${M(3)};
            height: 60%;
          `:a`
            height: ${M(3)};
            width: 60%;
          `};
  }
`,Me=r(V)`
  border-radius: ${M(5)} 0 0 ${M(5)};
`,Ne=r(V)`
  border-radius: ${M(5)} ${M(5)} 0 0;
`,Pe=r(V)`
  border-radius: 0 ${M(5)} ${M(5)} 0;
`,Fe=r(V)`
  border-radius: 0 0 ${M(5)} ${M(5)};
`,Ie=r(B)`
  &:before {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: ${M(j-7)};
    width: ${M(j-7)};
    background-color: #353535;
    border-radius: 100%;
  }
`,Le=r.div`
  display: flex;
  margin-top: ${M(35)};
`,H=r.div`
  height: ${M(48)};
  width: ${M(5)};
  background-color: #a7a49f;
  border-radius: ${M(5)};
  box-shadow: inset 0px 0px 5px 0px rgb(95 95 95 / 66%);
`,U={Wrapper:fe,Device:pe,Display:me,DisplayTop:he,DisplayHeaderText:ge,DisplayContent:_e,DisplayLine:ve,Screen:P,ScreenOverlay:F,Battery:be,BatteryIndicator:ye,NintendoText:xe,GameBoyText:Se,TradeMarkText:Ce,Controls:Le,ButtonsAB:Ee,CircleButtonWrapper:Te,CircleButton:we,ButtonText:I,ButtonsStartSelect:ke,WideButton:Oe,WideButtonWrapper:De,WideButtonContainer:L,Arrows:Ae,ArrowsLine:je,ArrowUp:Ne,ArrowDown:Fe,ArrowLeft:Me,ArrowRight:Pe,ArrowCenter:Ie,ArrowStripe:z,Speakers:r.div`
  display: inline-flex;
  transform: rotate(-28deg);
  position: absolute;
  bottom: ${M(19)};
  right: ${M(15)};

  ${H} + ${H} {
    margin-left: ${M(8)};
  }
`,Speaker:H};function Re(e){return(0,b.jsxs)(U.Display,{children:[(0,b.jsxs)(U.DisplayTop,{children:[(0,b.jsx)(U.DisplayLine,{width:`25%`}),(0,b.jsx)(U.DisplayHeaderText,{children:`DOT MATRIX WITH STEREO SOUND`}),(0,b.jsx)(U.DisplayLine,{width:`12%`})]}),(0,b.jsxs)(U.DisplayContent,{children:[(0,b.jsxs)(U.Battery,{children:[(0,b.jsx)(U.BatteryIndicator,{$enabled:e.enabled}),`BATTERY`]}),(0,b.jsxs)(U.Screen,{children:[e.children,(0,b.jsx)(U.ScreenOverlay,{})]})]})]})}function ze({running:e},t){let{zoom:n}=se(),{input:r,onKeyDown:i,onKeyUp:a}=oe(),o=r.includes(p.A),s=r.includes(p.B),c=r.includes(p.Start),l=r.includes(p.Select),u=r.includes(p.ArrowLeft),d=r.includes(p.ArrowRight),f=r.includes(p.ArrowUp),m=r.includes(p.ArrowDown);return(0,b.jsx)(U.Wrapper,{children:(0,b.jsxs)(U.Device,{children:[(0,b.jsx)(Re,{enabled:e,children:(0,b.jsx)(`canvas`,{ref:t,style:{display:`block`,imageRendering:`pixelated`,zoom:n},height:144,width:160})}),(0,b.jsxs)(`div`,{className:`flex items-baseline`,children:[(0,b.jsx)(U.NintendoText,{className:`font-pretendo`,children:`Nintendo`}),(0,b.jsx)(U.GameBoyText,{className:`font-gills-sans font-medium italic`,children:`GAME\xA0BOY`}),(0,b.jsx)(U.TradeMarkText,{className:`font-bold`,children:`TM`})]}),(0,b.jsxs)(U.Controls,{children:[(0,b.jsxs)(U.Arrows,{children:[(0,b.jsx)(U.ArrowsLine,{children:(0,b.jsxs)(U.ArrowUp,{onPointerDown:()=>i(p.ArrowUp),onPointerUp:()=>a(p.ArrowUp),$orientation:R.HORIZONTAL,$pressed:f,children:[(0,b.jsx)(U.ArrowStripe,{}),(0,b.jsx)(U.ArrowStripe,{}),(0,b.jsx)(U.ArrowStripe,{})]})}),(0,b.jsxs)(U.ArrowsLine,{children:[(0,b.jsxs)(U.ArrowLeft,{onPointerDown:()=>i(p.ArrowLeft),onPointerUp:()=>a(p.ArrowLeft),$orientation:R.VERTICAL,$pressed:u,children:[(0,b.jsx)(U.ArrowStripe,{}),(0,b.jsx)(U.ArrowStripe,{}),(0,b.jsx)(U.ArrowStripe,{})]}),(0,b.jsx)(U.ArrowCenter,{}),(0,b.jsxs)(U.ArrowRight,{onPointerDown:()=>i(p.ArrowRight),onPointerUp:()=>a(p.ArrowRight),$orientation:R.VERTICAL,$pressed:d,children:[(0,b.jsx)(U.ArrowStripe,{}),(0,b.jsx)(U.ArrowStripe,{}),(0,b.jsx)(U.ArrowStripe,{})]})]}),(0,b.jsx)(U.ArrowsLine,{children:(0,b.jsxs)(U.ArrowDown,{onPointerDown:()=>i(p.ArrowDown),onPointerUp:()=>a(p.ArrowDown),$orientation:R.HORIZONTAL,$pressed:m,children:[(0,b.jsx)(U.ArrowStripe,{}),(0,b.jsx)(U.ArrowStripe,{}),(0,b.jsx)(U.ArrowStripe,{})]})})]}),(0,b.jsx)(`div`,{className:`ml-auto`,children:(0,b.jsxs)(U.ButtonsAB,{className:` font-nes`,children:[(0,b.jsxs)(U.CircleButtonWrapper,{children:[(0,b.jsx)(U.CircleButton,{onPointerDown:()=>i(p.B),onPointerUp:()=>a(p.B),$pressed:s}),(0,b.jsx)(U.ButtonText,{$spacing:10,children:`B`})]}),(0,b.jsxs)(U.CircleButtonWrapper,{children:[(0,b.jsx)(U.CircleButton,{onPointerDown:()=>i(p.A),onPointerUp:()=>a(p.A),$pressed:o}),(0,b.jsx)(U.ButtonText,{$spacing:10,children:`A`})]})]})})]}),(0,b.jsxs)(U.ButtonsStartSelect,{className:`font-nes`,children:[(0,b.jsxs)(U.WideButtonContainer,{children:[(0,b.jsx)(U.WideButtonWrapper,{children:(0,b.jsx)(U.WideButton,{onPointerDown:()=>i(p.Select),onPointerUp:()=>a(p.Select),$pressed:l})}),(0,b.jsx)(U.ButtonText,{$spacing:1,children:`SELECT`})]}),(0,b.jsxs)(U.WideButtonContainer,{children:[(0,b.jsx)(U.WideButtonWrapper,{children:(0,b.jsx)(U.WideButton,{onPointerDown:()=>i(p.Start),onPointerUp:()=>a(p.Start),$pressed:c})}),(0,b.jsx)(U.ButtonText,{$spacing:1,children:`START`})]})]}),(0,b.jsxs)(U.Speakers,{children:[(0,b.jsx)(U.Speaker,{}),(0,b.jsx)(U.Speaker,{}),(0,b.jsx)(U.Speaker,{}),(0,b.jsx)(U.Speaker,{}),(0,b.jsx)(U.Speaker,{}),(0,b.jsx)(U.Speaker,{})]})]})})}var Be=(0,y.forwardRef)(ze),W={Icon:r.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  `,Wrapper:r.div`
    font-size: ${`12px`};
    display: flex;
    align-items: center;
    justify-content: center;
  `,Value:r.div`
    margin: 0 5px;
  `};function Ve(e){let{zoom:t,onChange:n}=e;return(0,b.jsxs)(W.Wrapper,{children:[(0,b.jsx)(W.Icon,{children:(0,b.jsx)(`button`,{type:`button`,onClick:()=>n(Math.max(1,t-.5)),children:`-`})}),(0,b.jsxs)(W.Value,{children:[`Zoom: `,t.toFixed(1)]}),(0,b.jsx)(W.Icon,{children:(0,b.jsx)(`button`,{type:`button`,onClick:()=>n(Math.min(t+.5,5)),children:`+`})})]})}var He=r.div`
  cursor: pointer;
`;function Ue(){let e=l();return(0,b.jsx)(He,{onClick:()=>e(-1),children:`←`})}var G=f.filter(e=>[`demos/cgb-acid2.gbc`,`demos/dmg-acid2.gb`,`demos/gejmboj.gb`,`demos/oh.gb`,`demos/opus5.gb`,`demos/pocket.gb`].includes(e.name)),We=G.find(e=>e.name===`demos/oh.gb`)||null;function Ge({onCartridgeLoad:e,selectedName:t}){let n=(0,y.useCallback)(t=>{t&&ae(t.url).then(n=>e({name:t.name,bytes:n}))},[e]);return(0,y.useEffect)(()=>{n(We)},[n]),(0,b.jsx)(`table`,{children:(0,b.jsx)(`tbody`,{children:G.map(e=>(0,b.jsxs)(`tr`,{className:t===e.name?`font-medium underline`:``,children:[(0,b.jsx)(`td`,{className:`px-1`,children:e.name}),(0,b.jsx)(`td`,{className:`px-1`,children:(0,b.jsx)(`button`,{type:`button`,onClick:()=>n(e),children:`Load`})})]},e.url))})})}var Ke=12,K=20,q=30,J=64,qe=r.span`
  font-size: ${Ke}px;
`,Je=r.canvas`
  display: inline-block;
`,Y=[];function Ye(){let e=(0,y.useRef)(window.performance.now()),t=(0,y.useRef)(null),n=(0,y.useRef)(0);return(0,y.useEffect)(()=>{function r(){n.current=window.requestAnimationFrame(()=>{let n=window.performance.now(),i=n-e.current;e.current=n;let a=Math.round(1e3/i);Y.push(a),Y.length>J&&Y.shift();let o=Math.round(Y.reduce((e,t)=>e+t)/Y.length),s=t.current?.getContext(`2d`);s&&(s.clearRect(0,0,q,K),s.textBaseline=`middle`,s.font=`12px Arial`,s.fillText(o.toString(),1,11)),r()})}return r(),()=>window.cancelAnimationFrame(n.current)},[]),(0,b.jsxs)(qe,{className:`flex items-center justify-end`,children:[`Average FPS: `,(0,b.jsx)(Je,{width:q,height:K,ref:t})]})}function Xe(e){let{onLoad:t,className:n,children:r}=e;return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(`input`,{onChange:e=>{let{files:n}=e.currentTarget;if(!n)return;let r=n[0];r.arrayBuffer().then(e=>new Uint8Array(e)).then(e=>t({name:`Custom: ${r.name}`,bytes:e,custom:!0}))},accept:`.gb,.gbc`,style:{display:`none`},id:`file`,multiple:!0,type:`file`}),(0,b.jsx)(`label`,{className:n,htmlFor:`file`,children:r})]})}var Ze=1.5,Qe=`#6D7C00`,X=new AudioContext({sampleRate:44100});function $e(e,t){let n=e.get_canvas_data_pointer(),r=t.createImageData(160,144),i=new Uint8Array(m.buffer,n,23040*3);w(0,144).forEach(e=>{w(0,160).forEach(t=>{let n=(e*160+t)*3,a=(e*160+t)*4;r.data[a]=i[n],r.data[a+1]=i[n+1],r.data[a+2]=i[n+2],r.data[a+3]=255})}),t.putImageData(r,0,0)}function Z(e){e.fillStyle=Qe,e.fillRect(0,0,160,144)}var Q=2;function et(e){let{bytes:t,wasmModule:n,running:r,ctx:i,soundEnabled:a}=e,o=(0,y.useRef)(void 0),s=(0,y.useRef)(0),c=(0,y.useRef)(0),l=ne();(0,y.useEffect)(()=>{Z(i)},[i]);let u=(0,y.useCallback)(e=>{let t=n.get_audio_buffer_size(),r=new Float32Array(m.buffer,e,t),i=r.length/Q,a=X.createBuffer(Q,i,X.sampleRate);for(let e=0;e<Q;e+=1){let t=a.getChannelData(e);for(let n=0;n<i;n+=1)t[n]=r[n*Q+e]}let o=X.createBufferSource();o.buffer=a,o.connect(X.destination),s.current<=X.currentTime+.02&&(s.current=X.currentTime+.06),o.start(s.current),s.current+=t/Q/X.sampleRate},[n.get_audio_buffer_size]);return(0,y.useEffect)(()=>{if(!t)return;let e=new n.WebCartridge(t);s.current=0,o.current=new n.WebEmulator(e,()=>{}),Z(i),l(o.current)},[i,t,n,l]),(0,y.useEffect)(()=>{let e=o.current;e&&e.set_audio_buffer_callback(a?u:()=>{})},[a,u]),(0,y.useEffect)(()=>{let e=o.current;if(e)if(r){let t=()=>{e.run_frame(),$e(e,i),c.current=window.requestAnimationFrame(t)};t()}else window.cancelAnimationFrame(c.current)},[r,i]),null}function $(){let[e,t]=(0,v.useLocalStorage)(`zoom`,Ze),[r,i]=(0,v.useLocalStorage)(`sound_enabled`,!1),[a,o]=(0,y.useState)(!1),[s,c]=(0,y.useState)(),[l,f]=(0,y.useState)(null),p={zoom:e},m=re(),h=()=>{ie(X),o(e=>e?!1:!!(!e&&l))},g=(0,y.useCallback)(e=>{e&&c(t=>t||e.getContext(`2d`)||t)},[]),_=(0,y.useCallback)(e=>{o(!1),f(e)},[]);return m?(0,b.jsx)(`div`,{className:`select-none`,children:(0,b.jsx)(te,{children:(0,b.jsxs)(n,{theme:p,children:[(0,b.jsxs)(`div`,{className:`grid grid-cols-3 justify-between items-center mx-2 pt-2`,children:[(0,b.jsx)(Ue,{}),(0,b.jsx)(Ve,{zoom:e,onChange:t}),(0,b.jsx)(`div`,{className:`justify-end`,children:(0,b.jsx)(Ye,{})})]}),(0,b.jsx)(Be,{running:a,ref:g}),s&&(0,b.jsx)(et,{bytes:l?.bytes,wasmModule:m,running:a,soundEnabled:r,ctx:s}),(0,b.jsxs)(`div`,{className:`mt-2 flex justify-center items-center text-xs`,children:[(0,b.jsx)(`button`,{className:`mx-2 border rounded px-1 py-1`,type:`button`,onClick:h,children:a?`Stop`:`Run`}),(0,b.jsx)(Xe,{className:`mx-2 border rounded px-1 py-1`,onLoad:_,children:`Upload ROM`}),(0,b.jsxs)(`label`,{className:`flex justify-center items-center`,htmlFor:`soundEnableCheckbox`,children:[(0,b.jsx)(`input`,{id:`soundEnableCheckbox`,className:`mr-1`,type:`checkbox`,checked:r,onChange:e=>i(e.currentTarget.checked)}),`Enable sound`]})]}),l?.custom&&(0,b.jsx)(`div`,{className:`mt-2 flex justify-center text-xs`,children:l.name}),(0,b.jsx)(`div`,{className:`mt-2 flex justify-center text-xs`,children:(0,b.jsx)(Ge,{selectedName:l?.name,onCartridgeLoad:_})}),(0,b.jsx)(`div`,{className:`mt-2 flex text-center justify-center text-xs`,children:(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`p`,{children:`Select one of the available demos or upload your custom *.gb file and press Run`}),(0,b.jsxs)(`p`,{children:[`The test ROMs are available in`,` `,(0,b.jsx)(u,{className:`underline`,to:`/debug`,children:`debug mode`}),`. You can see the test results`,` `,(0,b.jsx)(u,{className:`underline`,to:`/test-results`,children:`here`}),`.`]})]})})]})})}):(0,b.jsx)(d,{})}export{$ as Play,$ as default};