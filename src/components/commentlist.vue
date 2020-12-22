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
          <v-col cols="5">
          <v-text-field v-model="listSrchString" append-icon="mdi-magnify"
                        :label="lantext.words.search[$store.state.lanType]"></v-text-field>
          </v-col>
        </v-row>
    </v-container>
    <v-container fluid v-show="!$store.state.workStatus">
      <v-row>

        <v-col>

          <v-data-table
            :loading="$store.state.startLoading>$store.state.endLoading"
            :headers="lantext.headers.ItemListHeader[$store.state.lanType]"
            :items="$store.state.dataTree"
            :items-per-page="5"
            :search="listSrchString"
            item-key="listid"
            v-if="isListAlive"
          >


            <template v-slot:item.uploadUserName="{item}">
              {{$store.state.currentuser}}
            </template>

            <template v-slot:item.buttons="{item}">
                <v-btn text @click="dataSetPtr = item.dataSetIndex, $store.state.workStatus = true"
                  :disabled="$store.state.startLoading!==$store.state.endLoading">
                  <span class="mdi mdi-pen-plus"></span>
                  {{lantext.words[$store.state.user_level===0?"mark":"view"][$store.state.lanType]}}
                </v-btn>

              <v-btn text @click="shareOverlay = true, temp_dataSetId = item.dataSetId">
                <span class="mdi mdi-share"></span>
                share
              </v-btn>

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

    <v-overlay v-show="shareOverlay">
      <v-card>
        <v-main>
          <v-spacer></v-spacer>
          <v-btn @click="shareOverlay = false">
            <span class="mdi mdi-close"></span>
          </v-btn>
        </v-main>
        <v-card-title>share dataset</v-card-title>
        <v-text-field label="shared user" v-model="temp_username"></v-text-field>
        <v-text-field label="dataset ID" v-model="temp_dataSetId"></v-text-field>
        <v-card-actions>
          <v-btn @click="relateDataSet">share dataset</v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>

  </v-app>
</template>

<script>
  import lantext from "../lib/lantext";
  import Markplace from "./markplace";
  import Viewplace from "./viewplace";
    export default {
        name: "commentlist",
      props:{
        enable:{
          type: Boolean,
          required:true
        }
      },
      components: {Viewplace, Markplace},
      data:()=>({
        lantext:lantext,
        listSrchString:'',
        dataSetPtr:-1,
        isListAlive:true,
        shareOverlay:false,
        temp_username:"",
        temp_dataSetId: "",
      }),
      watch:{
        enable:{
          handler(val){
            console.log('value ',val);
            if (val) this.refreshCommentList();
          },
          immediate:true,
        },

      },
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
          this.axios.get('http://tonycoder.ziqiang.net.cn:8080/commentsList/',
            {params:{username:this.$store.state.currentuser} })
            .then(response =>{
              if (response.data.Details) {
                response.data.Details.comment_list_id.forEach(id => {
                  if (this.$store.state.dataSetIdList.indexOf(id) === -1) {
                    this.$store.state.dataSetIdList.push(id);
                    this.$store.state.dataTree.push({
                      dataSetId : id,
                      dataSetIndex : this.$store.state.dataTree.length,
                      commentList: {
                        dataSetId: id,
                        dataSetIndex : this.$store.state.dataTree.length,
                        commentIdList : [],
                        comments: [],
                        fileName : "undefined",
                      },
                    });
                  }
                });

                this.$store.state.tagsList = new Array(this.$store.state.dataTree.length);
                this.$store.state.commentTagValueList = new Array(this.$store.state.dataTree.length);
                this.$store.state.dataTree.forEach(dataset => this.getCommentIdListByDataSet(dataset) );
              }
              else this.$message.error('datasets acquiring error');
            })
            .catch(error =>console.log(error))
        },


        getCommentIdListByDataSet(dataset){

          this.axios.get('http://tonycoder.ziqiang.net.cn:8080/commentsList/', {params: {list_id:dataset.dataSetId}})
            .then(response => {

              if (response.data) this.$store.state.dataTree[dataset.dataSetIndex].fileName = response.data.name;
              if (response.data.comment_id_list) {
                this.$store.state.dataTree[dataset.dataSetIndex].commentList.commentIdList = response.data.comment_id_list;
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
          commentList.commentIdList.forEach((id, index) =>{
            this.$store.state.startLoading++;
            this.axios.get('http://tonycoder.ziqiang.net.cn:8080/comments/', {params: {comment_id: id} } )
              .then(response => {
                if (this.$store.state.commentsDuplicateList.indexOf(id)===-1) {
                  this.$store.state.commentsDuplicateList.push(id);
                  if (response.data.Details) {
                    let temp = response.data.Details;
                    temp["comment_id"] = id;
                    temp["dataSetIndex"] = commentList.dataSetIndex;
                    temp["commentIndex"] = this.$store.state.dataTree[commentList.dataSetIndex].commentList.comments.length;
                    temp["totalCommentIndex"] = this.$store.state.commentTagValueList[commentList.dataSetIndex].length;
                    temp["tagValueList"] = [];
                    temp["tagList"] = {
                      comment_id: id,
                      dataSetIndex: commentList.dataSetIndex,
                      commentIndex: this.$store.state.dataTree[commentList.dataSetIndex].commentList.comments.length,
                      totalCommentIndex: temp.totalCommentIndex,
                      tagIdList: [],
                      tags: [],
                    };
                    let temp_tagIdList = response.data.Details.tag_id_list.split(',');
                    temp_tagIdList.forEach(item => {if (item) temp.tagList.tagIdList.push(item);});
                    this.$store.state.dataTree[commentList.dataSetIndex].commentList.comments.push(temp);
                    this.$store.state.commentTagValueList[commentList.dataSetIndex].push(temp);
                    this.$store.state.endLoading++;
                    this.getTagByTagIdList(temp.tagList);
                  } else this.$message.error('comment acquiring error');
                }
                else this.$store.state.endLoading++;// duplicate items
              })
              .catch(error => console.log(error));
          })
        },

        getTagByTagIdList(tagList) {
          this.$store.state.tagsList[tagList.dataSetIndex] = [];
          if (tagList.tagIdList.length>0) {
            tagList.tagIdList.forEach(id => {
              if (this.$store.state.tagsDuplicateList.indexOf(id)===-1) {
                this.$store.state.tagsDuplicateList.push(id);
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
          formData1.append('list_id',this.temp_dataSetId);
          this.axios.put('http://tonycoder.ziqiang.net.cn:8080/commentsList/',formData1)
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
