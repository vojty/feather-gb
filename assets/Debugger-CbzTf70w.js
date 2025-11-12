const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/debugger_web-B7o6lVVm.js","assets/__vite-plugin-wasm-helper-D7K_KhUE.js"])))=>i.map(i=>d[i]);
import{a as n,j as t,_ as s,f as i,d as l}from"./index-CpWg6vgS.js";import{r as c}from"./romsList-Ch2JJVv5.js";const r="debugger",d=l.canvas`
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
`;function f(){return n.useEffect(()=>{let a=null;return(async()=>{try{const e=await s(()=>import("./debugger_web-B7o6lVVm.js"),__vite__mapDeps([0,1])),o=document.getElementById(r);if(!o||!(o instanceof HTMLCanvasElement))throw new Error("Canvas not found");a=await e.start(o,c)}catch(e){console.error(e)}})(),()=>{a?.stop_web(),a?.free()}},[]),t.jsxs(t.Fragment,{children:[t.jsx(u,{}),t.jsx(d,{id:r})]})}export{f as Debugger,f as default};
