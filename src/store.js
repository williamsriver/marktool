import Vue from 'vue';
import Vuex from 'vuex';
import lantext from "./lib/lantext";

Vue.use(Vuex);

export default new Vuex.Store({
  //dataTree[].commentList.comments[].tagList.tags[]
  state:{
    lanType:1,
    currentuser:'',
    dataTree:[],
    loginstatus:false,
    token:'',
    user_level:'',
    dataSetIdList:[],
    tagsList:[],
    startLoading:0,
    endLoading:0,
    commentTagValueList:[],
  },
  getters:{


  },
  mutations:{},
  actions:{

  },
})
