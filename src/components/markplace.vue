<template>
  <v-app v-if="$store.state.user_level === 0">
    <v-container fluid  class="pa-0">
      <v-row dense>
        <v-col class="pa-0">
          <v-container fluid>
<!--            顶栏-->
            <v-row dense align="baseline">
<!--              button[back]:go back to the 'commentlist' -->
              <v-btn text @click="$store.state.workStatus = false">
                <v-icon>mdi-arrow-left</v-icon>
                <v-main>{{lantext.words.back[$store.state.lanType]}}</v-main>
              </v-btn>
<!--              enable users to input the wanted location in a dataset -->
              <v-col cols="1">
                <v-text-field v-model="ptr"></v-text-field>
              </v-col>
<!--              show the location we are on-->
              <span>{{ptr}}/{{$store.state.map.dataset_comment_map.get($store.state.chosen_dataset_id).length-1}}</span>
<!--              labeling time-->
              <v-icon>mdi-clock</v-icon>
              {{markHour}}:{{markMin}}:{{markSec}}
            </v-row>

            <v-row>

<!--              tag标签-->
              <v-col cols="2">
                <v-card
                  class="ma-0 overflow-x-auto overflow-y-auto"
                  :max-height="450">
                  <v-main
                    v-for="index in $store.state.chosen_tag_category.object.tags.length"
                    :key="index">
                    <v-chip
                      :color="$store.state.colors[index-1]"
                      class="ma-2" dark
                      @click="chooseTag(index-1)">
                      <v-avatar left
                        v-if="currentTag &&
                        currentTag.tag_value===$store.state.chosen_tag_category.object.tags[index-1].value">
                        <v-icon>mdi-checkbox-marked-circle</v-icon>
                      </v-avatar>
                      {{$store.state.chosen_tag_category.object.tags[index-1]
                      .reference[$store.state.lanType === 0?'en':'ch']}}
                    </v-chip>
                  </v-main>
                </v-card>
              </v-col>
<!--              标签的解释-->
              <v-col cols="3">
                <v-card>
<!--                  chosen tag's name-->
                  <v-main>{{currentTag ? currentTag.tag_value : '--'}}</v-main>
<!--                  chosen tag's description-->
                  <v-virtual-scroll
                    :items="['example_one_item']"
                    :min-height="200"
                    :max-height="450"
                    :item-height="450">
                    <template v-slot:default="{item}">
                      <v-card height="auto">
                        <div v-html="chosen_tag_description"></div>
                      </v-card>
                    </template>
                  </v-virtual-scroll>
                </v-card>
              </v-col>
<!--              comment信息,confidence,rationale-->
              <v-col align-self="end">
                <v-container class="pa-0" >
<!--                  tag chosen and confidence-->
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
<!--                  info of current comment-->
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
<!--                  ptr go left/right, save-->
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
  import default_tag_category from "../lib/defaultTagCategory";
  export default {
    name: "markplace",
    props: {
      // enable:{
      //   type:Boolean,
      //   required:true,
      // },
    },
    data:()=>({
      //static data
      overlays:{
        edit_label_category:false,
      },
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
      first_comment_id:null,

      tag_category_creating:0,
      tag_category_finish:0,
      new_tag_category_list:[],
      chosen_tag_description:"",

      // presskey:"",
      // pressIndex:0,
    }),
    created() {
      // this.$store.state.tag_category = this.defaultTag
    },
    mounted() {
      let timer = setInterval(()=>{this.totalStartTime += 1},1000);
      this.ptr = 0;
      if (!this.$store.state.current_tag_category_saved){
        this.save_tag_category(this.$store.state.chosen_tag_category)
        this.$store.state.current_tag_category_saved = true
      }
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
      change_chosen_tag_description(){
        if (!this.currentTag) this.chosen_tag_description = '--'

        var desc_index = -1
        this.$store.state.chosen_tag_category.object.tags.forEach((tag, index)=>{
          if (tag.value === this.currentTag.tag_value) desc_index = index
        })
        // console.log(this.currentTag.tag_value, "index", desc_index)
        if (desc_index === -1) this.chosen_tag_description = "--"
        else {
          this.chosen_tag_description = this.$store.state.chosen_tag_category.object.tags[desc_index]
            .description[this.$store.state.lanType === 0 ? 'en' : 'ch']
        }
      },

      //把所有tag_category对象都挂到dataset的第一个comment上，这样保证了每次的读取
      /**
       * 每个tag_category的专用标签的remark
       * {
       * category_name:<String>,
       * eof:false/true
       * str_slice:<String>
       * }
       */
      save_tag_category(category){
        let str_category = JSON.stringify(category.object)
        let interval = 400
        let slice_num = Math.ceil(str_category.length / interval) //至少需要几个tag来存储
        var first_comment_id = this.$store.state.map.dataset_comment_map.get(this.$store.state.chosen_dataset_id)[0]
        // console.log(first_comment_id)
        var first_comment = this.$store.state.map.comment_map.get(first_comment_id)
        this.first_comment_id = first_comment_id
        var first_comment_tag_id_list = this.$store.state.map.comment_tag_map.get(first_comment_id)

        //把所有tag category标注找出来
        var tag_category_tag_list = []
        var tag_category_tag_ptr = 0
        first_comment_tag_id_list.forEach(tag_id =>{
          if (tag_id){
            var tag = this.$store.state.map.tag_map.get(tag_id)
            if (tag && !tag.tag_value){
              tag_category_tag_list.push(tag_id)
            }
          }
        })

        console.log('tag_category_tag_list', tag_category_tag_list)
        // console.log('total_list',first_comment)

        // 0 -> slice_num-1
        for (let i = 0;i<slice_num;i++){
          var formData1 = new FormData()
          var remarks_object = {
            category_name : category.object.name,
            total:slice_num,
            no:i,
            eof : (i >= slice_num - 1),
            str_slice : str_category.substr(i*interval, interval)
          }
          console.log('remark', remarks_object)
          formData1.append('remarks', JSON.stringify(remarks_object) )
          formData1.append('token', this.$store.state.token);
          formData1.append('tag_user_info', this.$store.state.currentuser)//用户信息
          formData1.append('confidence', '5') //confidence

          this.tag_category_creating++
          this.new_tag_category_list = first_comment_tag_id_list //再想加tag要在原来的基础上添加tags

          if (tag_category_tag_ptr < tag_category_tag_list.length){
            formData1.append('tag_id', tag_category_tag_list[tag_category_tag_ptr])
            this.editTag(formData1, true)
            tag_category_tag_ptr++
          }
          else {
            this.createTag(this.finish_tag_category_creating,
              formData1, first_comment_id, this.currentComment.dataset_id, true)
          }
        }
      },



      finish_tag_category_creating(tag_id){
        this.tag_category_finish++
        this.new_tag_category_list.push(tag_id)
        if (this.tag_category_creating === this.tag_category_finish){
          var str_tag_list = ""
          for (var i =0;i<this.new_tag_category_list.length-1;i++)
            str_tag_list += this.new_tag_category_list[i] + ','
          str_tag_list += this.new_tag_category_list[this.new_tag_category_list.length-1]

          this.addNewTagForComment(str_tag_list, this.first_comment_id, true)
        }
      },

      chooseTag(index){
        this.currentTag.tag_value = this.$store.state.chosen_tag_category.object.tags[index].value
        this.change_chosen_tag_description()
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
          this.createTag(null, formData1, this.currentComment.comment_id, this.currentComment.dataset_id);
        else {
          formData1.append('tag_id',this.currentTag.tag_id);
          this.editTag(formData1);
        }
      },
      //这里必须将已有的所有tag和新添加的tag做拼接
      addNewTagForComment(tag_id, comment_id, is_tag_category){
        console.log('addnewTag', tag_id, comment_id, is_tag_category)
        let formData1 = new FormData()
        let date = new Date();
        formData1.append("datetime_info", date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())
        formData1.append('comment_id', comment_id)
        formData1.append('tag_id', tag_id)
        this.axios.put('/comments/', formData1).then(response => {
          console.log(response)
          if (response.data) {
            console.log("create new tag succeed", tag_id);
            if (!is_tag_category){
              this.$message.success("create new tag succeed");
              this.isSaved = true;
              var dataset_id = this.currentComment.dataset_id
              // this.get_tag_object(tag_id, comment_id, dataset_id)
              console.log('get comment', comment_id)
              this.get_comment_object(comment_id, dataset_id)
              this.ptr++;

            }
          }
          else this.$message.error("create new tag failed");
        })
        .catch(error => console.log(error))
      },



      editTag(data, is_tag_category = false) {
        console.log(data)
        this.axios.put('/tag/', data).then(response => {
          console.log(response);
          if (response.data.Msg === "OK") {
            console.log("tag edit succeed");
            if (!is_tag_category){
              var dataset_id = this.currentComment.dataset_id
              var comment_id = this.currentComment.comment_id
              this.$message.success("tag edit succeed");
              var tag_id = this.currentTag.tag_id
              this.get_tag_object(tag_id, comment_id, dataset_id)
              this.ptr++;
            }

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

      createTag(callback, request_data, comment_id, dataset_id, is_tag_category = false) {
        this.axios.post('/tag/', request_data).then(response => {
          console.log(response);
          if (response.data.Details) {
            console.log('detail',response);
            // console.log(is_tag_category)
            var tag_object = response.data.Details
            var tag_id = tag_object.tag_id

            if (!is_tag_category){

              //获取原来所有tag的序列加上新增tag的字符串
              var str_tag_list = ""
              var current_tag_id_list = [... new Set(this.$store.state.map.comment_tag_map.get(comment_id)) ]
              for (var i =0;i<current_tag_id_list.length;i++) str_tag_list += current_tag_id_list[i] + ','
              str_tag_list += tag_id

              console.log('str_tag_list', str_tag_list, tag_id)

              //更新这个comment的数据
              this.addNewTagForComment(str_tag_list, comment_id, is_tag_category)
            }
            else callback(tag_id)
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
          if (tag && tag.tag_user_info === this.$store.state.currentuser &&
            !tag.hasOwnProperty('category_name')) this.currentTag = tag
        })
        this.isSaved = true;
      },

      //获取comment对象
      get_comment_object(comment_id, dataset_id){
        if (!comment_id) return
        // console.log("get comment object", comment_id)
        /**
         * comment object
         * app_name: "Monkey"
         * content: "- \"Add Friend\" changed to \"Follow\""
         * datetime_info: "2019-02-07"
         * rank_level: 1
         * tag_id_list: ""
         * tag_result: -1
         * title: ""
         * version_info: "5.1.8"
         */
        this.axios.get('/comments/', {
          params: {
            comment_id: comment_id
          }
        }).then(response => {
          console.log(response)
          if (response.data.Details) {
            var comment_object = response.data.Details
            comment_object["dataset_id"] = dataset_id
            comment_object["comment_id"] = comment_id
            this.$store.state.map.comment_map.set(comment_id, comment_object)
            var sub_tag_id_list = [...new Set(comment_object.tag_id_list.split(','))]
            this.$store.state.map.comment_tag_map.set(comment_id, sub_tag_id_list)
            // callback()
            // this.refresh_dataset_table()
            this.$store.state.list.tag_id_list = [...new Set(this.$store.state.list.tag_id_list.concat(sub_tag_id_list))]
            console.log(comment_id, sub_tag_id_list)
            sub_tag_id_list.forEach((tag_id, index) =>{
              if (tag_id){
                // this.tag_loading_start++
                this.get_tag_object(tag_id, comment_id, dataset_id)
              }
            })
          }
          else this.$message.error('comment acquiring error');
        }).catch(error => {
          callback()
          console.log(error)
        });
      },

      // beforeRouteLeave(to, from, next) {
      //   if (!this.issave){
      //     if (confirm(lantext.sentences.exit_work[this.$store.state.lanType]) ) {
      //       this.$store.state.workstatus = false;
      //       next()
      //     }
      //   }
      //   else next()
      // }
    }

  }
</script>

<style scoped>
</style>
