<template>

    <v-container fluid>
      <v-row dense>
        <v-col> <v-btn @click="getAllList">{{lantext.sentences.reload_data[$store.state.lanType]}}</v-btn> </v-col>
        <v-col> <v-text-field v-model="listSrchString"></v-text-field> </v-col>
      </v-row>


          <v-data-table
            :headers="lantext.headers.ItemListHeader[$store.state.lanType]"
            :items="dataTree"
            :search="listSrchString"
            :loading="startLoading<endLoading"
            :items-per-page="5"
            v-if="isListAlive">
            <template v-slot:item.buttons="{item}">
              <v-btn @click="operationsLib.getDataSet($store.state.currentuser, item.dataSetId)">
                {{lantext.sentences.get_dataset[$store.state.lanType]}}
              </v-btn>
            </template>

          </v-data-table>
    </v-container>
</template>

<script>
  import operationsLib from "../lib/operationsLib"
  import lantext from "../lib/lantext";
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
      //this.getAllList();
    },
    methods:{
      getAllList(){
        this.dataTree = [];
        this.startLoading = 0;
        this.endLoading = 0;
        this.axios.get('http://tonycoder.ziqiang.net.cn:8080/adminview/',
          {params:{username:this.$store.state.currentuser} })
          .then(response =>{
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
    }
  }
</script>

<style scoped>

</style>
