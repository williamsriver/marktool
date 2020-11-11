<template>
  <v-app>
    <!--顶栏-->
    <v-row v-if="currentComment">

      <v-col cols="10">
        <v-progress-linear height="6" :value="((ptr+1)/commentsTotalNum)*100"></v-progress-linear>
        <v-row v-if="!lookMode">
          <v-col class="pa-0" cols="3">
            <v-card tile outlined>
              <v-list class="pa-0" dense>
              <v-list-item-group v-model="tagValue">
                <template v-for="index in 8">
                  <v-list-item
                    @click="isSaved = false"
                    class="pa-0"
                    :active-class="tagsInfo.colors[index-1]+' white--text'">
                    <template>
                      {{index}}
                      <v-list-item-content :class="tagValue===index-1?'':tagsInfo.colors[index-1]+'--text'" v-text="tagsInfo.text[index-1]"></v-list-item-content>
                    </template>
                  </v-list-item>

                  <v-divider
                    v-if="index < 8"
                    :key="index"
                  ></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
            </v-card>
          </v-col>
          <v-col class="pa-1">
            <v-card tile flat>
              <v-col>
                <v-chip
                  class="ma-2"
                  :color="tagsInfo.colors[tagValue]"
                  text-color="white">
                  <v-avatar left>
                    <v-icon>mdi-checkbox-marked-circle</v-icon>
                  </v-avatar>
                  {{tagsInfo.text[tagValue]}}
                </v-chip>
                <v-row align="baseline" v-show="tagValue>=0">
                  <v-col>
                    {{lantext.words.confidence[$store.state.lanType]}}
                    <span class="text-h5 font-italic">{{trustRating}}</span>
                  </v-col>
                  <v-col>
                    <v-rating :color="tagValue>=0?tagsInfo.colors[tagValue]:''" hover v-model="trustRating"></v-rating>
                  </v-col>

                </v-row>

              </v-col>
                <v-row>
                  <v-col>
                    <v-main>{{lantext.tagwords.taghelpwords[ $store.state.lanType ][ taghelp ] || ''}}</v-main>
                  </v-col>
                </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-container>


          <v-divider></v-divider>

          <!--comment-->
          <v-container v-if="currentComment" fluid>
            <v-row>
              <v-col cols="5">
                <v-simple-table >
                  <thead>
                  <tr>
                    <th class="text-left">{{lantext.words.title[$store.state.lanType]}}</th>
                    <th class="text-left">{{lantext.words.version_info[$store.state.lanType]}}</th>
                    <th class="text-left">{{lantext.words.date_info[$store.state.lanType]}}</th>
                    <th class="text-left">{{lantext.words.rating[$store.state.lanType]}}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>{{currentComment.title}}</td>
                    <td>{{currentComment.version_info}}</td>
                    <td>{{currentComment.datetime_info}}</td>
                    <td>{{currentComment.rank_level}}</td>
                  </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
              <v-col cols="7">
                <v-card flat>
                  <v-card-text
                    v-html="displayComment"
                    class="text-h5 font-weight-regular">
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <v-container v-if="currentComment && !lookMode" fluid>
            <v-row>
              <v-col>
                <v-main v-show="remarkEnable" class="text-left text-h5">
                  {{lantext.words.selection[$store.state.lanType]}}
                  {{lantext.words.area[$store.state.lanType]}}
                </v-main>
              </v-col>
              <v-col cols="3">
                <v-row justify="space-around">
                  <v-btn @click="remarkEnable=true" v-show="!remarkEnable">
                    {{lantext.words.start[$store.state.lanType]}} {{lantext.words.remark[$store.state.lanType]}}
                  </v-btn>
                  <v-btn @click="finishNewNote" v-show="remarkEnable" :disabled="!remarkContent||!selectValid">
                    {{lantext.words.finish[$store.state.lanType]}} {{lantext.words.remark[$store.state.lanType]}}
                  </v-btn>
                  <v-btn @click="remarkEnable=false" v-show="remarkEnable">{{lantext.words.cancel[$store.state.lanType]}}</v-btn>
                </v-row>
              </v-col>
            </v-row>

            <v-textarea
              v-show="remarkEnable"
              outlined readonly hide-details
              id="cmtselect" class="text-h5"
              :value="currentComment.content"
              @click="getMouseSelection($event)">
            </v-textarea>
          </v-container>

          <v-container v-if="currentComment" fluid>
            <v-data-table
              v-if="isListAlive"
              :headers="lantext.headers.remarkHeader[$store.state.lanType]"
              :items="remark"
              hide-default-footer>
            </v-data-table>

            <v-row v-show="remarkEnable">
              <v-col>
                <v-textarea
                  :label="lantext.words.original_reference[$store.state.lanType]"
                  :placeholder="lantext.words.no[$store.state.lanType]+' '+lantext.words.original_reference[$store.state.lanType]"
                  v-model="selectContent"
                  height="150"
                  readonly outlined
                ></v-textarea>
              </v-col>
              <v-col>
                <v-textarea
                  :label="lantext.words.remark[$store.state.lanType]"
                  :rules="makingNewNoteRules"
                  v-model="remarkContent"
                  height="150"
                  outlined
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>

        </v-container>
      </v-col>
      <v-col cols="2">
        <v-row> <v-icon large>mdi-pen</v-icon> </v-row>
        <v-row> {{ptr+1}}/{{commentsTotalNum}} </v-row>
        <v-row>
          <v-btn text :disabled="ptr===0" @click="ptr--, isSaved = true">
            <v-icon large>mdi-arrow-left</v-icon>

              </v-btn>
        </v-row>
        <v-row>{{lantext.words.previous[$store.state.lanType]}}</v-row>
        <v-row>
          <v-btn text @click="ptr++"
                 :disabled="ptr>=commentsTotalNum || (ptr===maxPtr && currentComment.tag_value===-1)
                 || !isSaved || ptr===commentsTotalNum-1">

                <v-icon large>mdi-arrow-right</v-icon>

              </v-btn>
          </v-row>
        <v-row>{{lantext.words.next[$store.state.lanType]}}</v-row>
        <v-row>
          <v-btn text v-if="!lookMode" @click="saveMark" :disabled="isSaved || ptr>=commentsTotalNum ||tagValue===-1">
            <v-icon large>mdi-content-save</v-icon>
          </v-btn>
        </v-row>
        <v-row>{{lantext.words.save[$store.state.lanType]}}</v-row>
        <v-row>
              <v-main>
                <v-icon large>mdi-clock</v-icon>
                {{Math.floor(totalStartTime/3600)}}:{{Math.floor(totalStartTime%3600/60)}}:{{Math.floor(totalStartTime%60)}}
              </v-main>
        </v-row>

      </v-col>
    </v-row>



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
        colors:["teal", "green", "primary", "orange", "indigo", "red", "pink","purple"],
        text:lantext.tagwords.tags[0]
      },

      //remark rule
      makingNewNoteRules: [
        value => !!value || '备注不能为空',
      ],

      displaySet:{
        comment:"",
      },

      loadingNum:0,

      currentTag:null,
      currentComment:null,
      displayComment:null,

      ptr:-1,
      maxPtr:-1,
      tagValue:-1,
      isSaved:true,

      remarkEnable:false,
      selectValid:true,
      selectStart:-1,
      selectEnd:-1,
      selectContent:"",
      remarkContent:"",

      commentsTotalNum:0,

      //responding data
        //mark
      tagmark:"",
      isCmtNoTag:true,
      trustRating:4,
        //remark
      remark:[],
      selectionValid:true,
      makingNewNoteStatus:false,
      isListAlive:true,


      //time counting
      totalStartTime:0,

      //mark helper
      taghelp:'',
      commentPointer:-1,
    }),
    mounted() {
      /*
      window.onkeypress = (function (event) {
        if (event.key === 'd') {
          this.tagmark = (this.tagmark+1) % 8;
          this.issave = false;
        }
        if (event.key === 'a') {
          this.tagmark = this.tagmark>0?this.tagmark-1:7;
          this.issave = false;
        }
        if (event.key === 'Enter') {
          this.saveMark();
        }
      }.bind(this))
      */
    },

    watch:{

      enable: {
        handler(value) {
          console.log("enable",value);
          if (value===true) this.startBoard();
        },
        immediate: true,
      },

      ptr:{
        handler(value){
          console.log('ptr',value);
          this.maxPtr = Math.max(this.maxPtr, value);
          this.currentComment = this.$store.state.dataTree[this.dataSetIndex].commentList.comments[value];
          if (this.currentComment) {
            if (this.currentComment.tagList.tags.length > 0) {
              if (this.currentComment.tagList.tags[0].remarks) {
                if (typeof (this.currentComment.tagList.tags[0].remarks) === "string")
                  this.remark = JSON.parse(this.currentComment.tagList.tags[0].remarks);
                if (typeof (this.currentComment.tagList.tags[0].remarks) === "object")
                  this.remark = this.currentComment.tagList.tags[0].remarks;
              }
            }
          }
          else this.remark = [];
          if (this.currentComment) {
            if (this.currentComment.tagList.tags.length > 0) {
              this.currentTag = this.currentComment.tagList.tags[0];
              this.tagValue = this.currentTag.tag_value;
            }
            else this.tagValue = -1;
          }
          else this.tagValue = -1;
          if (this.currentComment) this.displayComment = this.currentComment.content;
          this.showContent();
        },
        immediate:true,
      },

      loadFinish:{
        handler(value){
          if (value){

          }
        },
        immediate:true,
      }


    },



    methods: {

      goBack() { this.$emit("goBack", true); },

      startBoard(){
        let timer = setInterval(()=>{this.totalStartTime += 1},1000);
        this.commentsTotalNum = this.$store.state.dataTree[this.dataSetIndex].commentList.comments.length;
        this.ptr = 0;
      },

      getMouseSelection() {
        this.selectValid = true

        this.selectStart = document.getElementById('cmtselect').selectionStart
        this.selectEnd = document.getElementById('cmtselect').selectionEnd

        if (this.selectStart === this.selectEnd) this.$message.error('选择内容为空')
        else if (this.checkReplicate(this.selectStart, this.selectEnd)) {
          this.$message.error('选区重复 ' + this.selectStart + ' ' + this.selectEnd)
          this.selectValid = false
        }
        else this.$message.success('已选中');

        if (this.currentComment) this.selectContent = this.currentComment.content.substring(this.selectStart, this.selectEnd );
      },

      showContent() {

        let markNotes = [];
        function compare1(prop) {
          return (a, b) => b[prop] - a[prop]
        }
        console.log(this.remark);
        if (typeof (this.remark) === "string" ) this.remark = JSON.parse(this.remark);
        this.remark.forEach(item => { if (item.markType === 1) markNotes.push(item) });
        markNotes.sort(compare1('text_start'));

        console.log(markNotes);

        let newShowString = "";
        if (this.currentComment) newShowString = this.currentComment.content;
        markNotes.forEach(item => {
          newShowString = newShowString.slice(0, item.text_end) + '</span>' + newShowString.slice(item.text_end, newShowString.length);
          console.log(newShowString,newShowString.slice(item.text_start, newShowString.length));
          newShowString = newShowString.slice(0, item.text_start)
            + '<span style="background-color: #00b0ff">' + newShowString.slice(item.text_start, newShowString.length);
        })
        this.displayComment = newShowString;
        console.log(newShowString);
      },

      checkReplicate(start, end) {
        for (let i = 0; i < this.remark.length; i++) {
          if (this.remark[i].marktype === 1 && !(start > this.remark[i].text_end || end < this.remark[i].text_start)) return true
        }
        return false;
      },

      finishNewNote() {
        //create new remark object
        this.remark.push({
          markType: this.selectContent ? 1 : 0,
          reference: this.selectContent,
          text_start: this.selectContent ? this.selectStart : 0,
          text_end: this.selectContent ? this.selectEnd : 0,
          content: this.remarkContent,
        })

        //refresh selection info
        this.remarkEnable = false
        this.isSaved = false

        this.showContent();
        this.isListAlive = false
        this.$nextTick(() => this.isListAlive = true);
      },



      saveMark() {
        let formData1 = new FormData()
        formData1.append('token', this.$store.state.token);
        this.lantext.tagwords.tags[0].forEach((item,index) => {
          formData1.append(String(item), index===this.tagValue?"True":"False");
        })//chosen tag
        formData1.append('remarks', JSON.stringify(this.remark))
        formData1.append('tag_user_info', this.$store.state.currentuser)//用户信息
        formData1.append('confidence', this.trustRating + "") //confidence

        console.log(formData1);

        if (this.$store.state.dataTree[this.dataSetIndex].commentList.comments[this.ptr].tagList.tagIdList.length === 0)
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
        formData3.append('tag_id', this.currentTag.tag_id)
        this.axios.put('http://tonycoder.ziqiang.net.cn:8080/comments/', formData3)
          .then(response => {
            if (response.data.Msg === "OK") {
              this.$message.success("create new tag succeed");
              this.isSaved = true;
              if (this.ptr<this.commentsTotalNum-1) this.ptr++;
            }
            else this.$message.error("create new tag failed");
          })
          .catch(error => console.log(error))
      },

      editTag(data) {
        this.axios.put('http://tonycoder.ziqiang.net.cn:8080/tag/', data)
          .then(response => {
            if (response.data.Msg === "OK") {
              this.$message.success("tag edit succeed");
              let temp = {};
              temp["tag_value"] = this.tagValue;
              temp["tag_id"] = this.currentTag.tag_id;
              temp["dataSetIndex"] = this.currentTag.dataSetIndex;
              temp["tagIndex"] = this.currentTag.tagIndex;
              temp["remarks"] = this.remark;
              this.$store.state.dataTree[this.currentTag.dataSetIndex].commentList.comments[this.ptr].tagList.tags[this.currentTag.tagIndex] = temp;
              this.isSaved = true;
              if (this.ptr<this.commentsTotalNum-1) this.ptr++;
            }
          })
          .catch(error => console.log(error));
      },

      createTag(data, comment) {
        this.axios.post('http://tonycoder.ziqiang.net.cn:8080/tag/', data)
          .then(response => {
            if (response.data.Details) {
              console.log(response);
              let temp ={};
              temp["tag_value"] = this.tagValue;
              temp["tag_id"] = response.data.Details.tag_id;
              temp["dataSetIndex"] = comment.dataSetIndex;
              temp["tagIndex"] = comment.tagList.tagIdList.length;
              temp["remark"] = this.remark;
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
