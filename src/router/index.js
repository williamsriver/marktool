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

          {
            path:'/marklist',
            name:'mark',
            component:commentlist,
            beforeEnter : (to,from,next) => {
              if (!store.state.loginstatus) next('/')
              else next()
            }
          },

          {
            path:'markplace',
            component: markplace,
            name:'markplace',
            beforeEnter : (to,from,next) => {
              store.state.workstatus = true
              if (!store.state.loginstatus) next('/')
              else next()
            },

          },


          {
            path: '/viewlist',
            name:'view',
            component: commentlist,
            beforeEnter : (to,from,next) => {
              if (!store.state.loginstatus) next('/')
              else next()
            },

          },
          {
            path:'/viewplace',
            component: viewplace,
            name:'viewplace',
            beforeEnter : (to,from,next) => {
              store.state.workstatus = true
              if (!store.state.loginstatus) next('/')
              else next()
            },

          },

          {
            path: '/data',
            component: dataplace,
            beforeEnter : (to,from,next) => {
              if (!store.state.loginstatus) next('/')
              else next()
            },
          },

          {
            path: '/admin',
            component: admin,
            beforeEnter : (to,from,next) => {
              if (!store.state.loginstatus) next('/')
              else next()
            }

          },

          {
            path: '/register',
            name: 'register',
            component:register
          },

        ]
    },



  ],
})

export default router;
