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
        <v-col></v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field v-model="listSrchString" append-icon="mdi-magnify"
                        :label="lantext.words.search[$store.state.lanType]"></v-text-field>
          <v-data-table
            class="elevation-1"
            :loading="$store.state.startLoading>$store.state.endLoading"
            :headers="lantext.headers.ItemListHeader[$store.state.lanType]"
            :items="$store.state.dataTree"
            :items-per-page="5"
            :search="listSrchString"
            item-key="listid"
            v-if="isListAlive"
          >

            <template v-slot:item.tagged="{item}">
              <span v-show="item.commentList">
                {{item.commentList.tagged}}/{{item.commentList.commentIdList.length}}
              </span>
            </template>



            <template v-slot:item.buttons="{item}">
              <div style="justify-content: space-around">
                <v-btn color="blue" @click="dataSetPtr = item.dataSetIndex, $store.state.workStatus = true"
                       style="color: white"
                       :disabled="($store.state.startLoading!==$store.state.endLoading)
                        || ($store.state.startLoading===$store.state.endLoading
                        && $store.state.user_level===1 && item.commentList.tagged===0)">
                  {{lantext.words[$store.state.user_level===0?"Labeling":"view"][$store.state.lanType]}}
                </v-btn>
                <v-btn color="orange" v-show="$store.state.user_level===0" style="color: white" @click="shareOverlay = true, temp_dataSetId = item.dataSetId">
                  {{lantext.words.share[$store.state.lanType]}}
                </v-btn>
              </div>
            </template>

          </v-data-table>

        </v-col>
      </v-row>
    </v-container>

    <v-container fluid v-show="$store.state.workStatus" class="pa-0">

      <markplace v-if="$store.state.user_level===0 && $store.state.workStatus" :look-mode="false"
                 :data-set-index="dataSetPtr" :enable="$store.state.workStatus" :loadFinish="$store.state.startLoading===$store.state.endLoading">
      </markplace>
      <viewplace v-if="$store.state.user_level===1 && $store.state.workStatus"
                 :data-set-index="dataSetPtr" :enable="$store.state.workStatus" :loadFinish="$store.state.startLoading===$store.state.endLoading"></viewplace>
    </v-container>

    <v-container v-show="$store.state.user_level===0" fluid>
      <upfile></upfile>
    </v-container>

    <all-dataset-table></all-dataset-table>

    <v-overlay v-show="shareOverlay" color="#eeeeee">
      <v-card  width="700" height="350" light>
        <div>
          <v-btn @click="shareOverlay = false" text absolute right>
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
        shareOverlay:false,
        temp_username:"",
        temp_dataSetId: "",
      }),
      methods:{
        refreshCommentList(){
          this.$store.state.dataTree = [];
          this.$store.state.dataSetIdList = [];
          this.$store.state.tagsDuplicateList = [];
          this.$store.state.commentsDuplicateList = [];
          this.$store.state.startLoading = 0;
          this.$store.state.endLoading = 0;
          this.getDataSet();
        },

        getDataSet(){
          this.axios.get('http://121.40.238.237:8080/commentsList/',
            {params:{username:this.$store.state.currentuser} })
            .then(response =>{
              console.log(response)
              if (response.data.Details) {
                response.data.Details.comment_list_id.forEach((id, index) => {
                  if (this.$store.state.dataSetIdList.indexOf(id) === -1) {//查重
                    this.$store.state.dataSetIdList.push(id);
                    this.$store.state.dataTree.push({
                      dataSetId : id,
                      dataSetIndex : this.$store.state.dataTree.length,
                      commentList: {
                        tagged:0,
                        dataSetId: id,
                        dataSetIndex : this.$store.state.dataTree.length,
                        commentIdList : [],
                        comments: [],
                        fileName : "undefined",
                      },
                    });
                  }
                });
                this.$store.commentsIdTotalList = []
                this.$store.state.tagsList = new Array(this.$store.state.dataTree.length);
                this.$store.state.commentTagValueList = new Array(this.$store.state.dataTree.length);
                this.$store.state.dataTree.forEach((dataset) => this.getCommentIdListByDataSet(dataset) );
              }
              else this.$message.error('datasets acquiring error');
            })
            .catch(error =>console.log(error))
        },


        getCommentIdListByDataSet(dataset){

          this.axios.get('http://121.40.238.237:8080/commentsList/', {params: {list_id:dataset.dataSetId}})
            .then(response => {
              console.log(response)
              if (response.data) this.$store.state.dataTree[dataset.dataSetIndex].fileName = response.data.name;
              if (response.data.comment_id_list) {
                this.$store.state.dataTree[dataset.dataSetIndex].commentList.commentIdList = response.data.comment_id_list;
                console.log("cmt id list", response.data.comment_id_list)
                //comment list 查重处理
                let commentsIdTotalList = []
                this.$store.state.dataTree[dataset.dataSetIndex].commentList.commentIdList.forEach((cmtid, index, arr) =>{
                  if (commentsIdTotalList.indexOf(cmtid) !== -1){
                    arr.splice(index, index+1)
                  }
                  else commentsIdTotalList.push(cmtid)
                })
                console.log("commentsIdTotalList", commentsIdTotalList)
                this.getCommentByCommentIdList(this.$store.state.dataTree[dataset.dataSetIndex].commentList);
              }
              else this.$message.error('comments id list acquiring error');

              //refresh to get name
              this.isListAlive = false;
              this.$nextTick(()=>{ this.isListAlive = true; })
            })
            .catch(error => console.log(error))
        },

        getCommentByCommentIdList(commentList){
          this.$store.state.commentTagValueList[commentList.dataSetIndex] = [];
          console.log("commentList.commentIdList", commentList.commentIdList)
          commentList.commentIdList.forEach((id, index) =>{
            this.$store.state.startLoading++;
            this.axios.get('http://121.40.238.237:8080/comments/', {params: {comment_id: id} } )
              .then(response => {
                //评论判重已经在cmtidlist解决了
                if (response.data.Details) {
                  let temp = response.data.Details;
                  temp["comment_id"] = id;
                  temp["dataSetIndex"] = commentList.dataSetIndex;
                  temp["commentIndex"] = index;
                  temp["totalCommentIndex"] = this.$store.state.commentTagValueList[commentList.dataSetIndex].length;
                  temp["tagValueList"] = []
                  temp["tagList"] = {
                    comment_id: id,
                    dataSetIndex: commentList.dataSetIndex,
                    commentIndex: index,
                    totalCommentIndex: temp.totalCommentIndex,
                    tagIdList: [],
                    tags: [],
                  };
                  let temp_tagIdList = response.data.Details.tag_id_list.split(',');
                  temp_tagIdList.forEach(item => {
                    if (item) temp.tagList.tagIdList.push(item);
                  });//tagIdlist本身有序
                  this.$store.state.dataTree[commentList.dataSetIndex].commentList.comments[index] = temp;
                  this.$store.state.commentTagValueList[commentList.dataSetIndex].push(temp);
                  if (temp.tagList.tagIdList.length > 0){
                    this.getTagByTagIdList(temp.tagList);
                  }


                  this.$store.state.endLoading++;

                }
                else this.$message.error('comment acquiring error');
              })
              .catch(error => console.log(error));
          })
        },

        getTagByTagIdList(tagList) {
          this.$store.state.tagsList[tagList.dataSetIndex] = [];
          if (tagList.tagIdList.length>0) {
            tagList.tagIdList.forEach((id, index) => {
              if (this.$store.state.tagsDuplicateList.indexOf(id)===-1) {
                this.$store.state.tagsDuplicateList.push(id);
                this.axios.get('http://121.40.238.237:8080/tag/', {params: {tag_id: id}})
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
                      if (temp.tag_value>=0) this.$store.state.dataTree[tagList.dataSetIndex].commentList.tagged++;

                      this.$store.state.dataTree[tagList.dataSetIndex].commentList.comments[tagList.commentIndex].tagList.tags.push(temp);
                      this.$store.state.tagsList[tagList.dataSetIndex].push(temp);
                    } else this.$message.error('tag acquiring error');
                  })
                  .catch(error => console.log(error))
              }
            })
          }
        },

        getTagValue(item){
          let result = -1;
          if (!item) return result;
          lantext.tagwords.tags[0].forEach((prop_name,index) =>{
            if (item[prop_name]) result = index;
          });
          return result;
        },

        relateDataSet(){
          let formData1 = new FormData();
          formData1.append('username',this.temp_username);
          formData1.append('list_id',String(this.temp_dataSetId));

          console.log('sent');
          this.axios.put('http://121.40.238.237:8080/commentsList/', {
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
