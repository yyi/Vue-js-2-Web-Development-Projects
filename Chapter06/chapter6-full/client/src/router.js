import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

// import Login from './components/Login.vue'
// import GeoBlog from './components/GeoBlog.vue'
// import NotFound from './components/NotFound.vue'

Vue.use(VueRouter)

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * @param  {string}   name     the filename (basename) of the view to load.
 */
function view(name) {
  return function(resolve) {
    require(['./components/' + name + '.vue'], resolve);
  }
};

const routes = [
  { path: '/', name: 'home', component:view('GeoBlog') , meta: { private: true } },
  { path: '/login', name: 'login', component: view('Login') },
  { path: '*', component: view('NotFound') },
]

const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { selector: to.hash }
    }
    return { x: 0, y: 0 }
  },
})

router.beforeEach((to, from, next) => {
  console.log('to', to.name)
  const user = store.getters.user
  if (to.matched.some(r => r.meta.private) && !user) {
    next({
      name: 'login',
      params: {
        wantedRoute: to.fullPath,
      },
    })
    return
  }
  if (to.matched.some(r => r.meta.guest) && user) {
    next({ name: 'home' })
    return
  }
  next()
})

export default router
