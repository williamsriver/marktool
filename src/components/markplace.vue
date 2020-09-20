<template>
  <v-app>

      <!--顶栏-->
    <v-container fluid>
      <v-row dense>
        <v-col cols="2">
          <router-link to="/marklist" class="text-decoration-none">
            <v-btn text>
              <v-icon>mdi-arrow-left</v-icon> {{lantext.words.back[$store.state.lanType]}}
            </v-btn>
          </router-link>
        </v-col>

        <v-col cols="1">
          <v-icon large>mdi-pen</v-icon>
          <span>{{ptr}}/{{viewnum}}</span>
        </v-col>

        <v-col cols="2">
          <v-btn text :disabled="ptr===0" @click="ptr=ptr-1">
            <v-icon large>mdi-arrow-left</v-icon>
            <span>{{lantext.words.previous[$store.state.lanType]}}</span>
          </v-btn>
        </v-col>

        <v-col cols="2">
          <v-btn text @click="ptr=ptr+1" :disabled="ptr>=viewnum || issave ">
            <v-icon large>mdi-arrow-right</v-icon>
            <span>{{lantext.words.next[$store.state.lanType]}}</span>
          </v-btn>
        </v-col>

        <v-col cols="2">
          <v-btn text @click="saveMark" :disabled="issave || !tagmark">
            <v-icon large>mdi-content-save</v-icon>
            <span>{{lantext.words.save[$store.state.lanType]}}</span>
          </v-btn>
        </v-col>

        <v-col cols="3">
          <v-icon large>mdi-content-save</v-icon>
          <span>{{lantext.words.total[$store.state.lanType]}}{{lantext.words.time[$store.state.lanType]}}</span>
          {{Math.floor(totalStartTime/3600)}}:{{Math.floor(totalStartTime%3600/60)}}:{{Math.floor(totalStartTime%60)}}
        </v-col>

      </v-row>

      <v-progress-linear :value="(ptr/viewnum)*100"></v-progress-linear>
    </v-container>

    <!--tags and rating-->
    <v-container fluid>

      <!--tags-->
      <v-radio-group v-model="tagmark" @change="issave = false">

        <v-row>
          <!--tags-->
          <v-col v-for="n in 6" :key="n" :style="{backgroundColor: taghelp===n?'#FAFAFA':'transparent' }" @mouseenter="taghelp = n">
            <v-radio  :value="n-1" :label="lantext.tagwords.tags[$store.state.lanType][n-1]" :key="n"></v-radio>
          </v-col>
        </v-row>

        <v-row>

          <v-col cols="2" :style="{backgroundColor: taghelp===6?'#FAFAFA':'transparent' }" @mouseenter="taghelp = 6">
            <v-radio  :value="6" :label="lantext.tagwords.tags[$store.state.lanType][6]"></v-radio>
          </v-col>

          <v-col cols="3" :style="{backgroundColor: taghelp===7?'#FAFAFA':'transparent' }" @mouseenter="taghelp = 7">
            <v-radio  :value="7" :label="lantext.tagwords.tags[$store.state.lanType][7]"></v-radio>
          </v-col>

          <v-spacer></v-spacer>

          <!-- confidence-->
          <v-col cols="2">
            <span>{{lantext.words.confidence[$store.state.lanType]}}</span>
            <span class="text-h5 font-italic">{{trustRating}}</span>
          </v-col>

          <v-col cols="4">
            <v-rating hover v-model="trustRating"></v-rating>
          </v-col>

        </v-row>

      </v-radio-group>

      <!--tag description -->
      <v-row>
        <v-col>
          <v-main>{{lantext.tagwords.taghelpwords[ $store.state.lanType ][ taghelp ] || ''}}</v-main>
        </v-col>

      </v-row>
    </v-container>

    <v-divider></v-divider>

    <!-- comment info-->
    <v-container fluid>

      <v-row>

        <v-col cols="4">
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">{{lantext.words.title[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.version_info[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.date_info[$store.state.lanType]}}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{currentCmt.title}}</td>
                <td>{{currentCmt.version_info}}</td>
                <td>{{currentCmt.datetime_info}}</td>
              </tr>
            </tbody>
          </v-simple-table>


        </v-col>

        <v-col cols="8">
          <v-card flat>
            <v-card-text v-html="cmtShowString" class="text-h5 font-weight-regular"></v-card-text>
          </v-card>
        </v-col>

      </v-row>

    </v-container>


    <!--selection area-->
    <v-container v-show="makingNewNoteStatus" fluid>

      <v-main class="text-left text-h5">
        {{lantext.words.selection[$store.state.lanType]}}
        {{lantext.words.area[$store.state.lanType]}}
      </v-main>

      <v-textarea
        outlined readonly hide-details
        id="cmtselect" class="text-h5"
        :value="cmtOriginalString"
        @click="makingNewNoteStatus?getMouseSelection($event):''">
      </v-textarea>

    </v-container>

    <!--remark area-->
    <v-container fluid>
      <!--remarks table-->
        <!--其中 islIstAlive 是局部更新data-table-->
        <v-data-table
          v-if="isListAlive"
          :headers="lantext.headers.remarkHeader[$store.state.lanType]"
          :items="remark"
          hide-default-footer>
        </v-data-table>

      <v-btn @click="makingNewNoteStatus=true" v-show="!makingNewNoteStatus">
        {{lantext.words.start[$store.state.lanType]}} {{lantext.words.remark[$store.state.lanType]}}
      </v-btn>

      <v-btn @click="finishNewNote" v-show="makingNewNoteStatus"
             :disabled="!newNoteContent||!selectionValid">
        {{lantext.words.finish[$store.state.lanType]}} {{lantext.words.remark[$store.state.lanType]}}
      </v-btn>

      <v-btn @click="makingNewNoteStatus=false" v-show="makingNewNoteStatus">
        {{lantext.words.cancel[$store.state.lanType]}}
      </v-btn>

        <!--buttons list-->
          <v-row v-show="makingNewNoteStatus">
            <v-col>
              <v-textarea
                :label="lantext.words.original_reference[$store.state.lanType]"
                :placeholder="lantext.words.no[$store.state.lanType]+' '+lantext.words.original_reference[$store.state.lanType]"
                v-model="selectHtml"
                height="150"
                readonly outlined
              ></v-textarea>
            </v-col>

            <v-col>
              <v-textarea
                :label="lantext.words.remark[$store.state.lanType]"
                :rules="makingNewNoteRules"
                v-model="newNoteContent"
                height="150"
                outlined
              ></v-textarea>
            </v-col>

          </v-row>



    </v-container>

  </v-app>
</template>

<script>
  import lantext from "../lib/lantext";
  export default {
    name: "markplace",
    data:()=>({

      //static data
      app_info:'',
      lantext:lantext,



      //select area
      textSelectStart:0, textSelectEnd:0,
      selectHtml:'',// content got from original text
      newNoteContent:'',// operate on selectHtml


      //remark rule
      makingNewNoteRules: [
        value => !!value || '备注不能为空',
      ],


      //responding data
        //total
      currentCmt:"",
      issave:false,
        //mark
      tagmark:"",
      isCmtNoTag:true,
      trustRating:4,
      current_tag_id_list:[],
      current_tag:[],
        //remark
      remark:[],
      selectionValid:true,
      cmtOriginalString:'',
      cmtShowString:'',
      makingNewNoteStatus:false,
      isListAlive:true,

      //comment pointer
      viewnum:0, ptr:-1, maxptr:0,

      //time counting
      singletimelist:[], totalStartTime:0,

      //mark helper
      taghelp:'',

      //empty template
      protoCmt:{
        app_name:"",
        content: "",
        datetime_info: "",
        rank_level: "",
        tag_id_list: "",
        title: "",
        version_info: "",
      }


    }),
    created() {

      //initialize
      this.app_info = this.$route.query.app_info
      this.viewnum = this.app_info.comments_id_list.length
      this.singletimelist = new Array(this.viewnum + 5)//单个评注的时间
      for (let i = 0; i < this.singletimelist.length; i++) this.singletimelist[i] = 0//评注时间列表初始化
      this.ptr = 0

    },
    mounted() {

      //timer
      var timer = setInterval(function () {
        this.singletimelist += 1
        this.totalStartTime += 1
      }.bind(this),1000)
    },

    watch:{
      ptr(value){
        //reset
        this.current_tag = ""
        this.issave = true
        this.trustRating = 4
        this.remark = []
        //refresh current comment and tag info
        this.getcmt(this.app_info.comments_id_list[value])

      }
    },

    methods: {

      //refresh current comment and tag info
      getcmt(comment_id){


        let config1 = { params:{comment_id:comment_id} };
        this.axios.get('http://localhost:8080/comments/',config1)
          .then(function (response) {
            console.log(response)

            //refresh comment
            this.currentCmt = response.data.Details
            if (!this.currentCmt) this.currentCmt = this.protoCmt

            //refresh corresponding parameters and tag list
            this.cmtOriginalString = this.currentCmt.content
            this.cmtShowString = this.cmtOriginalString
            this.isCmtNoTag = !this.currentCmt.tag_id_list.length
            this.current_tag_id_list = this.currentCmt.tag_id_list.split(',')

            console.log('tag_list',this.current_tag_id_list)


            //refresh the only tag mark of the current user in this comment
            for (var i=0;i<this.current_tag_id_list.length;i++) {
              if (this.current_tag_id_list[i]){
                this.axios.get('http://localhost:8080/tag/', {params: {tag_id: this.current_tag_id_list[i]}})
                  .then(function (response) {

                    //if response successfully
                    if (!!response.data.Details) {
                      if (response.data.Details.tag_user_info === this.$store.state.currentuser) {
                        //get the tag successfully
                        this.current_tag = response.data.Details
                        this.remark = []
                        try {
                          this.remark = JSON.parse(this.current_tag.remarks)
                        }
                        catch (e) {}

                        //judge which tag is marked
                        for (var i = 0; i < lantext.tagwords.tags[0].length; i++) {
                          if (this.current_tag[lantext.tagwords.tags[0][i]]) {
                            this.tagmark = i;
                            break;
                          }
                        }

                      }
                    }
                  }.bind(this))
                }
            }

        }.bind(this))
      },

      //remark tools
      getMouseSelection(event) {
        this.selectionValid = true

        var cmtobj = document.getElementById('cmtselect')

        this.textSelectStart = cmtobj.selectionStart
        this.textSelectEnd = cmtobj.selectionEnd

        if (cmtobj.selectionStart === cmtobj.selectionEnd) this.$message.error('选择内容为空')
        else if ( this.checkReplicate(cmtobj.selectionStart,cmtobj.selectionEnd) ) {
          this.$message.error('选区重复 ' + this.textSelectStart + ' ' + this.textSelectEnd)
          this.selectionValid = false
        }
        else this.$message.success('已选中')

        this.selectHtml = this.cmtOriginalString.substring(cmtobj.selectionStart, cmtobj.selectionEnd)
      },

      createCmtShowString() {
        var markNotes = []

        //sort the markNotes in descendent order
        function compare1(prop) {
          return function (a, b) {
            var value1 = a[prop]
            var value2 = b[prop]
            return value2 - value1
          }
        }

        //collect Notes
        for (var i = 0; i < this.remark.length; i++) {
          if (this.remark[i].marktype === 1) {
            markNotes.push(this.remark[i])
          }
        }
        markNotes.sort(compare1('text_start'))

        var newShowString = this.cmtOriginalString

        //add HTML elements from the end to the head
        for (var j = 0; j < markNotes.length; j++) {
          newShowString = newShowString.slice(0, markNotes[j].text_end)
            + '</span>' + newShowString.slice(markNotes[j].text_end, newShowString.length - 1)
          newShowString = newShowString.slice(0, markNotes[j].text_start)
            + '<span style="background-color: #00b0ff">' + newShowString.slice(markNotes[j].text_start, newShowString.length - 1)
        }

        this.cmtShowString = newShowString
      },

      checkReplicate(start,end) {
        for (var i = 0; i < this.remark.length; i++) {
          if (this.remark[i].marktype === 1) {
            return !(start > this.remark[i].text_end || end < this.remark[i].text_start)
          }
        }
        return false
      },

      finishNewNote() {
        //create new remark object
        var noteobj = {
            id: this.remark.length,
            marktype: this.selectHtml?1:0,
            reference: this.selectHtml,
            text_start: this.selectHtml?this.textSelectStart:0,
            text_end: this.selectHtml?this.textSelectEnd:0,
            content: this.newNoteContent,
        }
        this.remark.push(noteobj)

        //refresh selection info
        this.selectionValid = true
        this.selectHtml = ""
        this.newNoteContent = ""
        this.makingNewNoteStatus = false
        this.issave = false

        //redraw the text
        this.createCmtShowString()

        //reload the table
        this.isListAlive = false
        this.$nextTick(function () {
          this.isListAlive = true
        })
      },

      updatecmt(comment_id,tag_id){
        var date = new Date();

        let new_list = !this.current_tag_id_list ? [] : this.current_tag_id_list
        new_list.push(tag_id)

        let formData3 = new FormData()
        formData3.append("datetime_info",date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate())
        formData3.append('comment_id',this.app_info.comments_id_list[this.ptr])
        formData3.append('tag_id',new_list)

        this.axios.put('http://localhost:8080/comments/',formData3)
          .then(function (response) {
            console.log(response)
            if (!response.data.msg){
              this.issave = true;
              this.ptr++;
              this.$message.success(
                lantext.words.save[this.$store.state.lanType] +
                lantext.sentences.item_success[this.$store.state.lanType]
              )
            }
            else this.$message.error(
              lantext.words.save[this.$store.state.lanType] +
              lantext.sentences.item_failed[this.$store.state.lanType]
            )
          }.bind(this))
      },


      saveMark(key) {
        var formData1 = new FormData()

        formData1.append('token', this.$store.state.token)
        for (let i = 0; i < this.lantext.tagwords.tags[0].length; i++) {
          formData1.append(this.lantext.tagwords.tags[0][i], this.tagmark === i ? "True" : "False")
        }
        formData1.append('remarks', JSON.stringify(this.remark) )//备注
        formData1.append('tag_user_info', this.$store.state.currentuser)//用户信息
        formData1.append('confidence', this.trustRating) //confidence

        if (this.current_tag === "") {
          this.axios.post('http://localhost:8080/tag/', formData1)
            .then(function (response) {
              console.log(response)
              if (response.data.Msg === 'OK') {
                this.updatecmt(this.app_info.comments_id_list[this.ptr], response.data.Details.tag_id)
              }
              else this.$message.error(
                lantext.words.save[this.$store.state.lanType] +
                lantext.sentences.item_failed[this.$store.state.lanType]
              )
            }.bind(this))
        }
        else{
          console.log('ready to put')

          var formData2= formData1
          formData2.append('tag_id',this.current_tag.tag_id)

          this.axios.put('http://localhost:8080/tag/', formData2)
            .then(function (response) {
              console.log(response)
              if (response.data.Msg === "OK") {
                this.issave = true;
                this.ptr++;
                this.$message.success(
                  lantext.words.save[this.$store.state.lanType] +
                  lantext.sentences.item_success[this.$store.state.lanType]
                )
              }
              else this.$message.error(
                lantext.words.save[this.$store.state.lanType] +
                lantext.sentences.item_failed[this.$store.state.lanType]
              )
            }.bind(this))
        }

      },

    },

    beforeRouteLeave (to, from, next) {
      if (confirm(lantext.sentences.exit_work[this.$store.state.lanType]) ){
        this.$store.state.workstatus = false;
        next()
      }
    }

  }
</script>

<style scoped>
</style>
