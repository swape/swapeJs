export function cleanHtml(html: string) {
  html = html.replace(/<style([\s\S]*?)<\/style>/gi, '')
  html = html.replace(/<script([\s\S]*?)<\/script>/gi, '')
  html = html.replace(/<head([\s\S]*?)<\/head>/gi, '')
  return html
}

export function getCurrentRoute() {
  return window.location.pathname
}
export function matchRoute(currentRoute: string, matchRoute: string) {
  if (matchRoute === '/') {
    return matchRoute === currentRoute
  }

  const regex = new RegExp(matchRoute.replace('*', '.*'))
  return regex.test(currentRoute)
}
