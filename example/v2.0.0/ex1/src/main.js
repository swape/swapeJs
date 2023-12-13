import '../style.css'

import { routes, start } from '../../../../dist/sjs.js'

routes.add({
  templateUrl: 'index.html',
  path: '/',
  controller: () => {
    console.log('controller index')
  }
})
routes.add({
  templateUrl: 'about.html',
  path: '/about',
  controller: () => {
    console.log('controller for about')
  }
})

routes.add({
  templateUrl: 'about2.html',
  path: '/about*',
  controller: () => {
    console.log('controller for about*')
  }
})

routes.add({
  templateUrl: 'what.html',
  path: '/what/*',
  controller: () => {
    console.log('controller for what')
  }
})

routes.add({
  templateUrl: 'contact.html',
  path: '/contact',
  controller: () => {
    console.log('controller for contact')
  },
  prefetch: true
})

// this may not work when you have strict CORS policy
routes.add({
  templateUrl: 'https://raw.githubusercontent.com/kangax/html-minifier/gh-pages/tests/index.html',
  path: '/external',
  controller: () => {
    console.log('controller for external')
    window.QUnit = {
      start: () => {
        alert('QUnit started')
      }
    }
  }
})

routes.add({
  path: '/controller',
  controller: () => {
    console.log('controller without template')
    alert('controller without template')
  }
})

routes.add({
  templateUrl: 'menu.html',
  path: '*',
  controller: () => {
    console.log('controller for menu')
  },
  startNode: 'menu'
})

start()
