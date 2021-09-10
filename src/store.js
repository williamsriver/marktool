import Vue from 'vue';
import Vuex from 'vuex';
import lantext from "./lib/lantext";

Vue.use(Vuex);

export default new Vuex.Store({
  //dataTree[].commentList.comments[].tagList.tags[]
  state:{
    reviewChosenCmt:null,
    lanType:1,
    currentuser:'',
    dataTree:[],
    loginstatus:false,
    workStatus:false,
    token:'',
    user_level:'',
    dataSetIdList:[],
    tagsList:[],
    tagsDuplicateList:[],
    commentsDuplicateList:[],
    tagValue:-1,
    isSaved:true,
    startLoading:0,
    endLoading:0,
    commentTagValueList:[],
    commentsIdTotalList:[],
  },
  mutations:{},
  actions:{
    setLoginStatus(value){
      state.loginstatus = value;
    }
  },
})
