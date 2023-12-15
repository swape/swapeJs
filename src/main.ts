import type { Route, Routes, SjsObj } from './types'
import { getTemplate } from './template'
import { cleanHtml, getCurrentRoute, matchRoute } from './helpers'

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
    path = `/${sjsObj.config.templatesPath}/${route.templateUrl}`
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
