const a = {
  config: {
    templatesPath: "pages",
    startNode: "app",
    errorPage: "/error.html"
  },
  routes: []
}, E = {
  add: (t) => {
    a.routes.push(t);
  }
};
function m() {
  document.querySelectorAll("a:not(.listener-added)").forEach((t) => {
    const r = t.getAttribute("target"), e = t.getAttribute("href");
    r || `${e}`.startsWith("http") || (t.classList.add("listener-added"), e && e === f() && t.classList.add("active"), t.addEventListener("click", (n) => {
      var s;
      if ((s = document.querySelector("a.active")) == null || s.classList.remove("active"), t.classList.toggle("active"), n.preventDefault(), e && e !== f()) {
        window.history.pushState(null, "", e);
        let d = !1;
        a.routes.forEach((c) => {
          g(e, c.path) && c.path !== "*" && (u(c), c.path !== "*" && (d = !0));
        }), d || i();
      }
    }));
  });
}
function v() {
  const t = f();
  let r = !1;
  a.routes.forEach((e) => {
    if (g(t, e.path))
      u(e), e.path !== "*" && (r = !0);
    else if (e.prefetch) {
      const { path: n } = l(e);
      p(n).catch(() => {
        i();
      });
    }
  }), r || i();
}
function l(t) {
  let r = t.templateUrl, e = !0;
  return r.startsWith("http") || (r = "/" + a.config.templatesPath + "/" + t.templateUrl, e = !1), { path: r, external: e };
}
function i() {
  const { path: t } = l({
    templateUrl: a.config.errorPage,
    path: "*",
    controller: () => {
    }
  });
  p(t).then((r) => {
    const e = document.getElementById(a.config.startNode);
    e && (e.innerHTML = h(r));
  });
}
function u(t) {
  if (!t.templateUrl && t.controller)
    return t.controller();
  const { path: r, external: e } = l(t);
  p(r).then((n) => {
    const s = document.getElementById(t.startNode || a.config.startNode);
    s && (e && (n = h(n)), s.innerHTML = n, m(), t.controller && t.controller());
  });
}
function h(t) {
  return t = t.replace(/<style([\s\S]*?)<\/style>/gi, ""), t = t.replace(/<script([\s\S]*?)<\/script>/gi, ""), t = t.replace(/<head([\s\S]*?)<\/head>/gi, ""), t;
}
function f() {
  return window.location.pathname;
}
function g(t, r) {
  return r === "/" ? r === t : new RegExp(r.replace("*", ".*")).test(t);
}
const o = {};
async function p(t) {
  if (o[t])
    return new Promise((n) => n(o[t]));
  const e = await (await fetch(t)).text();
  return o[t] = e, e;
}
export {
  E as routes,
  v as start
};
