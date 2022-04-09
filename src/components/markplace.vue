<template>
  <v-app>
    <v-container fluid  class="pa-0">
      <v-row dense>
        <v-col class="pa-0">
          <v-container fluid>
<!--            顶栏-->
            <v-row dense align="baseline">
              <v-btn text @click="$store.state.workStatus = false">
                <v-icon>mdi-arrow-left</v-icon>
                <v-main>{{lantext.words.back[$store.state.lanType]}}</v-main>
              </v-btn>
              <v-col cols="1">
                <v-text-field v-model="ptr"></v-text-field>
              </v-col>
              <span>{{ptr}}/{{$store.state.map.dataset_comment_map.get($store.state.chosen_dataset_id).length-1}}</span>
<!--              <v-col>-->
<!--                <v-progress-linear-->
<!--                  height="6"-->
<!--                  :value="(ptr/($store.state.map.dataset_comment_map.get($store.state.chosen_dataset_id).length-1))*100">-->
<!--                </v-progress-linear>-->
<!--              </v-col>-->
              <v-icon>mdi-clock</v-icon>
              {{markHour}}:{{markMin}}:{{markSec}}
            </v-row>

            <v-row>

<!--              tag标签-->
              <v-col cols="2">
                <v-card class="ma-0" >

                  <v-main
                    v-for="index in $store.state.tag_category.values.length"
                    :key="index">
                    <v-chip
                      class="ma-2" dark
                      @click="chooseTag(index-1)">
                      <v-avatar left
                        v-if="currentTag && currentTag.tag_value===$store.state.tag_category.values[index-1]">
                        <v-icon>mdi-checkbox-marked-circle</v-icon>
                      </v-avatar>
                      {{$store.state.tag_category.showcase[$store.state.lanType===0?'en':'ch'][index-1]}}
                    </v-chip>
                  </v-main>
                </v-card>
              </v-col>
<!--              标签的解释-->
              <v-col cols="3">
                <v-card >
                  <v-main class="font-weight-black text-h6" >
                    {{desc_chosen_tag_showcase}}
<!--                    {{lantext.tagwords.tags[$store.state.lanType][$store.state.tagValue]}}-->
                  </v-main>
                  <v-virtual-scroll
                    :items="['example_one_item']"
                    :min-height="200"
                    :max-height="450"
                    :item-height="450">
                    <template v-slot:default="{item}">
                      <v-card height="auto">
                        <span>{{desc}}</span>
                      </v-card>
                    </template>
                  </v-virtual-scroll>
                </v-card>
              </v-col>
<!--              comment信息,confidence,rationale-->
              <v-col align-self="end">
                <v-container class="pa-0" >
                  <v-row>
                    <v-col>
                      <v-chip class="ma-2"  text-color="white">
                        <v-avatar left
                          v-if="currentTag">
                          <v-icon>mdi-checkbox-marked-circle</v-icon>
                        </v-avatar>
                        {{currentTag?currentTag.tag_value:'--'}}
                      </v-chip>
                    </v-col>
                    <v-col>
                      {{lantext.words.confidence[$store.state.lanType]}}
                      <span class="text-h5 font-italic">{{currentTag.confidence}}</span>
                    </v-col>
                    <v-col>
                      <v-rating hover v-model="currentTag.confidence"></v-rating>
                    </v-col>
                    <v-col cols="3"></v-col>
                  </v-row>

                  <v-card height="400">
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
                    <v-main class="font-weight-black">{{lantext.words.content[$store.state.lanType]}} :</v-main>
                    <v-main class="font-weight-black">{{currentComment.content}}</v-main>

                    <v-textarea
                      @change="isSaved = false"
                      :label="lantext.words.remark[$store.state.lanType]"
                      v-model="currentTag.rationale" outlined full-width>
                    </v-textarea>
                  </v-card>

                  <v-row>
                    <v-col>
                      <v-btn text :disabled="ptr<=0 || !isSaved" @click="ptr_go_left">
                        <v-icon>mdi-arrow-left</v-icon>
                        {{lantext.words.previous[$store.state.lanType]}}
                      </v-btn>
                    </v-col>
                    <v-col>
                      <v-btn text @click="ptr++" :disabled="!isSaved">
                        <v-icon>mdi-arrow-right</v-icon>
                        {{lantext.words.next[$store.state.lanType]}}
                      </v-btn>
                    </v-col>
                    <v-col>
                      <v-btn text @click="saveMark" :disabled="!saveValid">
                        <v-icon>mdi-content-save</v-icon>
                        {{lantext.words.save[$store.state.lanType]}}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
  import lantext from "../lib/lantext";
  import defaultTag from "../lib/defaultTagCategory"
  export default {
    name: "markplace",
    props: {
      enable:{
        type:Boolean,
        required:true,
      },
    },
    data:()=>({
      //static data
      lantext:lantext,
      defaultTag,
      tagColors:["teal", "green", "primary", "orange", "indigo", "red", "pink","purple","#9E9D24","#FFC107","#E65100","#5D4037"],
      tagsInfo:{
        colors:["teal", "green", "primary", "orange", "indigo", "red", "pink","purple","#9E9D24","#FFC107","#E65100","#5D4037"],
        text:['Functional',
          'Suitability','Performance','Compatibility', 'Usability','Security','Reliability','Maintainability','Portability',
          'Bug_Fix','Others'],
      },
      //关键数据（需要及时更新）
      ptr:0,
      currentTag:{
        tag_id:null,
        tag_value:null,
        rationale:null,
        tag_user_info:null,
        confidence:4
      },
      corresponding_desc:"",
      currentComment:null,
      totalStartTime:0,
      isSaved:true,

      // presskey:"",
      // pressIndex:0,
    }),
    created() {
      this.$store.state.tag_category = this.defaultTag
    },
    mounted() {
      let timer = setInterval(()=>{this.totalStartTime += 1},1000);
      this.ptr = 0;
      // window.onkeypress = (event =>{
      //   if (event.key==='q'){
      //     this.$store.state.tagValue = (this.$store.state.tagValue+1) % 11;
      //     this.isSaved = false;
      //   }
      // });
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
        return ! ( this.isSaved || this.ptr<0 || this.$store.state.tagValue === -1 );
      },
      desc_chosen_tag_showcase(){
        if (!this.currentTag.tag_value) return ''
        var index = this.$store.state.tag_category.values.indexOf(this.currentTag.tag_value)
        // console.log('index', index)
        if (index !== -1){
          return this.$store.state.tag_category.showcase[this.$store.state.lanType === 0?'en':'ch'][index]
        }
        else return this.this.currentTag.tag_value
      },
      desc(){
        if (!this.currentTag) return ''
        var desc_index = this.$store.state.tag_category.values.indexOf(this.currentTag.tag_value)
        // console.log(this.currentTag.tag_value, "index", desc_index)
        if (desc_index === -1) return "--"
        else {
          return this.$store.state.tag_category.desc[this.$store.state.lanType === 0 ? 'en' : 'ch'][desc_index]
        }
      }

    },
    watch:{
      ptr:{
        handler(value){
          if (value<this.$store.state.map.dataset_comment_map.get(this.$store.state.chosen_dataset_id).length
            && value>=0 && !!value  ) {

            this.refreshWithPtr(value);
          }
          else{
            // console.log('ptr',this.enable,value)
            console.log(value)
            this.ptr = 0;
            this.refreshWithPtr(0);
          }
        },
        immediate:true,
      }
    },

    methods: {
      chooseTag(index){
        this.currentTag.tag_value = this.$store.state.tag_category.values[index]
        this.isSaved = false


      },

      ptr_go_left(){
        //标注是从左到右的，因此左边的标注必然已经保存
        this.ptr--
        this.isSaved = true
      },

      /**
       * 保存某个标签
       */
      saveMark() {
        var formData1 = new FormData()
        //检查是否有合法标签值
        var remarks_object = {
          tag_value : this.currentTag.tag_value,
          rationale : this.currentTag.rationale
        }
        formData1.append('remarks', JSON.stringify(remarks_object) )
        formData1.append('token', this.$store.state.token);
        formData1.append('tag_user_info', this.$store.state.currentuser)//用户信息
        formData1.append('confidence', this.currentTag.confidence) //confidence


        if (!this.currentTag.tag_id)
          this.createTag(formData1, this.currentComment.comment_id, this.currentComment.dataset_id);
        else {
          formData1.append('tag_id',this.currentTag.tag_id);
          this.editTag(formData1);
        }
      },

      addNewTagForComment(tag_id, comment_id){
        let formData1 = new FormData()
        let date = new Date();
        formData1.append("datetime_info", date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())
        formData1.append('comment_id', comment_id)
        formData1.append('tag_id', tag_id)
        this.axios.put('/comments/', formData1).then(response => {
          console.log(response)
          if (response.data) {
            this.$message.success("create new tag succeed");
            this.isSaved = true;
            var dataset_id = this.currentComment.dataset_id
            this.get_tag_object(tag_id, comment_id, dataset_id)
            this.ptr++;
          }
          else this.$message.error("create new tag failed");
        })
        .catch(error => console.log(error))
      },

      editTag(data) {
        console.log(data)
        this.axios.put('/tag/', data).then(response => {
          console.log(response);
          if (response.data.Msg === "OK") {
            this.$message.success("tag edit succeed");
            var dataset_id = this.currentComment.dataset_id
            var comment_id = this.currentComment.comment_id
            var tag_id = this.currentTag.tag_id
            this.get_tag_object(tag_id, comment_id, dataset_id)
            this.ptr++;
          }
        })
        .catch(error => console.log(error));
      },

      get_tag_object(tag_id, comment_id, dataset_id) {
        console.log('get tag object',tag_id)
        if (!tag_id) return
        /**
         * tag object
         * tag_id = models.AutoField(primary_key=True)
         * remarks = models.CharField(max_length=500,default="",verbose_name=u'备注信息')
         *  => tag_value
         *  => rationale
         * tag_user_info = models.CharField(max_length=32,verbose_name=u'标注者信息')
         * confidence = models.IntegerField(default=0,verbose_name=u'置信度')
         */
        this.axios.get('/tag/', {
          params: {
            tag_id: tag_id
          }
        }).then(response => {
          console.log(response)
          if (response.data.Details) {
            var tag_object = response.data.Details
            tag_object["dataset_id"] = dataset_id
            tag_object["comment_id"] = comment_id
            try {
              var t1 = JSON.parse(tag_object.remarks);
              tag_object["tag_value"] = t1.tag_value;
              tag_object["rationale"] = t1.rationale;
            }
            catch (e) {
              console.log(e)
            }
            this.$store.state.map.tag_map.set(tag_id, tag_object)
          } else this.$message.error('tag acquiring error');

        }).catch(error => console.log(error))
      },

      createTag(request_data, comment_id, dataset_id) {
        this.axios.post('/tag/', request_data).then(response => {
          console.log(response);
          if (response.data.Details) {
            var tag_object = response.data.Details
            var tag_id = tag_object.tag_id

            this.addNewTagForComment(tag_id, comment_id)

            this.$store.state.list.tag_id_list.push(tag_id)
            var temp_tag_list = this.$store.state.map.comment_tag_map.has(comment_id) ?
              this.$store.state.map.comment_tag_map.get(comment_id) : []
            temp_tag_list.push(tag_id)
            this.$store.state.map.comment_tag_map.set(comment_id, temp_tag_list)
          }
          else this.$message.error("create tag Failed");
        })
        .catch(error => console.log(error))
      },

      /**
       * 更新关键动态数据
       */
      refreshWithPtr(value){
        console.log('refreshWithPtr',value)
        var comment_id = this.$store.state.map.dataset_comment_map.get(this.$store.state.chosen_dataset_id)[value]
        this.currentComment = this.$store.state.map.comment_map.get(comment_id)
        var comment_tag_id_list = this.$store.state.map.comment_tag_map.get(comment_id)

        console.log('list',comment_tag_id_list)

        this.currentTag = {
          tag_id:null,
          tag_value:null,
          rationale:null,
          tag_user_info:null,
          confidence:4
        }

        comment_tag_id_list.forEach(tag_id =>{
          var tag = this.$store.state.map.tag_map.get(tag_id)
          console.log(tag)
          if (tag && tag.tag_user_info === this.$store.state.currentuser) this.currentTag = tag
        })
        this.isSaved = true;
      },

      beforeRouteLeave(to, from, next) {
        if (!this.issave){
          if (confirm(lantext.sentences.exit_work[this.$store.state.lanType]) ) {
            this.$store.state.workstatus = false;
            next()
          }
        }
        else next()
      }
    }

  }
</script>

<style scoped>
</style>
