import{s as r,W as n,r as s,j as t,_ as i}from"./index-cae58451.js";import{r as l}from"./romsList-6ed61065.js";const o="debugger",c=r.canvas`
  margin-right: auto;
  margin-left: auto;
  display: block;
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translate(-50%, 0%);
`,u=n`
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
`;function m(){return s.useEffect(()=>{let a=null;return(async()=>{try{a=await(await i(()=>import("./debugger_web-3376ded9.js"),["assets/debugger_web-3376ded9.js","assets/__vite-plugin-wasm-helper-2f5b93cf.js"])).start(o,l)}catch(e){console.error(e)}})(),()=>{a?.stop_web(),a?.free()}},[]),t.jsxs(t.Fragment,{children:[t.jsx(u,{}),t.jsx(c,{id:o})]})}export{m as Debugger,m as default};
