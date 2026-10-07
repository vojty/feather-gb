const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/gb_web-Dyu4wn5B.js","assets/gb_web-Bfia1Jny.js","assets/rolldown-runtime-hePW80VL.js","assets/__vite-plugin-wasm-helper-Y7WR0nsT.js"])))=>i.map(i=>d[i]);
import{r as e,t}from"./rolldown-runtime-hePW80VL.js";import{a as n,i as r,o as i,r as a,s as o,t as s}from"./jsx-runtime-Bx-Vmc5Q.js";import{t as c}from"./preload-helper-CIPaJz92.js";import{o as l,r as u,t as d}from"./FullscreenLoader-Cr99_Pvp.js";import{t as f}from"./romsList-S93O0J4k.js";import{n as p,t as m}from"./gb_web-Bfia1Jny.js";var h=t((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.isBrowser=void 0,e.isBrowser=function(){return typeof window<`u`&&window.document!==void 0}})),g=t((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.storage=e.MemoryStorageProxy=e.LocalStorageProxy=e.localStorageAvailable=void 0;var t=h();function n(){try{var e=`@rehooks/local-storage:`+new Date().toISOString();return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(e){return t.isBrowser()&&e instanceof DOMException&&(e.code===22||e.code===1014||e.name===`QuotaExceededError`||e.name===`NS_ERROR_DOM_QUOTA_REACHED`)&&localStorage&&localStorage.length!==0}}e.localStorageAvailable=n;var r=function(){function e(){}return e.prototype.getItem=function(e){return localStorage.getItem(e)},e.prototype.setItem=function(e,t){localStorage.setItem(e,t)},e.prototype.removeItem=function(e){localStorage.removeItem(e)},e}();e.LocalStorageProxy=r;var i=function(){function e(){this._memoryStorage=new Map}return e.prototype.getItem=function(e){return this._memoryStorage.get(e)??null},e.prototype.setItem=function(e,t){this._memoryStorage.set(e,t)},e.prototype.removeItem=function(e){this._memoryStorage.delete(e)},e}();e.MemoryStorageProxy=i,e.storage=function(e){return e?new r:new i}(n())})),_=t((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.deleteFromStorage=e.writeStorage=e.isTypeOfLocalStorageChanged=e.LOCAL_STORAGE_CHANGE_EVENT_NAME=void 0;var t=g(),n=h();e.LOCAL_STORAGE_CHANGE_EVENT_NAME=`onLocalStorageChange`,(function(){if(!n.isBrowser()||typeof window.CustomEvent==`function`)return;function e(e,t){t===void 0&&(t={bubbles:!1,cancelable:!1});var n=document.createEvent(`CustomEvent`);return n.initCustomEvent(e,t?.bubbles??!1,t?.cancelable??!1,t?.detail),n}window.CustomEvent=e})();function r(t){return!!t&&t.type===e.LOCAL_STORAGE_CHANGE_EVENT_NAME}e.isTypeOfLocalStorageChanged=r;function i(r,i){if(n.isBrowser())try{t.storage.setItem(r,typeof i==`object`?JSON.stringify(i):``+i),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:r,value:i}}))}catch(e){throw e instanceof TypeError&&e.message.includes(`circular structure`)?TypeError(`The object that was given to the writeStorage function has circular references.
For more information, check here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value`):e}}e.writeStorage=i;function a(r){n.isBrowser()&&(t.storage.removeItem(r),window.dispatchEvent(new CustomEvent(e.LOCAL_STORAGE_CHANGE_EVENT_NAME,{detail:{key:r,value:null}})))}e.deleteFromStorage=a})),ee=t((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.useLocalStorage=void 0;var t=_(),n=h(),r=g(),i=o();function a(e){try{return JSON.parse(e)}catch{return e}}function s(e,o){o===void 0&&(o=null);var s=i.useState(r.storage.getItem(e)===null?o:a(r.storage.getItem(e))),c=s[0],l=s[1],u=i.useCallback(function(n){t.isTypeOfLocalStorageChanged(n)?n.detail.key===e&&l(n.detail.value):n.key===e&&l(n.newValue===null?null:a(n.newValue))},[l,e]);i.useEffect(function(){if(n.isBrowser()){var i=function(e){u(e)};return window.addEventListener(t.LOCAL_STORAGE_CHANGE_EVENT_NAME,i),window.addEventListener(`storage`,i),r.storage.getItem(e)===null&&o!==null&&t.writeStorage(e,o),function(){window.removeEventListener(t.LOCAL_STORAGE_CHANGE_EVENT_NAME,i),window.removeEventListener(`storage`,i)}}},[e,o,u]);var d=i.useCallback(function(n){return n instanceof Function?t.writeStorage(e,n(c)):t.writeStorage(e,n)},[e]),f=i.useCallback(function(){return t.deleteFromStorage(e)},[e]);return[c??o,d,f]}e.useLocalStorage=s})),v=t((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.useLocalStorage=void 0;var t=ee();Object.defineProperty(e,"useLocalStorage",{enumerable:!0,get:function(){return t.useLocalStorage}});var n=_();Object.defineProperty(e,"writeStorage",{enumerable:!0,get:function(){return n.writeStorage}}),Object.defineProperty(e,"deleteFromStorage",{enumerable:!0,get:function(){return n.deleteFromStorage}}),e.default=t.useLocalStorage}))(),y=e(o(),1),b=s(),x=(0,y.createContext)({input:[],onKeyDown:()=>{},onKeyUp:()=>{}});function te({children:e}){let[t,n]=(0,y.useState)([]),r=(0,y.useCallback)(e=>{n(t=>t.filter(t=>e!==t))},[]),i=(0,y.useCallback)(e=>{n(t=>t.includes(e)?t:[...t,e])},[]);return(0,b.jsx)(x.Provider,{value:{input:t,onKeyUp:r,onKeyDown:i},children:e})}var S={ArrowDown:p.ArrowDown,ArrowUp:p.ArrowUp,ArrowLeft:p.ArrowLeft,ArrowRight:p.ArrowRight,KeyD:p.ArrowRight,KeyA:p.ArrowLeft,KeyW:p.ArrowUp,KeyS:p.ArrowDown,KeyJ:p.A,KeyX:p.A,KeyK:p.B,KeyC:p.B,KeyB:p.Start,KeyN:p.Select};function ne(){let{onKeyDown:e,onKeyUp:t,input:n}=(0,y.useContext)(x),r=(0,y.useRef)(void 0);return(0,y.useEffect)(()=>{Object.values(S).forEach(e=>{n.includes(e)?r.current?.on_key_down(e):r.current?.on_key_up(e)})},[n]),(0,y.useEffect)(()=>{let n=t=>{let n=S[t.code];n!==void 0&&e(n)},r=e=>{let n=S[e.code];n!==void 0&&t(n)};return window.addEventListener(`keydown`,n),window.addEventListener(`keyup`,r),()=>{window.removeEventListener(`keydown`,n),window.removeEventListener(`keyup`,r)}},[e,t]),(0,y.useCallback)(e=>{r.current=e},[])}function re(){let[e,t]=(0,y.useState)(null);return(0,y.useEffect)(()=>{c(()=>import(`./gb_web-Dyu4wn5B.js`).then(e=>{e.init(),t(e)}),__vite__mapDeps([0,1,2,3])).catch(console.error)},[]),e}var C=2,w=.06,ie=.02,ae=.2,oe=.005,se=.1,T=class{speed=1;context=new AudioContext;scheduledUntil=0;smoothedBufferLevel=w;underrun=!1;audioClock={id:`audio`,now:()=>this.context.currentTime};performanceClock={id:`performance`,now:()=>performance.now()/1e3};get clock(){return this.context.state===`running`?this.audioClock:this.performanceClock}warmup(){let e=this.context.createBufferSource();e.buffer=this.context.createBuffer(1,1,this.context.sampleRate),e.connect(this.context.destination),e.start(0),this.context.resume()}reset(){this.scheduledUntil=0,this.underrun=!1}play(e,t){let n=this.scheduledUntil-this.context.currentTime;if(n<ie)this.restartSchedule(),n=w;else if(n>ae)return;let r=this.context.createBufferSource();r.buffer=this.createAudioBuffer(e,t),r.playbackRate.value=this.getPlaybackRate(n),r.connect(this.context.destination),r.start(this.scheduledUntil),this.scheduledUntil+=r.buffer.duration/r.playbackRate.value}takeUnderrun(){let{underrun:e}=this;return this.underrun=!1,e}restartSchedule(){this.scheduledUntil=this.context.currentTime+w,this.smoothedBufferLevel=w,this.underrun=!0}getPlaybackRate(e){this.smoothedBufferLevel+=se*(e-this.smoothedBufferLevel);let t=ce(this.smoothedBufferLevel/(2*w),0,1);return this.speed*(.995+2*t*oe)}createAudioBuffer(e,t){let n=e.length/C,r=this.context.createBuffer(C,n,t);for(let t=0;t<C;t+=1){let i=r.getChannelData(t);for(let r=0;r<n;r+=1)i[r]=e[r*C+t]}return r}};function ce(e,t,n){return Math.min(Math.max(e,t),n)}var E=120,le=class{lastTimestamp;intervals=[];interval;addTimestamp(e){let t=this.lastTimestamp;return this.lastTimestamp=e,t===void 0?1:(this.intervals.push(e-t),this.intervals.length>E&&this.intervals.shift(),this.interval=this.measureInterval(),this.interval?Math.round((e-t)/this.interval):1)}get refreshRate(){return this.interval?1e3/this.interval:void 0}measureInterval(){if(this.intervals.length<E)return;let e=ue(this.intervals),t=0,n=0;for(let r of this.intervals)t+=r,n+=Math.round(r/e);return n>0?t/n:void 0}};function ue(e){let t=[...e].sort((e,t)=>e-t);return t[Math.floor(t.length/2)]}var de=.01,fe=.1,pe=class{timing;getClock;speed=1;refreshRateMonitor=new le;gbFrameRate;maxBudget;mode;clock;lastClockTime=0;budget=0;catchUpSkipped=!1;constructor(e,t){this.timing=e,this.getClock=t,this.gbFrameRate=e.cpuClockSpeed/e.cyclesPerFrame,this.maxBudget=fe*e.cpuClockSpeed}advance(e){let t=this.refreshRateMonitor.addTimestamp(e),n=this.getVsyncTiming(),r;n?(this.speed=n.speed,this.setMode(`vsync`),r=t/n.vsyncsPerFrame*this.timing.cyclesPerFrame):(this.speed=1,this.setMode(`clock`),r=this.clockSecondsPassed()*this.timing.cpuClockSpeed),this.catchUpSkipped&&(this.catchUpSkipped=!1,r=Math.min(r,this.timing.cyclesPerFrame)),this.budget=Math.min(this.budget+r,this.maxBudget)}isFrameDue(){return this.budget>=this.timing.cyclesPerFrame/2}onFrameExecuted(e){this.budget-=e}skipCatchUp(){this.budget=Math.min(this.budget,0),this.catchUpSkipped=!0}getVsyncTiming(){let{refreshRate:e}=this.refreshRateMonitor;if(!e)return null;let t=Math.round(e/this.gbFrameRate),n=e/t/this.gbFrameRate;return t<1||Math.abs(n-1)>de?null:{vsyncsPerFrame:t,speed:n}}clockSecondsPassed(){let e=this.getClock();e.id!==this.clock?.id&&(this.clock=e,this.lastClockTime=e.now(),console.debug(`Pacing: ${e.id} clock`));let t=e.now(),n=t-this.lastClockTime;return this.lastClockTime=t,n}setMode(e){this.mode!==e&&(this.mode=e,e===`vsync`&&(this.clock=void 0,console.debug(`Pacing: vsync, ${this.refreshRateMonitor.refreshRate?.toFixed(2)} Hz, speed ${this.speed.toFixed(4)}`)))}};function me(){return(0,y.useContext)(x)}function he(){return i()}var D=45,O=23,k=6,A=9,ge=20,_e=13,j=36,M=25,N=26,ve=`#393C81`,ye=`#8A205E`;function P(e){return t=>`${t.theme.zoom*e}px`}function F(){return a`
    filter: brightness(80%);
  `}var be=r.div`
  display: flex;
  justify-content: center;
`,xe=r.div`
  display: inline-block;
  margin: 10px;
  background: #eee;
  border-radius: 10px 10px 60px 10px;
  box-shadow: 5px 5px rgba(0, 0, 0, 0.1);
  padding: ${P(20)};
  color: ${ve};
  position: relative;
`,Se=r.div`
  background-color: #777;
  border-radius: ${P(7)} ${P(7)} ${P(40)} ${P(7)};
  box-shadow: inset 0px 0px 20px 0px rgba(0, 0, 0, 0.66);
`,Ce=r.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${P(O)};
  font-size: ${P(k)};
  font-family: Arial;
  color: #b3b3b3;
  padding: 0 ${P(8)} 0;
`,we=r.div`
  flex: 0 0 auto;
  margin: 0 ${P(5)};
`,Te=r.div`
  display: flex;
  margin-right: ${P(D)};
  padding-bottom: ${P(O)};
`,Ee=r.div`
  flex: 1 1 ${e=>e.width};
  height: ${P(3)};
  background-color: #8b1d90;
  box-shadow: 0 ${P(6)} 0 #283593;
  margin-top: -${P(6)};
`,De=r.div`
  margin-left: auto;
  margin-right: auto;
  position: relative;
`,Oe=r.div`
  position: absolute;
  box-shadow: inset 5px 5px 5px 0px rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`,ke=r.div`
  background-color: ${e=>e.$enabled?`#f00`:`#000`};
  box-shadow: 0 0 3px 1px #ef5350;
  height: ${P(A)};
  width: ${P(A)};
  border-radius: ${e=>e.theme.zoom*A/2}px;
  margin: 10px 20px 10px 10px;
  box-shadow: inset 0px 0px 5px 0px rgba(0, 0, 0, 0.66);
`,Ae=r.div`
  font-family: Arial;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #b3b3b3;
  width: ${P(D)};
  font-size: ${P(k)};
  margin-bottom: 80px;
`,je=r.div`
  letter-spacing: 1px;
  font-size: ${P(_e)};
`,Me=r.div`
  margin-left: ${P(2)};
  font-size: ${P(ge)};
`,Ne=r.div`
  font-size: ${P(6)};
`,Pe=r.div`
  background-color: ${ye};
  height: ${P(j)};
  width: ${P(j)};
  border-radius: ${P(j/2)};

  ${e=>e.$pressed&&F()}
`,Fe=r.div`
  position: relative;
`,Ie=r.div`
  font-size: ${P(12)};
  letter-spacing: ${P(1)};
`,I=r(Ie)`
  margin-top: ${e=>P(e.$spacing)};
`,Le=r.div`
  display: inline-flex;
  margin-top: ${P(10)};
  margin-right: -${P(12)};
  transform: rotate(-${M}deg);
  padding: ${P(5)};

  background-color: #dfdfdf;
  box-shadow: 0 0 0 5px #dfdfdf;
  border-radius: ${P(j)};

  > * + * {
    margin-left: ${P(18)};
  }

  ${I} {
    bottom: -${P(25)};
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
  }
`,L=r.div`
  transform: rotate(-${M}deg);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`,Re=r.div`
  border-radius: ${P(19/2)};
  background-color: #dfdfdf;
  padding: ${P(5)};
`,ze=r.div`
  background-color: #868a8d;
  width: ${P(38)};
  height: ${P(9)};
  border-radius: ${P(9/2)};
  ${e=>e.$pressed&&F()}
`,Be=r.div`
  display: flex;
  margin-left: ${P(80)};
  margin-top: ${P(30)};
  margin-bottom: ${P(40)};
  ${L} + ${L} {
    margin-left: ${P(7)};
  }
`,Ve=r.div``,R=function(e){return e[e.HORIZONTAL=0]=`HORIZONTAL`,e[e.VERTICAL=1]=`VERTICAL`,e}({}),He=r.div`
  display: flex;
  justify-content: center;
`,z=r.div`
  width: ${P(2)};
  height: 80%;
  background-color: #353535;
  margin: ${P(2)};
  border-radius: ${P(5)};
`,B=r.div`
  position: relative;
  height: ${P(N)};
  width: ${P(N)};
  background-color: #1b1d1d;
`,V=r(B)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${e=>e.$orientation===1?`row`:`column`};

  ${z} {
    ${e=>e.$pressed&&F()}

    ${e=>e.$orientation===1?a`
            width: ${P(3)};
            height: 60%;
          `:a`
            height: ${P(3)};
            width: 60%;
          `};
  }
`,Ue=r(V)`
  border-radius: ${P(5)} 0 0 ${P(5)};
`,We=r(V)`
  border-radius: ${P(5)} ${P(5)} 0 0;
`,Ge=r(V)`
  border-radius: 0 ${P(5)} ${P(5)} 0;
`,Ke=r(V)`
  border-radius: 0 0 ${P(5)} ${P(5)};
`,qe=r(B)`
  &:before {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: ${P(19)};
    width: ${P(19)};
    background-color: #353535;
    border-radius: 100%;
  }
`,Je=r.div`
  display: flex;
  margin-top: ${P(35)};
`,H=r.div`
  height: ${P(48)};
  width: ${P(5)};
  background-color: #a7a49f;
  border-radius: ${P(5)};
  box-shadow: inset 0px 0px 5px 0px rgb(95 95 95 / 66%);
`,U={Wrapper:be,Device:xe,Display:Se,DisplayTop:Ce,DisplayHeaderText:we,DisplayContent:Te,DisplayLine:Ee,Screen:De,ScreenOverlay:Oe,Battery:Ae,BatteryIndicator:ke,NintendoText:je,GameBoyText:Me,TradeMarkText:Ne,Controls:Je,ButtonsAB:Le,CircleButtonWrapper:Fe,CircleButton:Pe,ButtonText:I,ButtonsStartSelect:Be,WideButton:ze,WideButtonWrapper:Re,WideButtonContainer:L,Arrows:Ve,ArrowsLine:He,ArrowUp:We,ArrowDown:Ke,ArrowLeft:Ue,ArrowRight:Ge,ArrowCenter:qe,ArrowStripe:z,Speakers:r.div`
  display: inline-flex;
  transform: rotate(-28deg);
  position: absolute;
  bottom: ${P(19)};
  right: ${P(15)};

  ${H} + ${H} {
    margin-left: ${P(8)};
  }
`,Speaker:H};function Ye(e){return(0,b.jsxs)(U.Display,{children:[(0,b.jsxs)(U.DisplayTop,{children:[(0,b.jsx)(U.DisplayLine,{width:`25%`}),(0,b.jsx)(U.DisplayHeaderText,{children:`DOT MATRIX WITH STEREO SOUND`}),(0,b.jsx)(U.DisplayLine,{width:`12%`})]}),(0,b.jsxs)(U.DisplayContent,{children:[(0,b.jsxs)(U.Battery,{children:[(0,b.jsx)(U.BatteryIndicator,{$enabled:e.enabled}),`BATTERY`]}),(0,b.jsxs)(U.Screen,{children:[e.children,(0,b.jsx)(U.ScreenOverlay,{})]})]})]})}function Xe({running:e},t){let{zoom:n}=he(),{input:r,onKeyDown:i,onKeyUp:a}=me(),o=r.includes(p.A),s=r.includes(p.B),c=r.includes(p.Start),l=r.includes(p.Select),u=r.includes(p.ArrowLeft),d=r.includes(p.ArrowRight),f=r.includes(p.ArrowUp),m=r.includes(p.ArrowDown);return(0,b.jsx)(U.Wrapper,{children:(0,b.jsxs)(U.Device,{children:[(0,b.jsx)(Ye,{enabled:e,children:(0,b.jsx)(`canvas`,{ref:t,style:{display:`block`,imageRendering:`pixelated`,zoom:n},height:144,width:160})}),(0,b.jsxs)(`div`,{className:`flex items-baseline`,children:[(0,b.jsx)(U.NintendoText,{className:`font-pretendo`,children:`Nintendo`}),(0,b.jsx)(U.GameBoyText,{className:`font-gills-sans font-medium italic`,children:`GAME\xA0BOY`}),(0,b.jsx)(U.TradeMarkText,{className:`font-bold`,children:`TM`})]}),(0,b.jsxs)(U.Controls,{children:[(0,b.jsxs)(U.Arrows,{children:[(0,b.jsx)(U.ArrowsLine,{children:(0,b.jsxs)(U.ArrowUp,{onPointerDown:()=>i(p.ArrowUp),onPointerUp:()=>a(p.ArrowUp),$orientation:R.HORIZONTAL,$pressed:f,children:[(0,b.jsx)(U.ArrowStripe,{}),(0,b.jsx)(U.ArrowStripe,{}),(0,b.jsx)(U.ArrowStripe,{})]})}),(0,b.jsxs)(U.ArrowsLine,{children:[(0,b.jsxs)(U.ArrowLeft,{onPointerDown:()=>i(p.ArrowLeft),onPointerUp:()=>a(p.ArrowLeft),$orientation:R.VERTICAL,$pressed:u,children:[(0,b.jsx)(U.ArrowStripe,{}),(0,b.jsx)(U.ArrowStripe,{}),(0,b.jsx)(U.ArrowStripe,{})]}),(0,b.jsx)(U.ArrowCenter,{}),(0,b.jsxs)(U.ArrowRight,{onPointerDown:()=>i(p.ArrowRight),onPointerUp:()=>a(p.ArrowRight),$orientation:R.VERTICAL,$pressed:d,children:[(0,b.jsx)(U.ArrowStripe,{}),(0,b.jsx)(U.ArrowStripe,{}),(0,b.jsx)(U.ArrowStripe,{})]})]}),(0,b.jsx)(U.ArrowsLine,{children:(0,b.jsxs)(U.ArrowDown,{onPointerDown:()=>i(p.ArrowDown),onPointerUp:()=>a(p.ArrowDown),$orientation:R.HORIZONTAL,$pressed:m,children:[(0,b.jsx)(U.ArrowStripe,{}),(0,b.jsx)(U.ArrowStripe,{}),(0,b.jsx)(U.ArrowStripe,{})]})})]}),(0,b.jsx)(`div`,{className:`ml-auto`,children:(0,b.jsxs)(U.ButtonsAB,{className:` font-nes`,children:[(0,b.jsxs)(U.CircleButtonWrapper,{children:[(0,b.jsx)(U.CircleButton,{onPointerDown:()=>i(p.B),onPointerUp:()=>a(p.B),$pressed:s}),(0,b.jsx)(U.ButtonText,{$spacing:10,children:`B`})]}),(0,b.jsxs)(U.CircleButtonWrapper,{children:[(0,b.jsx)(U.CircleButton,{onPointerDown:()=>i(p.A),onPointerUp:()=>a(p.A),$pressed:o}),(0,b.jsx)(U.ButtonText,{$spacing:10,children:`A`})]})]})})]}),(0,b.jsxs)(U.ButtonsStartSelect,{className:`font-nes`,children:[(0,b.jsxs)(U.WideButtonContainer,{children:[(0,b.jsx)(U.WideButtonWrapper,{children:(0,b.jsx)(U.WideButton,{onPointerDown:()=>i(p.Select),onPointerUp:()=>a(p.Select),$pressed:l})}),(0,b.jsx)(U.ButtonText,{$spacing:1,children:`SELECT`})]}),(0,b.jsxs)(U.WideButtonContainer,{children:[(0,b.jsx)(U.WideButtonWrapper,{children:(0,b.jsx)(U.WideButton,{onPointerDown:()=>i(p.Start),onPointerUp:()=>a(p.Start),$pressed:c})}),(0,b.jsx)(U.ButtonText,{$spacing:1,children:`START`})]})]}),(0,b.jsxs)(U.Speakers,{children:[(0,b.jsx)(U.Speaker,{}),(0,b.jsx)(U.Speaker,{}),(0,b.jsx)(U.Speaker,{}),(0,b.jsx)(U.Speaker,{}),(0,b.jsx)(U.Speaker,{}),(0,b.jsx)(U.Speaker,{})]})]})})}var Ze=(0,y.forwardRef)(Xe),W={Icon:r.div`
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
  `};function Qe(e){let{zoom:t,onChange:n}=e;return(0,b.jsxs)(W.Wrapper,{children:[(0,b.jsx)(W.Icon,{children:(0,b.jsx)(`button`,{type:`button`,onClick:()=>n(Math.max(1,t-.5)),children:`-`})}),(0,b.jsxs)(W.Value,{children:[`Zoom: `,t.toFixed(1)]}),(0,b.jsx)(W.Icon,{children:(0,b.jsx)(`button`,{type:`button`,onClick:()=>n(Math.min(t+.5,5)),children:`+`})})]})}var $e=r.div`
  cursor: pointer;
`;function et(){let e=l();return(0,b.jsx)($e,{onClick:()=>e(-1),children:`←`})}function tt(e){return fetch(e).then(e=>e.arrayBuffer()).then(e=>new Uint8Array(e))}var G=f.filter(e=>[`demos/cgb-acid2.gbc`,`demos/dmg-acid2.gb`,`demos/gejmboj.gb`,`demos/oh.gb`,`demos/opus5.gb`,`demos/pocket.gb`].includes(e.name)),nt=G.find(e=>e.name===`demos/oh.gb`)||null;function rt({onCartridgeLoad:e,selectedName:t}){let n=(0,y.useCallback)(t=>{t&&tt(t.url).then(n=>e({name:t.name,bytes:n}))},[e]);return(0,y.useEffect)(()=>{n(nt)},[n]),(0,b.jsx)(`table`,{children:(0,b.jsx)(`tbody`,{children:G.map(e=>(0,b.jsxs)(`tr`,{className:t===e.name?`font-medium underline`:``,children:[(0,b.jsx)(`td`,{className:`px-1`,children:e.name}),(0,b.jsx)(`td`,{className:`px-1`,children:(0,b.jsx)(`button`,{type:`button`,onClick:()=>n(e),children:`Load`})})]},e.url))})})}var it=12,K=20,q=30,at=64,ot=r.span`
  font-size: ${it}px;
`,st=r.canvas`
  display: inline-block;
`,J=[];function ct(){let e=(0,y.useRef)(window.performance.now()),t=(0,y.useRef)(null),n=(0,y.useRef)(0);return(0,y.useEffect)(()=>{function r(){n.current=window.requestAnimationFrame(()=>{let n=window.performance.now(),i=n-e.current;e.current=n;let a=Math.round(1e3/i);J.push(a),J.length>at&&J.shift();let o=Math.round(J.reduce((e,t)=>e+t)/J.length),s=t.current?.getContext(`2d`);s&&(s.clearRect(0,0,q,K),s.textBaseline=`middle`,s.font=`12px Arial`,s.fillText(o.toString(),1,11)),r()})}return r(),()=>window.cancelAnimationFrame(n.current)},[]),(0,b.jsxs)(ot,{className:`flex items-center justify-end`,children:[`Average FPS: `,(0,b.jsx)(st,{width:q,height:K,ref:t})]})}function Y(e){let{onLoad:t,className:n,children:r}=e;return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(`input`,{onChange:e=>{let{files:n}=e.currentTarget;if(!n)return;let r=n[0];r.arrayBuffer().then(e=>new Uint8Array(e)).then(e=>t({name:`Custom: ${r.name}`,bytes:e,custom:!0}))},accept:`.gb,.gbc`,style:{display:`none`},id:`file`,multiple:!0,type:`file`}),(0,b.jsx)(`label`,{className:n,htmlFor:`file`,children:r})]})}var lt=1.5,ut=`#6D7C00`,X=new T,Z=3,dt=4;function ft(e,t){let n=23040,r=new Uint8Array(m.buffer,e.get_canvas_data_pointer(),n*Z),i=t.createImageData(160,144),a=i.data;for(let e=0;e<n;e+=1){let t=e*Z,n=e*dt;a[n]=r[t],a[n+1]=r[t+1],a[n+2]=r[t+2],a[n+3]=255}t.putImageData(i,0,0)}function Q(e){e.fillStyle=ut,e.fillRect(0,0,160,144)}function pt(e){let{bytes:t,wasmModule:n,running:r,ctx:i,soundEnabled:a}=e,o=(0,y.useRef)(void 0),s=ne();(0,y.useEffect)(()=>{Q(i)},[i]);let c=(0,y.useCallback)(e=>{let t=new Float32Array(m.buffer,e,n.get_audio_buffer_size());X.play(t,n.get_audio_sample_rate())},[n]);return(0,y.useEffect)(()=>{if(!t)return;let e=new n.WebCartridge(t);X.reset(),o.current=new n.WebEmulator(e,()=>{}),Q(i),s(o.current)},[i,t,n,s]),(0,y.useEffect)(()=>{o.current?.set_audio_buffer_callback(a?c:()=>{})},[a,c,t]),(0,y.useEffect)(()=>{let e=o.current;if(!e||!r)return;let t=new pe({cpuClockSpeed:n.get_cpu_clock_speed(),cyclesPerFrame:n.get_cycles_per_frame()},()=>X.clock),a=n=>{t.advance(n),X.speed=t.speed;let r=!1;for(;t.isFrameDue();)t.onFrameExecuted(e.run_frame()),r=!0,X.takeUnderrun()&&t.skipCatchUp();r&&ft(e,i),s=window.requestAnimationFrame(a)},s=window.requestAnimationFrame(a);return()=>window.cancelAnimationFrame(s)},[r,i,n]),null}function $(){let[e,t]=(0,v.useLocalStorage)(`zoom`,lt),[r,i]=(0,v.useLocalStorage)(`sound_enabled`,!1),[a,o]=(0,y.useState)(!1),[s,c]=(0,y.useState)(),[l,f]=(0,y.useState)(null),p={zoom:e},m=re(),h=()=>{X.warmup(),o(e=>!e&&!(e||!l))},g=(0,y.useCallback)(e=>{e&&c(t=>t||e.getContext(`2d`)||t)},[]),_=(0,y.useCallback)(e=>{o(!1),f(e)},[]);return m?(0,b.jsx)(`div`,{className:`select-none`,children:(0,b.jsx)(te,{children:(0,b.jsxs)(n,{theme:p,children:[(0,b.jsxs)(`div`,{className:`grid grid-cols-3 justify-between items-center mx-2 pt-2`,children:[(0,b.jsx)(et,{}),(0,b.jsx)(Qe,{zoom:e,onChange:t}),(0,b.jsx)(`div`,{className:`justify-end`,children:(0,b.jsx)(ct,{})})]}),(0,b.jsx)(Ze,{running:a,ref:g}),s&&(0,b.jsx)(pt,{bytes:l?.bytes,wasmModule:m,running:a,soundEnabled:r,ctx:s}),(0,b.jsxs)(`div`,{className:`mt-2 flex justify-center items-center text-xs`,children:[(0,b.jsx)(`button`,{className:`mx-2 border rounded-sm px-1 py-1`,type:`button`,onClick:h,children:a?`Stop`:`Run`}),(0,b.jsx)(Y,{className:`mx-2 border rounded-sm px-1 py-1`,onLoad:_,children:`Upload ROM`}),(0,b.jsxs)(`label`,{className:`flex justify-center items-center`,htmlFor:`soundEnableCheckbox`,children:[(0,b.jsx)(`input`,{id:`soundEnableCheckbox`,className:`mr-1`,type:`checkbox`,checked:r,onChange:e=>i(e.currentTarget.checked)}),`Enable sound`]})]}),l?.custom&&(0,b.jsx)(`div`,{className:`mt-2 flex justify-center text-xs`,children:l.name}),(0,b.jsx)(`div`,{className:`mt-2 flex justify-center text-xs`,children:(0,b.jsx)(rt,{selectedName:l?.name,onCartridgeLoad:_})}),(0,b.jsx)(`div`,{className:`mt-2 flex text-center justify-center text-xs`,children:(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`p`,{children:`Select one of the available demos or upload your custom *.gb file and press Run`}),(0,b.jsxs)(`p`,{children:[`The test ROMs are available in`,` `,(0,b.jsx)(u,{className:`underline`,to:`/debug`,children:`debug mode`}),`. You can see the test results`,` `,(0,b.jsx)(u,{className:`underline`,to:`/test-results`,children:`here`}),`.`]})]})})]})})}):(0,b.jsx)(d,{})}export{$ as Play,$ as default};