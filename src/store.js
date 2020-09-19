import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state:{
    lanType:1,
    currentuser:'',
    loginstatus:false,
    workstatus:false,
    token:'',
    user_level:'',
    commentsList:[],
    comments:[],
    tags:[],
    apps:[],
    lists_duplicate:[],
  },
  getters:{

  },
  mutations:{},
  actions:{},
})
