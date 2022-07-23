<template>
  <v-app>
<!--    commentlist部分-->
    <v-container fluid v-show="!$store.state.workStatus">
      <v-row align="baseline">
        <v-col cols="3">
          <v-btn text @click="refreshCommentList">
              <v-icon>mdi-refresh</v-icon>
              {{lantext.sentences.reload_data[$store.state.lanType]}}
          </v-btn>
        </v-col>
        <v-col cols="3" v-show="$store.state.user_level===0" >
          <v-btn text @click="overlay_show.upload_dataset = true">
            <v-icon>mdi-file-upload-outline</v-icon>
            {{lantext.sentences.upload_dataset[$store.state.lanType]}}
          </v-btn>
        </v-col>
        <v-col cols="3">
          <v-btn text @click="overlay_show.get_dataset = true">
            <v-icon>mdi-file-download-outline</v-icon>
            {{lantext.sentences.get_dataset[$store.state.lanType]}}
          </v-btn>
        </v-col>

        <v-col cols="3">
          <v-btn text @click="overlay_show.upload_tag_category = true">
            <v-icon>mdi-file-download-outline</v-icon>
            {{lantext.sentences.upload_tag_category[$store.state.lanType]}}
          </v-btn>
        </v-col>

      </v-row>


      <!--            数据集表-->
      <v-container fluid>
        <v-card-title>
          <v-main>{{lantext.words.dataset_list[$store.state.lanType]}}</v-main>
          <!--          搜索栏-->
          <v-text-field
            v-model="listSrchString"
            append-icon="mdi-magnify"
            :label="lantext.words.search[$store.state.lanType]">
          </v-text-field>
        </v-card-title>

<!--            数据集表-->
          <v-simple-table
            :height="200"
            v-if="isListAlive">
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">{{lantext.words.datasetID[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.file_name[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.tag_category[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.tagged[$store.state.lanType]}}</th>
                <th class="text-left"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in $store.state.list.dataset_id_list" :key="item">
<!--                Id-->
                <td>{{ item }}</td>
<!--                FileName-->
                <td>{{ $store.state.map.dataset_map.has(item) ?
                  　$store.state.map.dataset_map.get(item).name : '' }}</td>
                <!--                Category-->
                <td>{{ $store.state.map.dataset_map.has(item) ?
                  　$store.state.map.dataset_map.get(item).category_name : '' }}</td>
<!--                Tagged-->
                <td>
                  {{$store.state.map.dataset_comment_map.has(item)
                  ? $store.state.map.dataset_comment_map.get(item).reduce(get_tagged_num, 0)
                  : '--'}}
                  /{{$store.state.map.dataset_comment_map.has(item)
                  ? $store.state.map.dataset_comment_map.get(item).length
                  : '--'}}
                </td>
<!--                buttons-->
                <td>
                  <div style="justify-content: space-around">
                    <v-btn color="blue" dark
                           @click="choose_dataset(item)"
                          :disabled="!work_ready">
                      {{lantext.words[$store.state.user_level===0?"mark":"view"][$store.state.lanType]}}
                    </v-btn>
                    <v-btn color="orange" dark
                           v-show="$store.state.user_level===0"
                           @click="share_dataset(item)"
                           :disabled="!work_ready">
                      {{lantext.words.share[$store.state.lanType]}}
                    </v-btn>
                  </div>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
      </v-container>


<!--      标签集合表-->

      <v-container fluid>
        <v-card-title>
          <v-main>{{lantext.words.tag_category_list[$store.state.lanType]}}</v-main>
          <!--          搜索栏-->
          <v-text-field
            v-model="listSrchString"
            append-icon="mdi-magnify"
            :label="lantext.words.search[$store.state.lanType]">
          </v-text-field>
        </v-card-title>

        <!--            标签集合表-->
        <v-simple-table
          :height="200"
          v-if="isListAlive">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">Category Name</th>
<!--              <th class="text-left">Datasets Using Category</th>-->
              <th class="text-left"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in $store.state.list.tag_category_name_list" :key="item">
              <!--                Category Name-->
              <td>{{ item }}</td>
              <!--                Datasets Using Category-->
<!--              <td>{{ }}</td>-->
              <!--                buttons-->
              <td>
                <div style="justify-content: space-around">
                  <v-btn color="blue" text
                         @click="inspect_tag_category(item)">
                    {{lantext.words.look[$store.state.lanType]}}
                  </v-btn>
                </div>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
    </v-container>


<!--    标注/审阅界面-->
    <v-container fluid v-show="$store.state.workStatus" class="pa-0">
      <markplace v-if="$store.state.user_level===0 && $store.state.workStatus"/>
      <viewplace v-if="$store.state.user_level===1 && $store.state.workStatus"/>
    </v-container>


    <!--分享数据集-->
    <v-overlay v-show="overlay_show.dataset_share" color="#eeeeee">
      <v-card  width="700" height="350" light>
        <div>
          <v-btn @click="overlay_show.dataset_share = false" text absolute right>
            <span class="mdi mdi-close" ></span>
          </v-btn>
        </div>

        <v-card-title >{{lantext.words.share[$store.state.lanType]
          +" "+lantext.words.dataset[$store.state.lanType]}}</v-card-title>
        <v-divider ></v-divider>
        <v-text-field :label="lantext.words.share[$store.state.lanType]
        +' '+lantext.words.username[$store.state.lanType]"
                      v-model="temp_username"></v-text-field>
        <v-text-field :label="lantext.words.dataset[$store.state.lanType]+' ID'" v-model="temp_dataSetId"></v-text-field>
        <v-card-actions>
          <v-btn @click="relateDataSet">{{lantext.words.share[$store.state.lanType]}}</v-btn>
        </v-card-actions>

      </v-card>
    </v-overlay>

<!--    上传数据集-->
    <v-overlay v-show="overlay_show.upload_dataset" color="#eeeeee">
      <v-card  width="700" height="500" light
               class="overflow-y-auto overflow-x-hidden">
        <div>
          <v-btn @click="overlay_show.upload_dataset = false" text absolute right>
            <span class="mdi mdi-close" ></span>
          </v-btn>
        </div>
        <upfile></upfile>
      </v-card>
    </v-overlay>

<!--    获取数据集-->
    <v-overlay v-show="overlay_show.get_dataset" color="#eeeeee">
      <v-card  width="700" height="500" light>
        <div>
          <v-btn @click="overlay_show.get_dataset = false" text absolute right>
            <span class="mdi mdi-close"></span>
          </v-btn>
        </div>
        <all-dataset-table></all-dataset-table>
      </v-card>
    </v-overlay>

<!--上传标注列表-->
    <v-overlay v-show="overlay_show.upload_tag_category" color="#eeeeee">
      <v-card  width="700" height="500" light
               class="overflow-y-auto overflow-x-hidden">
        <div>
          <v-btn @click="overlay_show.upload_tag_category = false" text absolute right>
            <span class="mdi mdi-close"></span>
          </v-btn>
        </div>
        <v-card-title>{{lantext.sentences.upload_tag_category[$store.state.lanType]}}</v-card-title>
        <v-divider></v-divider>

        <v-divider></v-divider>
        <v-row class="ma-2">
          <v-col> <v-file-input type="file" v-model="tag_category"></v-file-input> </v-col>
          <v-col> <v-text-field label="Category Name" v-model="tag_category_name"></v-text-field> </v-col>
          <v-col>
            <v-btn @click="upload_tag_category()" outlined color="primary" :disabled="!tag_category">
              {{lantext.words.upload[$store.state.lanType]}}
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-overlay>

<!--        标签集合详情-->
    <v-overlay v-if="overlay_show.tag_category_info" color="#111111" light
      class="pa-4">

      <v-card width="800" height="500" color="transparent" flat>
        <v-btn @click="overlay_show.tag_category_info = false"
               dark text absolute right>
          <span class="mdi mdi-close"></span>
        </v-btn>

        <v-card  width="700" height="500" light
                 class="overflow-y-auto overflow-x-hidden">
<!--            退出按钮-->

<!--            标签集合的所有组，每个组的所有标签-->
<!--            每个组用一个段落来表示-->
          <v-card-text
            v-for="(group, index) in chosen_tag_category.object.group"
            :key="group + String(index)">
<!--              组的名称-->
            <v-main class="ma-1 text-h5">Group Name: {{group.name||'--'}}</v-main>
<!--              根据组内的数组指定tags数组中对应的tag-->
<!--              item.list是tags数组中tag的id列表-->
            <v-card
              v-for="(tag_id,index) in group.list"
              :key="tag_id + String(index)" >
              <v-main class="ma-1 text-h6">Tag Name:
                {{chosen_tag_category.object.tags[tag_id].reference[$store.state.lanType===0?'en':'ch'] || '--'}}
              </v-main>
              <!--                    渲染html片段-->
              <v-container v-html="chosen_tag_category.object.tags[tag_id].description[
              $store.state.lanType===0?'en':'ch']"
                class="overflow-y-auto overflow-x-hidden">
              </v-container>
            </v-card>
          </v-card-text>
        </v-card>
      </v-card>
    </v-overlay>

    <!--开始标注前选择标注集合-->
    <v-overlay v-show="overlay_show.choose_tag_category" color="#eeeeee">
      <v-card  width="700" height="500" light
               class="overflow-y-auto overflow-x-hidden">
        <div>
          <v-btn @click="overlay_show.choose_tag_category = false" text absolute right>
            <span class="mdi mdi-close"></span>
          </v-btn>
        </div>
        <v-card-title>{{lantext.sentences.choose_tag_category[$store.state.lanType]}}</v-card-title>
        <v-divider></v-divider>
        <v-container>

        <v-main>{{lantext.sentences.current_tag_category[$store.state.lanType]}} :
        {{$store.state.chosen_tag_category?$store.state.chosen_tag_category.object.name:'--'}}</v-main>
        <v-simple-table
          :height="150"
          v-if="isListAlive">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">Category Name</th>
              <th class="text-left">Datasets Using Category</th>
              <th class="text-left"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in $store.state.list.tag_category_name_list" :key="item">
              <!--                Category Name-->
              <td>{{ item }}</td>
              <!--                Datasets Using Category-->
              <td>{{ }}</td>
              <!--                buttons-->
              <td>
                <div style="justify-content: space-around">
                  <v-btn color="blue" text
                         @click="choose_tag_category(item)">
                    {{lantext.words.choose[$store.state.lanType]}}
                  </v-btn>
                </div>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>

        </v-container>

        <v-row>
          <v-spacer></v-spacer>
          <v-btn color="green" @click="go_to_tag()" light>{{lantext.sentences.ready_to_tag[$store.state.lanType]}}</v-btn>
          <v-spacer></v-spacer>
        </v-row>
      </v-card>
    </v-overlay>

  </v-app>
</template>

<script>
  /**
   * 将tag_category的信息和数据集、标注者绑定，以tag的形式保存在【对应】的数据集中
   */
  import lantext from "../lib/lantext";
  import Markplace from "./markplace";
  import Viewplace from "./viewplace";
  import GetFile from "./getFile";
  import upfile from "./upfile";
  import allDatasetTable from "./allDatasetTable";
  import defaultTagCategory from '../lib/defaultTagCategory'
    export default {
        name: "commentlist",
      props:{
        enable:{
          type: Boolean,
          required:true
        }
      },
      components: {Viewplace, Markplace, GetFile, upfile , allDatasetTable},
      data:()=>({
        lantext:lantext,
        listSrchString:'',
        dataSetPtr:-1,
        isListAlive:true,
        defaultTagCategory,


        overlay_show:{
          dataset_share:false,
          upload_dataset:false,
          get_dataset:false,
          upload_tag_category: false,
          tag_category_info:false,
          choose_tag_category:false,
        },
        temp_username:"",
        temp_dataSetId: "",

        work_ready:false,
        comment_loading_start:0,
        comment_loading_end:0,
        tag_loading_start:0,
        tag_loading_end:0,

        // chosen_tag_category_name:"",
        chosen_tag_category:null,
        tag_category:null,
        tag_category_name:"",
      }),
      watch:{
        tag_category:{
          handler(value){
            console.log(value)
            if (value){
              this.tag_category_name = value.name.substring(0,value.name.length-5);
            }
          },
          immediate:true
        }
      },
      created() {
          console.log('created')


        // this.get_dataset_id_list()
      },
      mounted() {
          console.log('mounted')
        //默认的tag category
        if (!this.$store.state.map.tag_category_map.has('ISO 25010'))
          this.process_raw_tag_category_object(this.defaultTagCategory)
      },
      methods:{
          //选择tag_category准备进行标注：在用户选好用于标记某个数据集的tag category后，确定该选择，并进入标记界面
        go_to_tag(){
          this.overlay_show.choose_tag_category = false
          this.$store.state.current_tag_category_saved = false
          this.$store.state.workStatus = true
        },

        //选择tag_category准备进行标注：选择一个tag category准备进行标注
        choose_tag_category(category_name){
          this.$store.state.chosen_tag_category = this.$store.state.map.tag_category_map.get(category_name)
        },

        //在tag_category列表中选择某个tag category进行查看
        inspect_tag_category(category_name){
          // this.chosen_tag_category_name = category_name
          this.chosen_tag_category = this.$store.state.map.tag_category_map.get(category_name)
          this.overlay_show.tag_category_info = true
        },

        //用对象的方式存入tag_category
        process_raw_tag_category_object(raw_object){
          let raw_category_object = raw_object
          let category_object = {}

          category_object.name = raw_category_object.name
          category_object.group = raw_category_object.group
          category_object.tags = []

          let category_tag_value_set = new Set()//针对这个tag_category本身的值，检查是否重复
          let work_flag = true//是否出现错误

          try {
            raw_category_object.tags.forEach(tag => {
              //对每个tag的value，检查是否和其他value重复
              if (this.$store.state.set.tag_category_value_set.has(tag.value)) {
                console.log("the tag category contains value that is duplicated with" +
                  " tags on the server! category upload abort!", 3000)
                work_flag = false
                throw "err"
              } else if (category_tag_value_set.has(tag.value)) {
                console.log("the tag category contains value that is " +
                  "duplicated with itself! category upload abort!", 3000)
                work_flag = false
                throw "err"
              } else category_tag_value_set.add(tag.value)

              let desc_en = tag.description.en.reduce((preVal, curVal) => preVal + curVal, "")
              let desc_ch = tag.description.ch.reduce((preVal, curVal) => preVal + curVal, "")
              category_object.tags.push({
                "value": tag.value,
                "reference": tag.reference,
                "description": {
                  "en": desc_en,
                  "ch": desc_ch
                }
              })
            })
          }
          catch (e) {console.log(e)}
          //检查无误后，将该读取完成的tag_category写入当前的本地变量中，同时将该tag_category中所有的标签都加入防重复的Set
          this.$store.state.set.tag_category_value_set =
            new Set([...this.$store.state.set.tag_category_value_set, ...category_tag_value_set])
          this.$store.state.list.tag_category_name_list.push(category_object.name)
          this.$store.state.map.tag_category_map.set(category_object.name, {
            content:'', complete:true, object:category_object
          })
          console.log('tag category push over')
        },

        //用对象的方式存入tag_category,if_alert表示完成后是否显式通知
        process_raw_tag_category_text(raw_text, if_alert){
          // console.log(e.target.result)
          // console.log('tag category file',this.tag_category)
          let raw_category_json = JSON.parse(raw_text)

          var category_object = {}
          category_object.name = raw_category_json.name
          category_object.group = raw_category_json.group
          category_object.tags = []

          let category_tag_value_set = new Set()//针对这个tag_category本身的值，检查是否重复
          let work_flag = true//是否出现错误
          try{
            raw_category_json.tags.forEach(tag=>{
              //对每个tag的value，检查是否和其他value重复
              if (this.$store.state.set.tag_category_value_set.has(tag.value)){
                if (if_alert){
                  this.$message.error("the tag category contains value that is duplicated with" +
                    " tags on the server! category upload abort!", 3000)
                }
                else {
                  console.log("the tag category contains value that is duplicated with" +
                    " tags on the server! category upload abort!", 3000)
                }
                work_flag = false
                throw "err"
              }
              else if (category_tag_value_set.has(tag.value)) {
                if (if_alert) {
                  this.$message.error("the tag category contains value that is " +
                    "duplicated with itself! category upload abort!", 3000)
                }
                else{
                  console.log("the tag category contains value that is " +
                    "duplicated with itself! category upload abort!", 3000)
                }
                work_flag = false
                throw "err"
              }
              else {
                category_tag_value_set.add(tag.value)
              }

              let desc_en = tag.description.en.reduce((preVal, curVal)=>preVal+curVal, "")
              let desc_ch = tag.description.ch.reduce((preVal, curVal)=>preVal+curVal, "")
              category_object.tags.push({
                "value":tag.value,
                "reference":tag.reference,
                "description":{
                  "en":desc_en,
                  "ch":desc_ch
                }
              })
            })
          }
          catch (e) {
            console.log(e)
            this.$message.error(this.lantext.sentences.tag_category_upload_error[this.$store.state.lanType])
          }

          if (!work_flag) return
          //检查无误后，将该读取完成的tag_category写入当前的本地变量中，同时将该tag_category中所有的标签都加入防重复的Set
          this.$store.state.set.tag_category_value_set =
            new Set([...this.$store.state.set.tag_category_value_set, ...category_tag_value_set])
          this.$store.state.list.tag_category_name_list.push(category_object.name)
          this.$store.state.map.tag_category_map.set(category_object.name, {
            content:'',  complete:true, object:category_object
          })

          if (if_alert) this.$message.success("tag category upload succeed!")
          else console.log("tag category upload succeed! tag category name:",category_object.name)
          console.log('tag category push over')
          // console.log('tag category object', this.tag_category)
        },

        //用于上传用户自定义的tag category
        upload_tag_category(){
          console.log(this.tag_category, this.tag_category_name)
          //tag_category_name作为tag_category存储在Map中的key
          //故首先检查是否有重名的tag_category
          if (this.$store.state.map.tag_category_map.has(this.tag_category_name)){
            this.$message.error("the tag category's name has already been occupied! Please change the name and retry!")
            return
          }

          let reader = new FileReader()
          let file = this.tag_category
          //这里的file，必须通过json格式校验
          reader.readAsText(file)

          //开始上传改tag category
          reader.onload = ((e) => {
            // console.log(e.target.result)
            // console.log('tag category file',this.tag_category)
            this.process_raw_tag_category_text(e.target.result, true)
          })
        },

        //选择某个数据集进行标注，打开选择tag category的界面
        choose_dataset(dataset_id){
          if (this.$store.state.user_level === 0){
            this.$store.state.chosen_dataset_id = dataset_id
            this.overlay_show.choose_tag_category = true
          }
          else {
            this.$store.state.list.chosen_dataset_tag_id_list = []
            this.$store.state.map.tag_map.forEach((value, key)=>{
              if (value.dataset_id === dataset_id && !value.hasOwnProperty('category_name'))
                this.$store.state.list.chosen_dataset_tag_id_list.push(key)
            })
            let category_name = this.$store.state.map.dataset_map.get(dataset_id).category_name
            if (category_name){
              this.$store.state.chosen_tag_category = this.$store.state.map.tag_category_map.get(category_name)
              console.log(category_name, this.$store.state.chosen_tag_category)
            }
            this.$store.state.workStatus = true
          }

        },

        //分享某个数据集，打开界面
        share_dataset(dataset_id){
          this.temp_dataSetId = dataset_id
          this.overlay_show.dataset_share =true
        },

        //重新刷新所有界面
        refreshCommentList(){
          console.log('refresh')
          this.$store.state.list.dataset_id_list = []
          this.$store.state.list.comment_id_list = []
          this.$store.state.list.tag_id_list = []
          this.$store.state.map.dataset_map = new Map()
          this.$store.state.map.dataset_comment_map = new Map()
          this.$store.state.map.comment_map = new Map()
          this.$store.state.map.comment_tag_map = new Map()
          this.$store.state.map.tag_map = new Map()
          this.work_ready = false
          this.get_dataset_id_list()
        },

        /**
         * 获取过程中list不是强制性完整的，允许报错等，层级获取
         */
        get_dataset_id_list(){
          this.axios.get('/commentsList/', {
              params: {
                  username:this.$store.state.currentuser
              }
            }).then(response =>{
              console.log(response)
              if (response.data.Details) {
                console.log(response.data.Details)
                this.$store.state.list.dataset_id_list = [...new Set(response.data.Details.comment_list_id)]
                this.$store.state.list.dataset_id_list.forEach(dataset_id=>{
                  this.get_dataset_object(dataset_id)
                })
              }
              else this.$message.error('datasets acquiring error');
            }).catch(error =>console.log(error))
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
          }).catch(error => console.log(error))
        },

        get_tag(){
          this.tag_loading_end++;
          console.log(this.tag_loading_start,this.tag_loading_end)
          if (this.tag_loading_end === this.tag_loading_start){
            // this.refresh_dataset_table()
            // this.get_tag_categories()
            this.work_ready = true
          }
        },

        //得到一个comment对象的回调函数
        get_comment(){
          this.comment_loading_end++;
          if (this.comment_loading_end === this.comment_loading_start){
            this.refresh_dataset_table()
            // this.work_ready = true
          }
        },

        //获取数据集对象
        get_dataset_object(dataset_id){
          /**
           * dataset object
           * {
           *   comment_id_list:[]
           *   name:String
           * }
           */
          this.axios.get('/commentsList/', {
              params: {
                list_id: dataset_id
              }
            }).then(response => {
              // console.log(response)
              if (response.data){
                this.$store.state.map.dataset_map.set(dataset_id, {
                  name:response.data.name,
                  category_name:null, //所使用的tag category
                  kappa:null, //每个数据集kappa值
                })
                // this.refresh_dataset_table()
                var sub_comment_id_list = [...new Set(response.data.comment_id_list)]
                this.$store.state.map.dataset_comment_map.set(dataset_id, sub_comment_id_list)
                this.$store.state.list.comment_id_list = this.$store.state.list.comment_id_list.concat(sub_comment_id_list)
                sub_comment_id_list.forEach(comment_id =>{
                  this.comment_loading_start++;
                  this.get_comment_object(this.get_comment, comment_id, dataset_id)
                })
              }
              else console.log(String(dataset_id)+"号数据集 Id. 数据对象")
            }).catch(error => console.log(error))
        },

        //获取comment对象
        get_comment_object(callback, comment_id, dataset_id){
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
            // console.log(response)
            if (response.data.Details) {
              var comment_object = response.data.Details
              comment_object["dataset_id"] = dataset_id
              comment_object["comment_id"] = comment_id
              this.$store.state.map.comment_map.set(comment_id, comment_object)
              var sub_tag_id_list = [...new Set(comment_object.tag_id_list.split(','))]
              this.$store.state.map.comment_tag_map.set(comment_id, sub_tag_id_list)
              callback()
              // this.refresh_dataset_table()
              this.$store.state.list.tag_id_list = [...new Set(this.$store.state.list.tag_id_list.concat(sub_tag_id_list))]
              console.log(comment_id, sub_tag_id_list)
              sub_tag_id_list.forEach((tag_id, index) =>{
                if (tag_id){
                  this.tag_loading_start++
                  this.get_tag_object(this.get_tag, tag_id, comment_id, dataset_id, index)
                }
              })
            }
            else this.$message.error('comment acquiring error');
          }).catch(error => {
            callback()
            console.log(error)
          });
        },

        isNumber(obj){
          var num_obj = Number(obj)
          return !isNaN(num_obj)
        },

        //得到tag对象
        get_tag_object(callback, tag_id, comment_id, dataset_id, index) {

          if (!this.isNumber(tag_id)) {
            callback()
            return
          }
          /**
           * tag object
           * tag_id = models.AutoField(primary_key=True)
           * remarks = models.CharField(max_length=500,default="",verbose_name=u'备注信息')
           *  => tag_value
           *  => rationale
           * tag_user_info = models.CharField(max_length=32,verbose_name=u'标注者信息')
           * confidence = models.IntegerField(default=0,verbose_name=u'置信度')
           *
           * tag_category:{
           *   name:<String>
           *   groups:<Array>
           *   tags:<Array>
           *
           * }
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
                console.log('all tags', t1)
                //有两种情况：（1）正常标注tag（2）tag_category tag
                //正常tag
                if (t1.tag_value) {
                    tag_object["tag_value"] = t1.tag_value;
                    tag_object["rationale"] = t1.rationale;
                }
                else {
                  //tag categorg map
                  /**
                   * key : <Name>
                   * value:{
                   *   complete : <Bool>
                   *     slices:<Array>
                   *   object: <Object>
                   * }
                   *
                   * tag category
                   * {
                   *   category_name
                   *   total
                   *   no
                   *   str_slice
                   * }
                   */
                  //之前有
                  let current_category, content
                  if (t1.category_name){
                    tag_object["category_name"] = t1.category_name
                    console.log('tag category', t1.category_name)
                    //更新对应数据集所使用的tag category

                    var current_dataset = this.$store.state.map.dataset_map.get(dataset_id)
                    current_dataset.category_name = t1.category_name
                    this.$store.state.map.dataset_map.set(dataset_id, current_dataset)

                    if (this.$store.state.map.tag_category_map.has(t1.category_name)){
                      current_category = this.$store.state.map.tag_category_map.get(t1.category_name)
                      //这个tag category没有完成，继续拼接
                      if (!current_category.complete) {
                        current_category.slices[t1.no] = t1.str_slice

                        //检查是否完成 0 -> total-1
                        var has_slices = current_category.slices.
                          reduce((pre, cur)=>(cur && cur.length > 0) ? pre+1 : pre, 0)
                        if (has_slices === t1.total) current_category.complete = true

                        if (current_category.complete) {
                          content = current_category.slices.reduce((pre, cur)=>pre+cur, "")
                          current_category["object"] = JSON.parse(content)
                          this.$store.state.list.tag_category_name_list =
                            [... new Set(this.$store.state.list.tag_category_name_list.concat([t1.category_name]))]
                          current_category.object.tags.forEach(tag=>{
                            this.$store.state.set.tag_category_value_set.add(tag.value)
                          })
                        }

                        this.$store.state.map.tag_category_map.set(t1.category_name, current_category)
                      }
                    }
                    else {
                      //第一部分


                      current_category = {
                        slices:new Array(t1.total),
                        complete: t1.total===1,
                        object: null
                      }
                      current_category.slices[t1.no] = t1.str_slice
                      if (current_category.complete) {
                        content = current_category.slices.reduce((pre, cur)=>pre+cur, "")
                        current_category["object"] = JSON.parse(content)
                        this.$store.state.list.tag_category_name_list =
                          [... new Set(this.$store.state.list.tag_category_name_list.concat([t1.category_name]))]
                        current_category.object.tags.forEach(tag=>{
                          this.$store.state.set.tag_category_value_set.add(tag.value)
                        })
                      }
                      this.$store.state.map.tag_category_map.set(t1.category_name, current_category)
                    }
                  }
                }
              }
              catch (e) {
                console.log(e)
              }
              finally {
                callback()
                this.$store.state.map.tag_map.set(tag_id, tag_object)
              }
            } else this.$message.error('tag acquiring error');

          }).catch(error => console.log(error))
        },

        get_tagged_num(pre, comment_id){
          if (!this.$store.state.map.comment_tag_map.has(comment_id)) return 0
          return pre + ((this.$store.state.map.comment_map.get(comment_id).tag_id_list.length > 0) ? 1 : 0)
        },

        //找到每个dataset的第一个comment的tag_id_list，依次检查
        //目前的缺陷是：若第一个comment没有被标记时，标记数也相差1
        find_tag_category(dataset_id){

        },


        refresh_dataset_table(){
          this.isListAlive = false
          this.$nextTick(()=>{
            this.isListAlive = true
          })

        },

        //分享数据集：将某个数据集与某一位用户（手动输入，绑定为temp_username）相关联
        relateDataSet(){
          let formData1 = new FormData();
          formData1.append('username',this.temp_username);
          formData1.append('list_id',String(this.temp_dataSetId));

          console.log('sent');
          this.axios.put('/commentsList/', {
            username:this.temp_username, list_id:this.temp_dataSetId
          })
            .then(response =>{
            console.log(response);
            if (response.data.msg ==="ok"){
              this.$message.success("ok");
            }
            else this.$message.error("wrong");
          }).catch(error => console.log(error));
        },


        get_custom_tag_categories(){
          this.axios.get('/adminview/',
            {params:{username:this.$store.state.currentuser}
            }).then(response =>{
            // console.log(response)
            if (response.data.details) {
              response.data.details.comment_id_list.forEach(item => {
                let new_item = item.replace(/'/g, "\""); //将对象中的单引号转为双引号，确保JSON合法
                new_item = JSON.parse(new_item); //得到JSON对象
                this.$store.state.list.all_dataset_id_list =
                  [...new Set(this.$store.state.list.all_dataset_id_list.concat([new_item.commentList_id_list]))]
                //     this.dataTree.push({
                //       dataSetId : new_item.commentList_id_list,
                //       fileName : new_item.name,
                //       uploadUserName : new_item.username,
                //     });
                //   }
                // });
              })
            }
          }).catch(error =>console.log(error))
        }
      }

    }
</script>

<style scoped>

</style>
