// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify';
import axios from 'axios'
import VueAxios from 'vue-axios';
import store from "./store";
import lantext from "./lib/lantext";
import {Message} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
//2023-2-15

Vue.config.productionTip = false
Vue.use(Vuetify);
Vue.use(VueAxios, axios)
Vue.prototype.$message = Message;
Vue.prototype.lantext = lantext;

axios.defaults.baseURL = 'http://121.40.238.237:8080/'
//121.40.238.237
/* eslint-disable no-new */


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  vuetify: new Vuetify(),
  template: '<App/>',
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
  render:h=>h(App)
})
