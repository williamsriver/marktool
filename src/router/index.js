import Vue from 'vue'
import Router from 'vue-router'
const sysbar = () => import ("../components/sysbar");
const homemenu = () => import("../components/homemenu");


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component:sysbar,
      redirect:'/homemenu',
      children:
        [
          {
            path: '/homemenu',
            name:'home',
            component: homemenu
          },
        ]
    },



  ],
})

export default router;
