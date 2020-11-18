<template>

  <v-app>

    <!--mode radio & search tab-->
    <v-container fluid>
      <v-row>
        <v-btn text @click="$store.state.workStatus = false">
          <v-icon>mdi-arrow-left</v-icon>
          <v-main>{{lantext.words.back[$store.state.lanType]}}</v-main>
        </v-btn>
        <v-col col="7">
          <v-radio-group row v-model="viewMode">
            <v-radio :label="lantext.words.all[$store.state.lanType]" :value="1"></v-radio>
            <v-radio :label="lantext.words.contradictions[$store.state.lanType]" :value="2"></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="5">
          <v-text-field
            v-model="viewSearch"
            v-show="viewMode===1"
            append-icon="mdi-magnify"
            :label="lantext.words.confidence[$store.state.lanType]+' value and below'" single-line>
          </v-text-field>
        </v-col>
      </v-row>


    </v-container>

    <!--comments table-->
    <v-data-table
      :headers="lantext.headers.viewHeaders[$store.state.lanType]"
      :search="viewMode===1?viewSearch:'1'"
      :items="$store.state.tagsList[dataSetIndex]"
      :custom-filter="viewMode===1?customfilter1:customfilter2"
      v-if="tagListValid"
      item-key="tag_id"
      show-expand
      hide-default-footer>
      <template v-slot:item.viewVal="{item}">
        <v-main>{{$store.state.commentTagValueList[item.dataSetIndex][item.totalCommentIndex].tag_result}}</v-main>
      </template>
      <template v-slot:item.view="{item}">
        <v-btn text @click="tagPtr = item.totalTagIndex">
          <v-icon>mdi-pen-plus</v-icon>
        </v-btn>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
      </template>

    </v-data-table>



    <v-spacer style="height: 30px"></v-spacer>
    <v-divider></v-divider>
    <v-spacer style="height: 30px"></v-spacer>

      <!--comment info -->

    <v-container v-if="$store.state.tagsList[dataSetIndex][tagPtr]" fluid>
      <v-row>
        <v-col cols="3" >
          <v-card class="ma-0" flat>
            <v-chip
              v-for="index in 8" :key="index" class="ma-2"
              @click="isSaved = false, tagValue = index-1"
              :color="tagValue===index-1?tagsInfo.colors[index-1]:'grey'" text-color="white">
              <v-avatar left v-if="tagValue===index-1"><v-icon>mdi-checkbox-marked-circle</v-icon></v-avatar>
              {{tagsInfo.text[index-1]}}
            </v-chip>
          </v-card>
        </v-col>
        <v-col cols="9">
          <v-container class="pa-0">
            <v-row align="baseline" v-show="tagValue>=0" dense>
              <v-col>
                <v-spacer></v-spacer>
                <v-btn @click="sendView($store.state.tagsList[dataSetIndex][tagPtr], tagValue)">
                  {{lantext.words.view[$store.state.lanType]}}
                </v-btn>
              </v-col>
            </v-row>

            <v-card>
              <v-row>
                <v-col>
                  <v-card-title class="font-weight-black text-h6">
                    {{lantext.words.title[$store.state.lanType]}} :
                    {{$store.state.commentTagValueList[dataSetIndex][$store.state.tagsList[dataSetIndex][tagPtr].totalCommentIndex].title}}
                  </v-card-title>
                  <v-card-text class="font-weight-black">
                    {{lantext.words.version_info[$store.state.lanType]}} :
                    {{$store.state.commentTagValueList[dataSetIndex][$store.state.tagsList[dataSetIndex][tagPtr].totalCommentIndex].version_info}}
                  </v-card-text>
                  <v-card-text class="font-weight-black">
                    {{lantext.words.date_info[$store.state.lanType]}} :
                    {{$store.state.commentTagValueList[dataSetIndex][$store.state.tagsList[dataSetIndex][tagPtr].totalCommentIndex].datetime_info}}
                  </v-card-text>
                  <v-card-text class="font-weight-black">
                    {{lantext.words.rating[$store.state.lanType]}} :
                    {{$store.state.commentTagValueList[dataSetIndex][$store.state.tagsList[dataSetIndex][tagPtr].totalCommentIndex].rank_level}}
                  </v-card-text>
                  <v-card-text class="font-weight-black">
                    {{lantext.words.view[$store.state.lanType]+" value"}} :
                    {{$store.state.commentTagValueList[dataSetIndex][$store.state.tagsList[dataSetIndex][tagPtr].totalCommentIndex].tag_result}}
                  </v-card-text>
                  <v-card-subtitle class="font-weight-black">
                    {{lantext.words.content[$store.state.lanType]}} :
                  </v-card-subtitle >
                  <v-card-text >
                    {{$store.state.commentTagValueList[dataSetIndex][$store.state.tagsList[dataSetIndex][tagPtr].totalCommentIndex].content}}
                  </v-card-text>

                </v-col>
                <v-col>
                  <v-card-title class="font-weight-black text-h6">标签说明</v-card-title>
                  <v-card-text>content</v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-container>
        </v-col>
      </v-row>

    </v-container>

  </v-app>
</template>

<script>
  import lantext from "../lib/lantext";
    export default {
        name: "viewplace",
      props: {
        dataSetIndex:{
          type:Number,
          required:true,
        },
        enable:{
          type:Boolean,
          required:true,
        }
      },
      data:()=>({
        //static data
        lantext:lantext,
        tagListValid:false,

        tagsInfo:{
          colors:["teal", "green", "primary", "orange", "indigo", "red", "pink","purple"],
          text:['Performance','Compatibility', 'Usability','Security','Maintainability','Portability','Others','Functional'],
        },

        tagValue:0,
        tagPtr:-1,

        tag_need:0,
        tag_got:0,
        comment_pointer:-1,

        ptr:-1,

        //all the tag under all comments
        comments_list:[],
        comments_order:[],
        tags_list:[],
        contradict_list:{},//record the comment having contradict tags

        panel_value:[],

        viewMode:1, viewStatus:false,
        viewSearch:'',
        taghelp:'',


      }),
      watch: {

        enable: {
          handler(value) {
            console.log("enable", value);
            if (value) this.startReview();
          },
          immediate: true,
        },
      },
      methods:{

        goBack(){
          this.$emit("goBack",true);
        },

        startReview(){
          let timer = setInterval(()=>{this.totalStartTime += 1},1000);
          this.tagListValid = true;
        },

        customfilter1(value,search,item){
          return item.confidence <= Number(search)
        },

        customfilter2(value,search,item){
          if (this.$store.state.dataTree[item.dataSetIndex].commentList.comments[item.commentIndex].tag_result!==-1) return false;
          return this.$store.state.commentTagValueList[this.dataSetIndex][item.totalCommentIndex].tagValueList.length > 1;
        },

        sendView(tag, tag_result){
          var date = new Date();
          let formData3 = new FormData()
          formData3.append("datetime_info",date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());
          formData3.append('comment_id',tag.comment_id);
          formData3.append('tag_result',tag_result);

          this.axios.put('http://tonycoder.ziqiang.net.cn:8080/comments/',formData3)
            .then((response)=>{
              console.log(response)
              if (response.data.new_tag_result){
                this.$message.success(
                  lantext.words.view[this.$store.state.lanType] +
                  lantext.sentences.item_success[this.$store.state.lanType]
                )
                this.$store.state.dataTree[tag.dataSetIndex].commentList.comments[tag.commentIndex].tag_result = tag_result;
                this.$store.state.commentTagValueList[tag.totalCommentIndex].tag_result = tag_result;
                console.log("new tag result",this.$store.state.commentTagValueList[tag.totalCommentIndex].tag_result = tag_result);
                this.tagValue = -1;
                this.tagPtr = -1;
              }
              else this.$message.error(
                lantext.words.view[this.$store.state.lanType] +
                lantext.sentences.item_failed[this.$store.state.lanType]
              )
            })
          .catch(error => console.log(error));
        }

      },
      beforeRouteLeave (to, from, next) {
        if (this.comment_pointer!==-1){
          if (confirm(lantext.sentences.exit_work[this.$store.state.lanType]) ) {
            this.$store.state.workstatus = false;
            next()
          }
        }
        else next()
      }
    }
</script>

<style scoped>

</style>
