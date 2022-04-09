<template>
  <v-app>
    <!--search tab && table-->
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
        <v-col cols="3" v-show="$store.state.user_level===0" >
          <v-btn text @click="overlay_show.get_dataset = true">
            <v-icon>mdi-file-download-outline</v-icon>
            {{lantext.sentences.get_dataset[$store.state.lanType]}}
          </v-btn>
        </v-col>

      </v-row>


      <v-row>
        <v-col>
          <v-text-field
            v-model="listSrchString"
            append-icon="mdi-magnify"
            :label="lantext.words.search[$store.state.lanType]">
          </v-text-field>

          <v-simple-table
            v-if="isListAlive">
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">Id</th>
                <th class="text-left">FileName</th>
                <th class="text-left">Tagged</th>
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
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid v-show="$store.state.workStatus" class="pa-0">
      <markplace
        v-if="$store.state.user_level===0 && $store.state.workStatus"
        :enable="$store.state.workStatus">
      </markplace>
      <viewplace
        v-if="$store.state.user_level===1 && $store.state.workStatus"
        :enable="$store.state.workStatus">
      </viewplace>
    </v-container>

    <v-container fluid>

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

    <v-overlay v-show="overlay_show.upload_dataset" color="#eeeeee">
      <v-card  width="700" height="350" light>
        <div>
          <v-btn @click="overlay_show.upload_dataset = false" text absolute right>
            <span class="mdi mdi-close" ></span>
          </v-btn>
        </div>
        <upfile></upfile>
      </v-card>
    </v-overlay>

    <v-overlay v-show="overlay_show.get_dataset" color="#eeeeee">
      <v-card  width="700" height="500" light>
        <div>
          <v-btn @click="overlay_show.get_dataset = false" text absolute right>
            <span class="mdi mdi-close" ></span>
          </v-btn>
        </div>
        <all-dataset-table></all-dataset-table>
      </v-card>
    </v-overlay>

  </v-app>
</template>

<script>

  import lantext from "../lib/lantext";
  import Markplace from "./markplace";
  import Viewplace from "./viewplace";
  import GetFile from "./getFile";
  import upfile from "./upfile";
  import allDatasetTable from "./allDatasetTable";
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
        overlay_show:{
          dataset_share:false,
          upload_dataset:false,
          get_dataset:false,
        },
        temp_username:"",
        temp_dataSetId: "",

        work_ready:false,
        comment_loading_start:0,
        comment_loading_end:0,
      }),
      created() {
        this.$store.state.list.dataset_id_list = []
        this.$store.state.list.comment_id_list = []
        this.$store.state.list.tag_id_list = []
        this.$store.state.map.dataset_map = new Map()
        this.$store.state.map.dataset_comment_map = new Map()
        this.$store.state.map.comment_map = new Map()
        this.$store.state.map.comment_tag_map = new Map()
        this.$store.state.map.tag_map = new Map()
      },
      mounted() {
          this.refreshCommentList()
      },
      methods:{
        choose_dataset(dataset_id){
          this.$store.state.chosen_dataset_id = dataset_id
          this.$store.state.workStatus = true
        },

        share_dataset(dataset_id){
          this.$store.state.to_share_dataset_id = dataset_id
          this.overlay_show.dataset_share =true
        },

        refreshCommentList(){
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

        get_loading(){
          this.comment_loading_end++;
          if (this.comment_loading_end === this.comment_loading_start){
            this.refresh_dataset_table()
            this.work_ready = true
          }
        },

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
                  name:response.data.name
                })
                // this.refresh_dataset_table()
                var sub_comment_id_list = [...new Set(response.data.comment_id_list)]
                this.$store.state.map.dataset_comment_map.set(dataset_id, sub_comment_id_list)
                this.$store.state.list.comment_id_list = this.$store.state.list.comment_id_list.concat(sub_comment_id_list)
                sub_comment_id_list.forEach(comment_id =>{
                  this.comment_loading_start++;
                  this.get_comment_object(this.get_loading, comment_id, dataset_id)
                })
              }
              else console.log(String(dataset_id)+"号数据集 Id. 数据对象")
            }).catch(error => console.log(error))
        },

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
              this.$store.state.list.tag_id_list = this.$store.state.list.tag_id_list.concat(sub_tag_id_list)
              sub_tag_id_list.forEach(tag_id =>{
                this.get_tag_object(tag_id, comment_id, dataset_id)
              })
            }
            else this.$message.error('comment acquiring error');
          }).catch(error => {
            callback()
            console.log(error)
          });
        },

        get_tag_object(tag_id, comment_id, dataset_id) {
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

        get_tagged_num(pre, comment_id){
          if (!this.$store.state.map.comment_tag_map.has(comment_id)) return 0
          return pre + ((this.$store.state.map.comment_map.get(comment_id).tag_id_list.length > 0) ? 1 : 0)
        },

        refresh_dataset_table(){
          this.isListAlive = false
          this.$nextTick(()=>{
            this.isListAlive = true
          })
        },

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
        }

      }

    }
</script>

<style scoped>

</style>
