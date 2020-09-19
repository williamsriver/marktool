import Vue from 'vue'
import Router from 'vue-router'
import sysbar from "../components/sysbar";
import register from "../components/register";
import markplace from "../components/markplace";
import commentlist from "../components/commentlist";
import viewplace from "../components/viewplace";
import store from "../store";
import dataplace from "../components/dataplace";
import admin from "../components/admin";
import homemenu from "../components/homemenu";


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
