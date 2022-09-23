import{s as e,W as r,r as s,_ as n,a as i,F as l,j as t}from"./index.9d6f11d1.js";import{r as c}from"./romsList.5b5dfa84.js";const a="debugger",d=e.canvas`
  margin-right: auto;
  margin-left: auto;
  display: block;
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translate(-50%, 0%);
`,u=r`
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
`;function h(){return s.exports.useEffect(()=>{n(()=>import("./debugger_web.2e68167e.js"),["assets/debugger_web.2e68167e.js","assets/__vite-plugin-wasm-helper.61b72c6d.js"]).then(o=>{o.start(a,c)}).catch(console.error)},[]),i(l,{children:[t(u,{}),t(d,{id:a})]})}export{h as Debugger,h as default};
