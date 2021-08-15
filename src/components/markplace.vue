<template>
  <v-app>
    <v-container fluid  class="pa-0">
      <v-row dense>
        <v-col  cols="10" class="pa-0">
          <v-container fluid>
            <v-row dense  align="baseline">
              <v-btn text @click="$store.state.startLoading=0, $store.state.endLoading=0, $store.state.workStatus = false">
                <v-icon>mdi-arrow-left</v-icon>
                <v-main>{{lantext.words.back[$store.state.lanType]}}</v-main>
              </v-btn>
              <v-col cols="1">
                <v-text-field v-model="ptr" ></v-text-field>
              </v-col>

              <span>{{$store.state.startLoading===$store.state.endLoading?
                ptr+'/'+(commentsTotalNum-1) :"Loading:"+$store.state.endLoading+'/'+$store.state.startLoading}}</span>
              <v-col><v-progress-linear height="6"  :value="(ptr/(commentsTotalNum-1))*100"></v-progress-linear></v-col>
              <v-icon>mdi-clock</v-icon>
              {{markHour}}:{{markMin}}:{{markSec}}
            </v-row>
            <v-row >
            <v-col cols="4">
              <v-card class="ma-0" flat>
                <v-main>{{lantext.words.FR[$store.state.lanType]}}</v-main> <v-divider></v-divider>
                <v-chip
                  class="ma-2" @click="$store.state.isSaved = false, $store.state.tagValue = 0"
                  :color="$store.state.tagValue===0?tagsInfo.colors[0]:'grey'" text-color="white">
                  <v-avatar left v-if="$store.state.tagValue===0"><v-icon>mdi-checkbox-marked-circle</v-icon></v-avatar>
                  {{lantext.tagwords.tags[$store.state.lanType][0]}}
                </v-chip>
                <v-main>{{lantext.words.NFR[$store.state.lanType]}}</v-main> <v-divider></v-divider>
                <v-chip
                  v-for="index in 8" :key="index" class="ma-2"
                  @click="$store.state.isSaved = false, $store.state.tagValue = index"
                  :color="$store.state.tagValue===index?tagsInfo.colors[index]:'grey'" text-color="white">
                  <v-avatar left v-if="$store.state.tagValue===index"><v-icon>mdi-checkbox-marked-circle</v-icon></v-avatar>
                  <v-main>{{lantext.tagwords.tags[$store.state.lanType][index]}}</v-main>
                </v-chip>
                <v-main>{{lantext.words.others[$store.state.lanType]}}</v-main> <v-divider></v-divider>
                <v-chip
                  v-for="index in 2" :key="index+8" class="ma-2"
                  @click="$store.state.isSaved = false, $store.state.tagValue = index+8"
                  :color="$store.state.tagValue===index+8?tagsInfo.colors[index+8]:'grey'" text-color="white">
                  <v-avatar left v-if="$store.state.tagValue===index+8"><v-icon>mdi-checkbox-marked-circle</v-icon></v-avatar>
                  {{lantext.tagwords.tags[$store.state.lanType][index+8]}}
                </v-chip>
              </v-card>
              <v-row>
                <v-col>
                  <v-main class="font-weight-black text-h6" >
                    {{lantext.tagwords.tags[$store.state.lanType][$store.state.tagValue]}}
                  </v-main>
                  <v-virtual-scroll
                    v-if="$store.state.tagValue>=0"
                    :items="lantext.tagwords.taghelpwords[$store.state.lanType][$store.state.tagValue]"
                    :item-height="80"
                    height="200">
                    <template v-slot:default="{item}">
                      <v-card :color="item.id%2===0?'white':'grey'" height="100">
                        <span >{{item.name}}</span>
                      </v-card>
                    </template>
                  </v-virtual-scroll>
                </v-col>

              </v-row>
            </v-col>
            <v-col  v-if="currentComment!==null">
              <v-container class="pa-0" >
                <v-row align="baseline" v-show="$store.state.tagValue>=0" dense>
                  <v-col>
                    <v-chip class="ma-2" :color="tagsInfo.colors[$store.state.tagValue]" text-color="white">
                      <v-avatar left><v-icon>mdi-checkbox-marked-circle</v-icon></v-avatar>
                      {{tagsInfo.text[$store.state.tagValue]}}
                    </v-chip>
                    {{lantext.words.confidence[$store.state.lanType]}}
                    <span class="text-h5 font-italic">{{trustRating}}</span>
                  </v-col>
                  <v-col>
                    <v-rating :color="$store.state.tagValue>=0?tagsInfo.colors[$store.state.tagValue]:''" hover v-model="trustRating"></v-rating>
                  </v-col>
                </v-row>

                <v-card >
                  <v-row>

                    <v-col>
                      <v-main class="font-weight-black text-h6" >
                        {{lantext.words.title[$store.state.lanType]}} : {{currentComment.title||"--"}}
                      </v-main>
                      <v-main  class="font-weight-black" >
                        {{lantext.words.version_info[$store.state.lanType]}} : {{currentComment.version_info||"--"}}
                      </v-main>
                      <v-main class="font-weight-black" >
                        {{lantext.words.date_info[$store.state.lanType]}} : {{currentComment.datetime_info||"--"}}
                      </v-main>
                      <v-main class="font-weight-black" >
                        {{lantext.words.rating[$store.state.lanType]}} : {{currentComment.rank_level||"--"}}
                      </v-main>
                      <v-main class="font-weight-black" >
                        {{lantext.words.view[$store.state.lanType]+" "+lantext.words.value[$store.state.lanType]}} :
                        {{currentComment.tag_result === -1?"--"
                        :lantext.tagwords.tags[$store.state.lanType][currentComment.tag_result]}}
                      </v-main>
                      <v-main class="font-weight-black" >
                        {{lantext.words.content[$store.state.lanType]}} :
                      </v-main >
                      <v-main class="font-weight-black">
                        {{currentComment.content}}
                      </v-main>
                    </v-col>
                  </v-row>
                  <v-textarea
                    :label="lantext.words.remark[$store.state.lanType]"
                    v-model="remarkContent" outlined full-width>
                  </v-textarea>
                </v-card>
              </v-container>
            </v-col>
          </v-row>

          </v-container>
        </v-col>
        <v-col cols="2">
          <v-navigation-drawer width="200" permanent>
            <v-list dense nav>
                <v-list-item :disabled="ptr===0" @click="ptr--, $store.state.isSaved = true">
                  <v-list-item-icon> <v-icon>mdi-arrow-left</v-icon> </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{lantext.words.previous[$store.state.lanType]}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="ptr++" :disabled="ptr===commentsTotalNum-1">
                  <v-list-item-icon> <v-icon>mdi-arrow-right</v-icon> </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{lantext.words.next[$store.state.lanType]}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="saveMark" :disabled="!saveValid">
                  <v-list-item-icon> <v-icon>mdi-content-save</v-icon> </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{lantext.words.save[$store.state.lanType]}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
          </v-navigation-drawer>

        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
  import lantext from "../lib/lantext";

  export default {
    name: "markplace",
    props: {
      dataSetIndex:{
        type:Number,
        required:true,
      },
      lookMode:{
        type:Boolean,
        required:true
      },
      enable:{
        type:Boolean,
        required:true,
      },
      loadFinish:{
        type:Boolean,
        required:true,
      }
    },
    data:()=>({
      //static data
      lantext:lantext,

      tagsInfo:{
        colors:["teal", "green", "primary", "orange", "indigo", "red", "pink","purple","#9E9D24","#FFC107","#E65100","#5D4037"],
        text:['Functional',
          'Suitability','Performance','Compatibility', 'Usability','Security','Reliability','Maintainability','Portability',
          'Bug_Fix','Others'],
      },

      currentTag:null,
      currentComment:null,
      displayComment:null,

      ptr:0,
      maxPtr:0,
      remarkContent:"",
      commentsTotalNum:0,
      presskey:"",
      pressIndex:0,
      trustRating:4,

      totalStartTime:0,
    }),
    mounted() {
      window.onkeypress = (event =>{
        if (event.key==='q'){
          this.$store.state.tagValue = (this.$store.state.tagValue+1) % 11;
          this.$store.state.isSaved = false;
        }
      });
    },
    computed:{

      markHour(){
        return Math.floor(this.totalStartTime/3600);
      },
      markMin(){
        return (Math.floor(this.totalStartTime%3600/60)<10?"0":"")+Math.floor(this.totalStartTime%3600/60);
      },
      markSec(){
        return (this.totalStartTime%60<10?"0":"")+Math.floor(this.totalStartTime%60);
      },
      userType(){
        switch (this.$store.state.user_level) {
          case 0: return "marker";
          case 1: return "reviewer";
          case 2: return "admin";
          default : return "undefined";
        }
      },
      saveValid(){
        return ! ( this.lookMode || this.$store.state.isSaved || this.ptr<0 );
      }
    },
    watch:{
      enable: {
        handler(value) {
          console.log("enable",value);
          if (this.loadFinish) this.startBoard();
        },
        immediate: true,
      },

      loadFinish:{
        handler(value) {
          if (value) this.refreshPtr(0);
        },
        immediate: true,
      },

      ptr:{
        handler(value){
          if (value>=this.commentsTotalNum) {
            this.ptr = 0;
            this.refreshPtr(0);
          }
          console.log('ptr',this.enable,value)
          this.refreshPtr(value);
        },
        immediate:true,
      },


      remarkContent:{
        handler(value){
          this.$store.state.isSaved = false
        }
      },


    },

    methods: {

      startBoard(){
        let timer = setInterval(()=>{this.totalStartTime += 1},1000);
        this.ptr = 0;
      },

      saveMark() {
        let formData1 = new FormData()
        formData1.append('token', this.$store.state.token);
        /*
        this.lantext.tagwords.tags[0].forEach((item,index) => {
          formData1.append(String(item), index===this.$store.state.tagValue?"True":"False");
        })//chosen tag
        */
        formData1.append(String(this.lantext.tagwords.tags[0][this.$store.state.tagValue]), "True");
        formData1.append('remarks', this.remarkContent);
        formData1.append('tag_user_info', this.$store.state.currentuser)//用户信息
        formData1.append('confidence', this.trustRating + "") //confidence

        console.log(this.$store.state.tagValue);

        if (!this.currentTag)
          this.createTag(formData1, this.currentComment);
        else {
          let formData2 = formData1;
          formData2.append('tag_id',this.currentTag.tag_id);
          this.editTag(formData2);
        }
      },


      addNewTagForComment() {
        let comment_id = this.$store.state.dataTree[this.dataSetIndex].commentList.comments[this.ptr].comment_id;
        let formData3 = new FormData()
        let date = new Date();
        formData3.append("datetime_info", date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())
        formData3.append('comment_id', comment_id)
        formData3.append('tag_id', this.$store.state.dataTree[this.dataSetIndex].commentList.comments[this.ptr].tagList.tagIdList)
        this.axios.put('http://121.40.238.237:8080/comments/', formData3)
          .then(response => {
            console.log(response.data)
            if (response.data) {
              this.$message.success("create new tag succeed");
              this.$store.state.isSaved = true;
              if (this.ptr<this.commentsTotalNum-1) this.ptr++;
            }
            else this.$message.error("create new tag failed");
          })
          .catch(error => console.log(error))
      },

      editTag(data) {
        this.axios.put('http://121.40.238.237:8080/tag/', data)
          .then(response => {
            console.log(response);
            if (response.data.Msg === "OK") {
              this.$message.success("tag edit succeed");
              let temp = {};
              temp["tag_value"] = this.$store.state.tagValue;
              temp["remarks"] = this.remarkContent;
              temp["tag_user_info"] = this.$store.state.currentuser;
              temp["confidence"] = this.trustRating;
              temp["tag_value"] = this.$store.state.tagValue;
              this.$store.state.dataTree[this.currentTag.dataSetIndex].commentList.comments[this.ptr].tagList.tags[this.currentTag.tagIndex] = temp;
              this.$store.state.isSaved = true;
              if (this.ptr<this.commentsTotalNum-1) this.ptr++;
            }
          })
          .catch(error => console.log(error));
      },

      createTag(data, comment) {
        this.axios.post('http://121.40.238.237:8080/tag/', data)
          .then(response => {
            if (response.data.Details) {
              console.log(response);
              let temp ={};
              temp["tag_value"] = this.$store.state.tagValue;
              temp["tag_id"] = response.data.Details.tag_id;
              temp["dataSetIndex"] = comment.dataSetIndex;
              temp["tagIndex"] = comment.tagList.tagIdList.length;
              temp["tag_user_info"] = this.$store.state.currentuser;
              temp["remarks"] = this.remark;
              this.$store.state.dataTree[this.dataSetIndex].commentList.comments[comment.commentIndex].tagList.tagIdList.push(response.data.Details.tag_id);
              if (this.$store.state.dataTree[this.dataSetIndex].commentList.comments[comment.commentIndex].tagList.tags.length===0)
                this.$store.state.dataTree[this.dataSetIndex].commentList.comments[comment.commentIndex].tagList.tags = [];
              this.$store.state.dataTree[this.dataSetIndex].commentList.comments[comment.commentIndex].tagList.tags.push(temp);
              this.currentTag = temp;
              this.addNewTagForComment();
            }
            else this.$message.error("create tag Failed");
          })
          .catch(error => console.log(error))
      },

      refreshPtr(value){
        console.log('**',value)

          this.currentTag = null;
          this.currentComment = null;

          if (this.loadFinish){
            this.commentsTotalNum = this.$store.state.dataTree[this.dataSetIndex].commentList.comments.length;
            if (this.commentsTotalNum!==0) {
              this.currentComment = this.$store.state.dataTree[this.dataSetIndex].commentList.comments[value];
            }
          }
          this.maxPtr = Math.max(this.maxPtr, value);

          if (this.currentComment) {
            if (this.currentComment.tagList.tags.length > 0) {
              console.log(value, this.currentComment.tagList.tags)
              this.currentComment.tagList.tags.forEach(tag =>{
                if (tag.tag_user_info === this.$store.state.currentuser) this.currentTag = tag;
              })
              if (this.currentTag) this.remarkContent = this.currentTag.remarks;
              else this.remarkContent = "";
              if (this.currentTag) {
                this.$store.state.tagValue = this.currentTag.tag_value;
                console.log("i'm setting tag value",this.$store.state.tagValue);
              }
              else this.$store.state.tagValue = -1;
            } else this.$store.state.tagValue = -1;
          }
          this.$store.state.isSaved = true;

      },

      beforeRouteLeave(to, from, next) {
        /*
      if (!this.issave){
        if (confirm(lantext.sentences.exit_work[this.$store.state.lanType]) ) {
          this.$store.state.workstatus = false;
          next()
        }
      }
      else next()

         */
      }
    }

  }
</script>

<style scoped>
</style>
