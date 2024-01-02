const o = {};
async function l(t) {
  if (o[t])
    return new Promise((n) => n(o[t]));
  const e = await (await fetch(t)).text();
  return o[t] = e, e;
}
function u(t) {
  return t = t.replace(/<style([\s\S]*?)<\/style>/gi, ""), t = t.replace(/<script([\s\S]*?)<\/script>/gi, ""), t = t.replace(/<head([\s\S]*?)<\/head>/gi, ""), t;
}
function i() {
  return window.location.pathname;
}
function h(t, r) {
  return r === "/" ? r === t : new RegExp(r.replace("*", ".*")).test(t);
}
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
    r || `${e}`.startsWith("http") || (t.classList.add("listener-added"), e && e === i() && t.classList.add("active"), t.addEventListener("click", (n) => {
      var s;
      if ((s = document.querySelector("a.active")) == null || s.classList.remove("active"), t.classList.toggle("active"), n.preventDefault(), e && e !== i()) {
        window.history.pushState(null, "", e);
        let d = !1;
        a.routes.forEach((c) => {
          h(e, c.path) && c.path !== "*" && (g(c), c.path !== "*" && (d = !0));
        }), d || f();
      }
    }));
  });
}
function v() {
  const t = i();
  let r = !1;
  a.routes.forEach((e) => {
    if (h(t, e.path))
      g(e), e.path !== "*" && (r = !0);
    else if (e.prefetch) {
      const { path: n } = p(e);
      l(n).catch(() => {
        f();
      });
    }
  }), r || f();
}
function p(t) {
  let r = t.templateUrl, e = !0;
  return r.startsWith("http") || (r = `/${a.config.templatesPath}/${t.templateUrl}`, e = !1), { path: r, external: e };
}
function f() {
  const { path: t } = p({
    templateUrl: a.config.errorPage,
    path: "*",
    controller: () => {
    }
  });
  l(t).then((r) => {
    const e = document.getElementById(a.config.startNode);
    e && (e.innerHTML = u(r));
  });
}
function g(t) {
  if (!t.templateUrl && t.controller)
    return t.controller();
  const { path: r, external: e } = p(t);
  l(r).then((n) => {
    const s = document.getElementById(t.startNode || a.config.startNode);
    s && (e && (n = u(n)), s.innerHTML = n, m(), t.controller && t.controller());
  });
}
export {
  E as routes,
  v as start
};
