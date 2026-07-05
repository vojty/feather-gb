const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/debugger_web-eMBTq506.js","assets/rolldown-runtime-QTnfLwEv.js","assets/__vite-plugin-wasm-helper-Y7WR0nsT.js"])))=>i.map(i=>d[i]);
import{r as e}from"./rolldown-runtime-QTnfLwEv.js";import{i as t,n,s as r,t as i}from"./jsx-runtime-BD1_bWpS.js";import{t as a}from"./preload-helper-BIBIFuRL.js";import{t as o}from"./romsList-S93O0J4k.js";var s=e(r(),1),c=i(),l=`debugger`,u=t.canvas`
  margin-right: auto;
  margin-left: auto;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`,d=n`
  body {
    /* Background color for what is not covered by the egui canvas,
    or where the egui canvas is translucent. */
    background: #404040;
  }
  html {
    /* Remove touch delay: */
    touch-action: manipulation;
  }
  /* Allow canvas to fill entire web page: */
  html,
  body {
      overflow: hidden;
      margin: 0 !important;
      padding: 0 !important;
  }
`;function f(){return(0,s.useEffect)(()=>{let e=null;return(async()=>{try{let t=await a(()=>import(`./debugger_web-eMBTq506.js`),__vite__mapDeps([0,1,2])),n=document.getElementById(l);if(!n||!(n instanceof HTMLCanvasElement))throw Error(`Canvas not found`);e=await t.start(n,o)}catch(e){console.error(e)}})(),()=>{e?.stop_web(),e?.free()}},[]),(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(d,{}),(0,c.jsx)(u,{id:l})]})}export{f as Debugger,f as default};