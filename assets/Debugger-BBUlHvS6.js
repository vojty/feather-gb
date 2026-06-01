const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/debugger_web-BUGgz3bZ.js","assets/__vite-plugin-wasm-helper-D7K_KhUE.js"])))=>i.map(i=>d[i]);
import{r as n,j as t,_ as s,S as i,g as l}from"./index-DZObs9_S.js";import{r as c}from"./romsList-Ch2JJVv5.js";const r="debugger",d=l.canvas`
  margin-right: auto;
  margin-left: auto;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`,u=i`
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
`;function h(){return n.useEffect(()=>{let o=null;return(async()=>{try{const a=await s(()=>import("./debugger_web-BUGgz3bZ.js"),__vite__mapDeps([0,1])),e=document.getElementById(r);if(!e||!(e instanceof HTMLCanvasElement))throw new Error("Canvas not found");o=await a.start(e,c)}catch(a){console.error(a)}})(),()=>{o?.stop_web(),o?.free()}},[]),t.jsxs(t.Fragment,{children:[t.jsx(u,{}),t.jsx(d,{id:r})]})}export{h as Debugger,h as default};
