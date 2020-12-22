<template>

  <v-app>
    <!--mode radio & search tab-->

    <v-container fluid>
      <v-row>
        <v-btn text @click="$store.state.workStatus = false">
          <v-icon>mdi-arrow-left</v-icon>
          <v-main>{{lantext.words.back[$store.state.lanType]}}</v-main>
        </v-btn>
        <v-col col="6">
          <v-radio-group row v-model="viewMode">
            <v-radio :label="lantext.words.all[$store.state.lanType]" :value="1"></v-radio>
            <v-radio :label="lantext.words.contradictions[$store.state.lanType]" :value="2"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="6">
          <v-row align="baseline">
            <v-col cols="5">
              {{lantext.words.confidence[$store.state.lanType]}}
            </v-col>
            <v-col cols="3">
              <v-select v-model="lowerVal" :items="valueTable[0]"></v-select>
            </v-col>
            <v-col cols="1">
              <span>to</span>
            </v-col>
            <v-col cols="3">
              <v-select v-model="upperVal" :items="valueTable[lowerVal-1]"></v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-row>


    </v-container>
    <!--comments table-->
    <v-data-table
      :search="'no'"
      :loading="$store.state.startLoading>$store.state.endLoading"
      :headers="lantext.headers.viewHeaders[$store.state.lanType]"
      :custom-filter="customfilter3"
      :items="$store.state.commentTagValueList[dataSetIndex]"
      v-if="tagListValid"
      item-key="commentIndex"
      show-expand
      hide-default-footer>
      <template v-slot:item.title="{item}">
        {{item.title||"--"}}
      </template>
      <template v-slot:item.viewValue="{item}">
        {{lantext.tagwords.tags[$store.state.lanType][item.tag_result]||"--"}}
      </template>
      <template v-slot:item.view="{item}" >
        <v-row :key="item.commentIndex" align="baseline">
          <v-col cols="6" v-show="tagResultModifying && modifyPtr===item.commentIndex">
            <span v-show="!tagResultModifying || modifyPtr !==item.commentIndex">{{item.tag_result}}</span>
            <v-select :items="lantext.tagwords.tags[$store.state.lanType]"
                      v-model="temp_tagContent"></v-select>
          </v-col>
          <v-col cols="6">
            <v-btn text @click="reviewBtnClick(item)" :disabled="$store.state.startLoading!==$store.state.endLoading">
              <v-icon>mdi-pen-plus</v-icon>
              <v-main>{{tagResultModifying  && modifyPtr===item.commentIndex ?"finish":"review"}}</v-main>
            </v-btn>
            <v-btn text v-show="tagResultModifying  && modifyPtr===item.commentIndex" @click="tagResultModifying = false">
              <v-icon class="mdi-backspace">mdi-backspace</v-icon>
              <v-main>cancel</v-main>
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-row>
            <v-col cols="8">
              <v-data-table
                :search="'no'"
                :custom-filter="customfilter1"
                :headers="lantext.headers.viewTagHeader[$store.state.lanType]"
                :items="item.tagList.tags"
                hide-default-footer>
                <template v-slot:item.tag_value="{item}">

                  {{lantext.tagwords.tags[$store.state.lanType][item.tag_value]}}
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="4">
              <v-textarea outlined readonly :label="lantext.words.content[$store.state.lanType]" v-model="item.content"></v-textarea>
            </v-col>
          </v-row>

        </td>


      </template>

    </v-data-table>



    <v-spacer style="height: 30px"></v-spacer>
    <v-divider></v-divider>
    <v-spacer style="height: 30px"></v-spacer>

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

        valueTable:[['1','2','3','4','5'],['2','3','4','5'],['3','4','5'],['4','5'],['5']],
        lowerVal:'1',
        upperVal:'5',

        tagResultModifying:false,
        temp_tagResult:-1,
        temp_tagContent:'',
        modifyPtr:-1,

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

        lowerVal:{
          handler(value){
            this.upperVal = String(Math.max(value, Number(this.upperVal)) );
          },
          immediate: true,
        }
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
          return item.confidence >= Number(this.lowerVal) && item.confidence <= Number(this.upperVal)
        },

        customfilter2(value,search,item){
          return this.$store.state.commentTagValueList[this.dataSetIndex][item.totalCommentIndex].tagValueList.length > 1;
        },

        customfilter3(value,search,item){
          let flag = false;
          item.tagList.tags.forEach(tag =>{
            if (tag.confidence >= Number(this.lowerVal) && tag.confidence <= Number(this.upperVal) ){
              flag = true;
            }
          });
          if (this.viewMode===2){
            flag = this.$store.state.commentTagValueList[this.dataSetIndex][item.totalCommentIndex].tagValueList.length > 1;
          }
          return flag;
        },

        sendView(comment, tag_result){
          var date = new Date();
          let formData3 = new FormData()
          formData3.append("datetime_info",date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());
          formData3.append('comment_id',comment.comment_id);
          formData3.append('tag_result',tag_result);

          this.axios.put('http://tonycoder.ziqiang.net.cn:8080/comments/',formData3)
            .then((response)=>{
              console.log(response)
              if (response.data.new_tag_result){
                this.$message.success(
                  lantext.words.view[this.$store.state.lanType] + lantext.sentences.item_success[this.$store.state.lanType]
                );
                this.$store.state.dataTree[comment.dataSetIndex].commentList.comments[comment.commentIndex].tag_result = tag_result;
                this.$store.state.commentTagValueList[comment.totalCommentIndex].tag_result = tag_result;
                console.log("new tag result",this.$store.state.commentTagValueList[tag.totalCommentIndex].tag_result = tag_result);
              }
              else this.$message.error(
                lantext.words.view[this.$store.state.lanType] + lantext.sentences.item_failed[this.$store.state.lanType]
              );
            })
          .catch(error => console.log(error));
        },

        reviewBtnClick(comment){
          if (this.modifyPtr===comment.commentIndex){
            this.temp_tagResult = lantext.tagwords.tags[this.$store.state.lanType].indexOf(this.temp_tagContent);
            if (this.tagResultModifying) this.sendView(comment, this.temp_tagResult);
            this.tagResultModifying = !this.tagResultModifying;
          }
          else {
            this.modifyPtr = comment.commentIndex;
            this.tagResultModifying = true;
          }
        },

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
