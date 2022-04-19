<template>

    <v-container fluid>
      <v-main class="text-h4 ma-2">{{lantext.sentences.get_dataset[$store.state.lanType]}}</v-main>
      <v-divider></v-divider>
<!--      <v-btn text class="ma-2" @click="getAllList">{{lantext.sentences.reload_data[$store.state.lanType]}}</v-btn>-->
      <v-data-table
        :headers="lantext.headers.ItemListHeader[$store.state.lanType]"
        :items="dataTree"
        :search="listSrchString"
        :loading="startLoading<endLoading"
        :items-per-page="5"
        v-if="isListAlive">
        <template v-slot:item.category="{item}">

        </template>
        <template v-slot:item.buttons="{item}">
          <v-btn text @click="getDataSet($store.state.currentuser, item.dataSetId)">
            {{lantext.sentences.get_dataset_btn[$store.state.lanType]}}
          </v-btn>
        </template>
      </v-data-table>
    </v-container>
</template>

<script>
  import operationsLib from "../lib/operationsLib"
  import lantext from "../lib/lantext";
  import axios from "axios";
  export default {
    name: "allDataSetTable",
    data:()=>({
      listSrchString:"",
      totalList:[],
      isListAlive:true,
      dataSetPtr:-1,
      lantext,
      operationsLib,
      dataTree:[],
      startLoading:0,
      endLoading:0,
    }),
    mounted() {
      this.getAllList();
    },
    methods:{
      getAllList(){
        this.dataTree = [];
        this.startLoading = 0;
        this.endLoading = 0;
        this.axios.get('/adminview/',
          {params:{username:this.$store.state.currentuser}
          }).then(response =>{
            console.log(response)
            if (response.data.details) {
              let idList = [];
              response.data.details.comment_id_list.forEach(item => {
                let new_item = item.replace(/'/g,"\"");
                new_item = JSON.parse(new_item);
                if (idList.indexOf(new_item.commentList_id_list) === -1) {
                  idList.push(new_item.commentList_id_list);
                  this.dataTree.push({
                    dataSetId : new_item.commentList_id_list,
                    fileName : new_item.name,
                    uploadUserName : new_item.username,
                  });
                }
              });
            }
          })
          .catch(error =>console.log(error))
      },
      upLoadFile(file, name){
        console.log(file, name)
        let formData1 = new FormData();
        formData1.append("files",file);
        formData1.append("name",name);
        formData1.append("username",this.$store.state.currentuser);

        axios.post('/fileoperations/',formData1)
          .then((response) =>{
            console.log(response);
            if (response.data.msg==="ok") this.$message.success('ok')
          }).catch(error => console.log(error));
      },
      getDataSet(userName, datasetId){
        console.log(userName, datasetId)
        let url = '/commentsList/';
        axios.put(url ,{  username:userName, list_id:datasetId,} )
          .then(response =>{
            console.log(response);
            if (response.data.msg!=="OK") this.$message.warning(response.data.msg);
          }).catch(error => console.log(error));
      },
    }
  }
</script>

<style scoped>

</style>
