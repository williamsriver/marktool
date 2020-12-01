<template>
  <v-app>

    <v-container fluid v-show="!$store.state.workStatus">
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
            :items-per-page="10"
            v-if="isListAlive"
          >
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

    <v-container fluid v-show="$store.state.workStatus">
      <markplace v-if="$store.state.workStatus" :look-mode="true" :enable="$store.state.workStatus"
                 :data-set-index="dataSetPtr" :loadFinish="$store.state.startLoading===$store.state.endLoading && $store.state.startLoading>0"></markplace>
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
            console.log('index',this.dataSetPtr)
            this.dataSetPtr = item.dataSetIndex;
            this.$store.state.workStatus = true;
            //important
            this.$store.state.tagsDuplicateList = [];
            this.$store.state.commentsDuplicateList = [];
            this.$store.state.startLoading = 0;
            this.$store.state.endLoading = 0;

            this.$store.state.dataTree[this.dataSetPtr].commentList.comments = [];
            this.getCommentByCommentIdList(this.$store.state.dataTree[this.dataSetPtr].commentList);
          },


        getAllList(){
          this.$store.state.dataTree = [];
          this.$store.state.dataSetIdList = [];
          this.$store.state.tagsDuplicateList = [];
          this.$store.state.commentsDuplicateList = [];
          this.$store.state.startLoading = 0;
          this.$store.state.endLoading = 0;
          this.axios.get('http://tonycoder.ziqiang.net.cn:8080/adminview/',
            {params:{username:this.$store.state.currentuser} })
            .then(response =>{
              if (response.data.details) {
                response.data.details.comment_id_list.forEach(item => {
                  let new_item = item.replace(/'/g,"\"");
                  new_item = JSON.parse(new_item);
                  if (this.$store.state.dataSetIdList.indexOf(new_item.commentList_id_list) === -1) {
                    this.$store.state.dataSetIdList.push(new_item.commentList_id_list);
                    this.$store.state.dataTree.push({
                      dataSetId : new_item.commentList_id_list,
                      fileName : new_item.name,
                      uploadUserName : new_item.username,
                      dataSetIndex : this.$store.state.dataTree.length,
                      commentList: {
                        dataSetId: new_item.commentList_id_list,
                        dataSetIndex : this.$store.state.dataTree.length,
                        commentIdList : [],
                        comments: [],
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
              if (response.data.comment_id_list) {
                this.$store.state.dataTree[dataset.dataSetIndex].commentList.commentIdList = response.data.comment_id_list;
              }
              else this.$message.error('comments id list acquiring error');
            })
            .catch(error => console.log(error))
        },

        getCommentByCommentIdList(commentList){
            console.log('comments',commentList)
          this.$store.state.commentTagValueList[commentList.dataSetIndex] = [];
          commentList.commentIdList.forEach((id) =>{
            this.$store.state.startLoading++;
            this.axios.get('http://tonycoder.ziqiang.net.cn:8080/comments/', {params: {comment_id: id} } )
              .then(response => {
                if (this.$store.state.commentsDuplicateList.indexOf(id)===-1) {
                  this.$store.state.commentsDuplicateList.push(id);
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
                  this.$store.state.endLoading++;
                  this.getTagByTagIdList(temp.tagList);
                }
                else this.$message.error('comment acquiring error');
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
              this.axios.get('http://tonycoder.ziqiang.net.cn:8080/tag/', {params: {tag_id: id}})
                .then(response => {
                  if (this.$store.state.tagsDuplicateList.indexOf(id)===-1) {
                    this.$store.state.tagsDuplicateList.push(id);
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
                  }
                })
                .catch(error => console.log(error))
            })
          }
        },

        getTagValue(item){
          if (!item) return -1;
          if (item.Performance) return 0;
          if (item.Compatibility) return 1;
          if (item.Usability) return 2;
          if (item.Security) return 3;
          if (item.Maintainability) return 4;
          if (item.Portability) return 5;
          if (item.Others) return 6;
          if (item.Functional_requirements) return 7;
          return -1;
        },
      }
    }
</script>

<style scoped>

</style>
