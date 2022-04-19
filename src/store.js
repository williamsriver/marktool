import Vue from 'vue';
import Vuex from 'vuex';
import lantext from "./lib/lantext";

Vue.use(Vuex);

export default new Vuex.Store({
  //dataTree[].commentList.comments[].tagList.tags[]
  state:{
    //12 colors
    colors:["teal", "green", "primary", "orange", "indigo", "red", "pink","purple","#9E9D24","#FFC107","#E65100","#5D4037"],

    map:{
      dataset_map:new Map(),
      dataset_comment_map:new Map(),
      comment_map:new Map(),
      comment_tag_map:new Map(),
      tag_map:new Map(),
      tag_category_map:new Map()
    },
    list:{
      all_dataset_id_list:[],
      dataset_id_list:[],
      comment_id_list:[],
      tag_id_list:[],
      tag_category_name_list:[]
    },
    set:{
      tag_category_value_set:new Set()
    },

    current_tag_category_saved:true,
    chosen_dataset_id:null,
    chosen_tag_category:null,
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
