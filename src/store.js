import Vue from 'vue';
import Vuex from 'vuex';
import lantext from "./lib/lantext";

Vue.use(Vuex);

export default new Vuex.Store({
  //dataTree[].commentList.comments[].tagList.tags[]
  state:{

    map:{
      dataset_map:null,
      dataset_comment_map:null,
      comment_map:null,
      comment_tag_map:null,
      tag_map:null,
    },
    list:{
      dataset_id_list:null,
      comment_id_list:null,
      tag_id_list:null,

    },
    tag_category:null,

    chosen_dataset_id:null,
    to_share_dataset_id:null,
    lanType:0,
    currentuser:'',
    loginstatus:false,
    workStatus:false,
    token:'',
    user_level:'',

    tagValue:null,
    isSaved:true,

    reviewChosenCmt:null,
    dataTree:[],

    dataSetIdList:[],
    tagsList:[],
    tagsDuplicateList:[],
    commentsDuplicateList:[],

    // startLoading:0,
    // endLoading:0,
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
