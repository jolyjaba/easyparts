import { Middleware } from '@nuxt/types'

const auth: Middleware = (ctx) => {
  const user = localStorage.getItem('user')
  const currentPath = ctx.route.path
  if (user === null) {
    if (currentPath !== '/login') {
      ctx.redirect('/login')
      return
    }
  }
  if (currentPath === '/') {
    ctx.redirect(encodeURI('/Главная'))
  }
}

export default auth
