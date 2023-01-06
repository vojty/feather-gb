import{s as r,W as n,r as s,a as l,F as i,j as e,_ as c}from"./index-b613d1c1.js";import{r as u}from"./romsList-6ed61065.js";const o="debugger",d=r.canvas`
  margin-right: auto;
  margin-left: auto;
  display: block;
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translate(-50%, 0%);
`,p=n`
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
`;function f(){return s.useEffect(()=>{let a=null;return(async()=>{try{a=(await c(()=>import("./debugger_web-cf58c5db.js"),["assets/debugger_web-cf58c5db.js","assets/__vite-plugin-wasm-helper-2f5b93cf.js"])).start(o,u)}catch(t){console.error(t)}})(),()=>{a?.stop_web(),a?.free()}},[]),l(i,{children:[e(p,{}),e(d,{id:o})]})}export{f as Debugger,f as default};
