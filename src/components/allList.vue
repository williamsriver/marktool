<template>
  <v-app>
    <v-container fluid v-show="!work_status">
      <v-row>
        <v-col>
          <v-btn text @click="getAllList">
            <v-icon>mdi-refresh</v-icon>
            {{lantext.sentences.reload_data[$store.state.lanType]}}
          </v-btn>
        </v-col>
        <v-col>
          <v-text-field v-model="listSrchString" append-icon="mdi-magnify"
                        :label="lantext.words.search[$store.state.lanType]"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-data-table
            :headers="lantext.headers.ItemListHeader[$store.state.lanType]"
            :items="$store.state.dataTree"
            :search="listSrchString"
            v-if="isListAlive"
            hide-default-footer>
            <template v-slot:item.buttons="{item}">
              <v-btn :disabled="false" text @click="commentLoad(item)">
                <span class="mdi mdi-pen-plus"></span>
                {{lantext.words.look[$store.state.lanType]}}
              </v-btn>
            </template>

          </v-data-table>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid v-show="work_status">
      <v-row>

        <v-col cols="2" v-show="work_status">
          <v-btn text @click="backToCommentList()">
            <v-icon>mdi-arrow-left</v-icon>
            <v-main>{{lantext.words.back[$store.state.lanType]}}</v-main>
          </v-btn>
        </v-col>
      </v-row>
      <markplace v-if="work_status" @goBack="backToCommentList()" :look-mode="true"
                 :data-set-index="dataSetPtr" :loadFinish="$store.state.startLoading===$store.state.endLoading" :enable="$store.state.startLoading===$store.state.endLoading" ></markplace>
    </v-container>
  </v-app>
</template>

<script>
    import Markplace from "./markplace";

    export default {
        name: "allList",
      props:{
          enable:{
            type:Boolean,
            required:true
          }
      },
      components: {Markplace},
      data:()=>({
        work_status:false,
        listSrchString:"",
        totalList:[],
        isListAlive:true,
        dataSetPtr:-1,
      }),
      watch:{
        enable:{
          handler(value){
            console.log(value);
            if (value) this.getAllList();
          },
          immediate:true
        }
      },
      methods:{
          commentLoad(item){
            this.dataSetPtr = item.dataSetIndex;
            this.work_status = true
            this.getCommentByCommentIdList(this.$store.state.dataTree[this.dataSetPtr].commentList);
          },

        backToCommentList(){
          this.work_status = false;
        },

        getAllList(){
          this.$store.state.dataTree = [];
          this.$store.state.dataSetIdList = [];
          this.axios.get('http://tonycoder.ziqiang.net.cn:8080/adminview/')
            .then(response =>{
              console.log(response.data.details.comment_id_list);
              if (response.data.details) {
                response.data.details.comment_id_list.forEach(id => {
                  if (this.$store.state.dataSetIdList.indexOf(id) === -1) {
                    this.$store.state.dataSetIdList.push(id);
                    this.$store.state.dataTree.push({
                      dataSetId : id,
                      dataSetIndex : this.$store.state.dataTree.length,
                      commentList: {},
                    });
                  }
                });
                this.$store.state.tagsList = new Array(this.$store.state.dataTree.length);
                this.$store.state.commentTagValueList = new Array(this.$store.state.dataTree.length);
                this.$store.state.dataTree.forEach(dataset => this.getCommentIdListByDataSet(dataset));
              }
              else this.$message.error('datasets acquiring error');

            })
            .catch(error =>console.log(error))
        },

        getCommentIdListByDataSet(dataset){
          this.axios.get('http://tonycoder.ziqiang.net.cn:8080/commentsList/',{params:{list_id:dataset.dataSetId} })
            .then(response => {
              if (response.data.comment_id_list) {
                this.$store.state.dataTree[dataset.dataSetIndex].commentList = {
                  dataSetIndex : dataset.dataSetIndex,
                  commentIdList: response.data.comment_id_list,
                  comments :[],
                }

              }
              else this.$message.error('comments id list acquiring error');
            })
            .catch(error => console.log(error))
        },

        getCommentByCommentIdList(commentList){
          this.$store.state.commentTagValueList[commentList.dataSetIndex] = [];
          commentList.commentIdList.forEach((id) =>{
            this.$store.state.startLoading++;
            this.axios.get('http://tonycoder.ziqiang.net.cn:8080/comments/', {params: {comment_id: id} } )
              .then(response => {
                if (response.data.Details){
                  let temp = response.data.Details;
                  temp["comment_id"] = id;
                  temp["dataSetIndex"] = commentList.dataSetIndex;
                  temp["commentIndex"] = this.$store.state.dataTree[commentList.dataSetIndex].commentList.comments.length;
                  temp["totalCommentIndex"] = this.$store.state.commentTagValueList[commentList.dataSetIndex].length;
                  temp["tagValueList"] = [];
                  temp["tagList"] = {
                    comment_id : id,
                    dataSetIndex : commentList.dataSetIndex,
                    commentIndex : this.$store.state.dataTree[commentList.dataSetIndex].commentList.comments.length,
                    totalCommentIndex : temp.totalCommentIndex,
                    tagIdList : [],
                    tags : [],
                  };
                  let temp_tagIdList = response.data.Details.tag_id_list.split(',');
                  temp_tagIdList.forEach(item => {if (item) temp.tagList.tagIdList.push(item); });
                  this.$store.state.dataTree[commentList.dataSetIndex].commentList.comments.push(temp);
                  this.$store.state.commentTagValueList[commentList.dataSetIndex].push(temp);
                  this.getTagByTagIdList(temp.tagList);
                }
                else this.$message.error('comment acquiring error');
                this.$store.state.endLoading++;
              })
              .catch(error => console.log(error));
          })
        },

        getTagByTagIdList(tagList) {
          this.$store.state.tagsList[tagList.dataSetIndex] = [];
          if (tagList.tagIdList.length>0) {
            tagList.tagIdList.forEach(id => {
              this.$store.state.startLoading++;
              this.axios.get('http://tonycoder.ziqiang.net.cn:8080/tag/', {params: {tag_id: id}})
                .then(response => {
                  if (response.data.Details) {
                    let temp = response.data.Details;
                    temp["tag_value"] = this.getTagValue(temp);
                    if (this.$store.state.commentTagValueList[tagList.dataSetIndex][tagList.totalCommentIndex].tagValueList.indexOf(temp.tag_value) === -1)
                      this.$store.state.commentTagValueList[tagList.dataSetIndex][tagList.totalCommentIndex].tagValueList.push(temp.tag_value);
                    temp["totalCommentIndex"] = tagList.totalCommentIndex;
                    temp["tag_id"] = id;
                    temp["comment_id"] = tagList.comment_id;
                    temp["dataSetIndex"] = tagList.dataSetIndex;
                    temp["commentIndex"] = tagList.commentIndex;
                    temp["tagIndex"] = this.$store.state.dataTree[tagList.dataSetIndex].commentList.comments[tagList.commentIndex].tagList.tags.length;
                    temp["totalTagIndex"] = this.$store.state.tagsList[tagList.dataSetIndex].length;
                    this.$store.state.dataTree[tagList.dataSetIndex].commentList.comments[tagList.commentIndex].tagList.tags.push(temp);
                    this.$store.state.tagsList[tagList.dataSetIndex].push(temp);
                  } else this.$message.error('tag acquiring error');
                  this.$store.state.endLoading++;
                })
                .catch(error => console.log(error))
            })
          }
        },

        getTagValue(item){
          if (!item) return -1;
          if (item.Functional_requirements) return 0;
          if (item.Performance) return 1;
          if (item.Compatibility) return 2;
          if (item.Usability) return 3;
          if (item.Security) return 4;
          if (item.Maintainability) return 5;
          if (item.Portability) return 6;
          if (item.Others) return 7;
          return -1;
        },
      }
    }
</script>

<style scoped>

</style>
