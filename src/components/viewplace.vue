<template>

  <v-app>

    <!--top tab-->
    <v-container fluid>

      <v-row dense>
        <v-col cols="2">
          <router-link to="/viewlist" class="text-decoration-none">
            <v-btn text>
              <v-icon>mdi-arrow-left</v-icon>
              {{lantext.words.back[$store.state.lanType]}}</v-btn>
          </router-link>
        </v-col>

        <v-spacer></v-spacer>

        <v-col cols="3">
          <v-icon large>mdi-clock</v-icon>
          <span>{{lantext.words.total[$store.state.lanType]}}{{lantext.words.time[$store.state.lanType]}}</span>
          {{Math.floor(totalStartTime/3600)}}:{{Math.floor(totalStartTime%3600/60)}}:{{Math.floor(totalStartTime%60)}}
        </v-col>

      </v-row>

    </v-container>

    <!--mode radio & search tab-->
    <v-container fluid>
      <v-row>
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
      :loading="tag_got<tag_need"
      :headers="lantext.headers.viewHeaders[$store.state.lanType]"
      :search="viewMode===1?viewSearch:'1'"
      :items="$store.state.tags"
      :custom-filter="viewMode===1?customfilter1:customfilter2"
      item-key="tag_id"
      show-expand
      hide-default-footer>
      <template v-slot:item.tag_choose="{item}">
        {{lantext.tagwords.tags[$store.state.lanType][item.tag_choose]}}
      </template>
      <template v-slot:item.view="{item}">
        <v-btn text @click="refreshCurrentCmt(item.comment_id)">
          <v-icon>mdi-pen-plus</v-icon>
        </v-btn>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-data-table
          :headers="lantext.headers.remarkHeader[$store.state.lanType]"
          :items="item.remarks"
          hide-default-footer>
          </v-data-table>
        </td>
      </template>

    </v-data-table>


    <v-spacer style="height: 30px"></v-spacer>
    <v-divider></v-divider>
    <v-spacer style="height: 30px"></v-spacer>

      <!--comment info -->
    {{currentCmt}}
    <v-data-table
      :headers="lantext.headers.commentHeader[$store.state.lanType]"
      :items="currentCmt"
      hide-default-footer>

    </v-data-table>

    <!--tags-->
    <v-container fluid>
    <v-radio-group v-model="tagmark">

      <v-row>
          <!--tags-->
        <v-col v-for="n in 6" :key="n" :style="{backgroundColor: taghelp===n?'#FAFAFA':'transparent' }" @mouseenter="taghelp=n">
          <v-radio  :value="n-1" :label="lantext.tagwords.tags[$store.state.lanType][n-1]" :key="n"></v-radio>
        </v-col>
      </v-row>

      <v-row>

        <v-col cols="2" :style="{backgroundColor: taghelp===6?'#FAFAFA':'transparent' }" @mouseenter="taghelp=6">
          <v-radio  :value="6" :label="lantext.tagwords.tags[$store.state.lanType][6]"></v-radio>
        </v-col>

        <v-col cols="3" :style="{backgroundColor: taghelp===7?'#FAFAFA':'transparent' }" @mouseenter="taghelp= 7">
          <v-radio  :value="7" :label="lantext.tagwords.tags[$store.state.lanType][7]"></v-radio>
        </v-col>

        <v-spacer></v-spacer>
        <v-col cols="2">
          <v-btn :disabled="comment_pointer===-1" @click="sendView(comment_pointer,tagmark)" text>
            <v-icon large>mdi-pen-plus</v-icon>
            {{lantext.words.view[$store.state.lanType]}}
          </v-btn>
        </v-col>

      </v-row>
    </v-radio-group>

    <!--tag description -->
    <v-row>
      <v-col>
        <v-main>{{lantext.tagwords.taghelpwords[ $store.state.lanType ][ taghelp ]}}</v-main>
      </v-col>
    </v-row>
    </v-container>

  </v-app>
</template>

<script>
  import lantext from "../lib/lantext";
    export default {
        name: "viewplace",
      data:()=>({
        //static data
        app_info:'',
        lantext:lantext,

        tagmark:0,
        currentCmt:[],

        tag_need:0,
        tag_got:0,
        comment_pointer:-1,


        //all the tag under all comments
        comments_list:[],
        comments_order:[],
        tags_list:[],
        contradict_list:{},//record the comment having contradict tags

        panel_value:[],

        viewMode:1, viewStatus:false,
        viewSearch:'',
        taghelp:'',

        viewnum:0, ptr:1, maxptr:1,
        singletimelist:[], totalStartTime:0,
        issave:[],

      }),
      created() {
        //initialize
        this.app_info = this.$route.query.app_info
        this.singletimelist = new Array(this.viewnum+5)//单个评注的时间
        for (let i=0;i<this.singletimelist.length;i++) this.singletimelist[i]=0//评注时间列表初始化

        //all the tags in all comments
        if (this.$store.state.tags.length===0) this.reget()

      },
      mounted() {

        //timer
        var timer = setInterval(function () {
          this.singletimelist[this.ptr] += 1
          this.totalStartTime += 1
        }.bind(this),1000)

      },
      methods:{

        reget(){
          for (var i = 0; i < this.app_info.comments_id_list.length; i++) {
            this.getTagsByCmt(this.app_info.comments_id_list[i])
          }
        },

        findCmt(comment_id){
          for (var i=0;i<this.$store.state.comments.length;i++){
            if (this.$store.state.comments[i].comment_id === comment_id){
              return this.$store.state.comments[i]
            }
          }
          return -1;
        },

        refreshCurrentCmt(comment_id){
          this.currentCmt = []
          this.currentCmt.push(this.findCmt(comment_id))
           if (this.currentCmt===-1) this.currentCmt = []
        },

        customfilter1(value,search,item){
          return item.confidence <= Number(search)
        },

        customfilter2(value,search,item){
          console.log(this.contradict_list['cmt'+item.comment_id])
          return this.contradict_list['cmt'+item.comment_id] === "contradict"
        },

        getTagsByCmt(comment_id){
          this.getTags( this.findCmt(comment_id).tag_id_list.split(',') , comment_id)
        },

        getTags(list,comment_id){

          for (var i = 0; i < list.length; i++) {
            if (!!list[i]) {
              this.tag_need ++;
              this.axios.get('http://localhost:8080/tag/', {params: {tag_id: list[i]}})
                .then(function (response) {
                  if (response.data.Msg === "OK") {
                    this.tag_got ++;
                    //judge which tag is marked
                    let tag_choose = -1
                    for (var i = 0; i < lantext.tagwords.tags[0].length; i++) {
                      if (response.data.Details[lantext.tagwords.tags[0][i]]) {
                        tag_choose = i;
                        break;
                      }
                    }

                    //get remarks
                    var new_remarks = []
                    console.log(response.data.Details.remarks)
                    if (!!response.data.Details.remarks)
                      try {
                        new_remarks = JSON.parse(response.data.Details.remarks)
                      }
                      catch(error){}
                    if ( !this.contradict_list['cmt'+comment_id] ) this.contradict_list['cmt'+comment_id] = 'tag'+tag_choose
                    else if (this.contradict_list['cmt'+comment_id] !== 'tag'+tag_choose){
                      this.contradict_list['cmt'+comment_id] = "contradict"
                    }

                    this.$store.state.tags.push({
                      comment_id:comment_id,
                      tag_id: response.data.Details.tag_id,
                      remarks: new_remarks,
                      confidence:response.data.Details.confidence,
                      tag_user_info: response.data.Details.tag_user_info,
                      tag_choose: tag_choose,
                    })


                  }
                }.bind(this))
            }
          }

        },

        sendView(comment_id,tag_choose){
          var date = new Date();
          let formData3 = new FormData()
          formData3.append("datetime_info",date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate())
          formData3.append('comment_id',this.app_info.comments_id_list[this.ptr])
          formData3.append('tag_result',tag_choose)

          this.axios.put('http://localhost:8080/comments/',formData3)
            .then(function (response) {
              console.log(response)
              if (!response.data.msg){
                this.$message.success(
                  lantext.words.view[this.$store.state.lanType] +
                  lantext.sentences.item_success[this.$store.state.lanType]
                )
                this.comment_pointer = -1;
              }
              else this.$message.error(
                lantext.words.view[this.$store.state.lanType] +
                lantext.sentences.item_failed[this.$store.state.lanType]
              )
            }.bind(this))
        }

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
