interface Config {
  templatesPath: string
  startNode: string
  errorPage?: string
}

interface SjsObj {
  config: Config
  routes: Route[]
}

interface Routes {
  add: (route: Route) => void
}

interface Route {
  templateUrl: string
  path: string
  controller?: (dynamicValues?: string[]) => void
  startNode?: string
  prefetch?: boolean
}

const sjsObj: SjsObj = {
  config: {
    templatesPath: 'pages',
    startNode: 'app',
    errorPage: '/error.html'
  },
  routes: []
}

export const routes: Routes = {
  add: (route: Route) => {
    sjsObj.routes.push(route)
  }
}
function preventLinkRouteChange() {
  document.querySelectorAll('a:not(.listener-added)').forEach((link) => {
    const target = link.getAttribute('target')
    const href = link.getAttribute('href')

    if (target || `${href}`.startsWith('http')) {
      return
    }

    link.classList.add('listener-added')
    if (href && href === getCurrentRoute()) {
      link.classList.add('active')
    }

    link.addEventListener('click', (e) => {
      document.querySelector('a.active')?.classList.remove('active')
      link.classList.toggle('active')

      e.preventDefault()

      if (href && href !== getCurrentRoute()) {
        window.history.pushState(null, '', href)

        let foundRoute = false

        sjsObj.routes.forEach((route) => {
          if (matchRoute(href, route.path) && route.path !== '*') {
            renderTemplate(route)
            if (route.path !== '*') {
              foundRoute = true
            }
          }
        })

        if (!foundRoute) {
          renderErrorPage()
        }
      }
    })
  })
}
export function start() {
  const currentRoute = getCurrentRoute()
  let foundRoute = false

  sjsObj.routes.forEach((route) => {
    if (matchRoute(currentRoute, route.path)) {
      renderTemplate(route)
      if (route.path !== '*') {
        foundRoute = true
      }
    } else if (route.prefetch) {
      const { path } = getTemplatePathAndExternal(route)
      getTemplate(path).catch(() => {
        renderErrorPage()
      })
    }
  })
  if (!foundRoute) {
    renderErrorPage()
  }
}

function getTemplatePathAndExternal(route: Route) {
  let path = route.templateUrl
  let external = true
  if (!path.startsWith('http')) {
    path = '/' + sjsObj.config.templatesPath + '/' + route.templateUrl
    external = false
  }
  return { path, external }
}

function renderErrorPage() {
  const { path } = getTemplatePathAndExternal({
    templateUrl: sjsObj.config.errorPage || '/error.html',
    path: '*',
    controller: () => {}
  })

  getTemplate(path).then((template) => {
    const appNode = document.getElementById(sjsObj.config.startNode)
    if (appNode) {
      appNode.innerHTML = cleanHtml(template as string)
    }
  })
}
function renderTemplate(route: Route) {
  if (!route.templateUrl && route.controller) {
    return route.controller()
  }

  const { path, external } = getTemplatePathAndExternal(route)

  getTemplate(path).then((template) => {
    const appNode = document.getElementById(route.startNode || sjsObj.config.startNode)
    if (appNode) {
      if (external) {
        template = cleanHtml(template as string)
      }

      // TODO: lit-html?
      appNode.innerHTML = template as string
      preventLinkRouteChange()

      if (route.controller) {
        route.controller()
      }
    }
  })
}

function cleanHtml(html: string) {
  html = html.replace(/<style([\s\S]*?)<\/style>/gi, '')
  html = html.replace(/<script([\s\S]*?)<\/script>/gi, '')
  html = html.replace(/<head([\s\S]*?)<\/head>/gi, '')
  return html
}

function getCurrentRoute() {
  return window.location.pathname
}
function matchRoute(currentRoute: string, matchRoute: string) {
  if (matchRoute === '/') {
    return matchRoute === currentRoute
  }

  const regex = new RegExp(matchRoute.replace('*', '.*'))
  return regex.test(currentRoute)
}

interface CachedTemplates {
  [key: string]: string
}

const cachedTemplates: CachedTemplates = {}
async function getTemplate(templateUrl: string) {
  if (cachedTemplates[templateUrl]) {
    return new Promise((resolve) => resolve(cachedTemplates[templateUrl]))
  }

  const res = await fetch(templateUrl)
  const template = await res.text()
  cachedTemplates[templateUrl] = template
  return template
}
