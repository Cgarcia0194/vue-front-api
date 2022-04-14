import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '../providers/principal';


let logged = {
  usr: null,
  token: null
}

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});


router.beforeEach((to, from, next) => {

  logged.usr = localStorage.getItem("user");
  logged.token = localStorage.getItem("x-token");

  if ((to.meta.requiresAuth || to.name == undefined) && (logged.usr == null || logged.token == null)) {
    next({
      name: "login"
    });
  } else if (to.name == 'login' && logged.usr != null) {
    next({
      name: "inicio",
      replace: true
    });
  } else {
    next();
  }
});

export default router