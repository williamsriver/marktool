import Vue from 'vue'
import Router from 'vue-router'
const sysbar = () => import ("../components/sysbar");
const register = () => import("../components/register");
const markplace = () => import("../components/markplace");
const commentlist = () => import("../components/commentlist");
const viewplace = () => import("../components/viewplace");
import store from "../store";
const dataplace = () => import("../components/dataplace");
const admin = () => import("../components/admin");
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
