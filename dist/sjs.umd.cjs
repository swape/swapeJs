(function(a,s){typeof exports=="object"&&typeof module<"u"?s(exports):typeof define=="function"&&define.amd?define(["exports"],s):(a=typeof globalThis<"u"?globalThis:a||self,s(a.sjs={}))})(this,function(a){"use strict";const s={};async function f(e){if(s[e])return new Promise(r=>r(s[e]));const t=await(await fetch(e)).text();return s[e]=t,t}function u(e){return e=e.replace(/<style([\s\S]*?)<\/style>/gi,""),e=e.replace(/<script([\s\S]*?)<\/script>/gi,""),e=e.replace(/<head([\s\S]*?)<\/head>/gi,""),e}function l(){return window.location.pathname}function h(e,n){return n==="/"?n===e:new RegExp(n.replace("*",".*")).test(e)}const o={config:{templatesPath:"pages",startNode:"app",errorPage:"/error.html"},routes:[]},y={add:e=>{o.routes.push(e)}};function v(){document.querySelectorAll("a:not(.listener-added)").forEach(e=>{const n=e.getAttribute("target"),t=e.getAttribute("href");n||`${t}`.startsWith("http")||(e.classList.add("listener-added"),t&&t===l()&&e.classList.add("active"),e.addEventListener("click",r=>{var i;if((i=document.querySelector("a.active"))==null||i.classList.remove("active"),e.classList.toggle("active"),r.preventDefault(),t&&t!==l()){window.history.pushState(null,"",t);let m=!1;o.routes.forEach(c=>{h(t,c.path)&&c.path!=="*"&&(g(c),c.path!=="*"&&(m=!0))}),m||p()}}))})}function E(){const e=l();let n=!1;o.routes.forEach(t=>{if(h(e,t.path))g(t),t.path!=="*"&&(n=!0);else if(t.prefetch){const{path:r}=d(t);f(r).catch(()=>{p()})}}),n||p()}function d(e){let n=e.templateUrl,t=!0;return n.startsWith("http")||(n=`/${o.config.templatesPath}/${e.templateUrl}`,t=!1),{path:n,external:t}}function p(){const{path:e}=d({templateUrl:o.config.errorPage,path:"*",controller:()=>{}});f(e).then(n=>{const t=document.getElementById(o.config.startNode);t&&(t.innerHTML=u(n))})}function g(e){if(!e.templateUrl&&e.controller)return e.controller();const{path:n,external:t}=d(e);f(n).then(r=>{const i=document.getElementById(e.startNode||o.config.startNode);i&&(t&&(r=u(r)),i.innerHTML=r,v(),e.controller&&e.controller())})}a.routes=y,a.start=E,Object.defineProperty(a,Symbol.toStringTag,{value:"Module"})});
