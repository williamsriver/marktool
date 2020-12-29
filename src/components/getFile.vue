<template>
  <v-container>
    <v-card>
      <v-card-title>{{lantext.words.getDataSet[$store.state.lanType]}}</v-card-title>
      <v-text-field :label="lantext.words.datasetID[$store.state.lanType]" v-model="temp_dataSetId"></v-text-field>
      <v-card-actions>
        <v-btn @click="relateDataSet">{{lantext.words.getDataSet[$store.state.lanType]}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
  import lantext from "../lib/lantext";
    export default {
        name: "getFile",
      data:()=>({
        lantext:lantext,
        temp_dataSetId:"",

      }),
      methods:{
          relateDataSet(){
            let temp_id = this.temp_dataSetId;
            this.axios.put('http://tonycoder.ziqiang.net.cn:8080/commentsList/',{
              params:{
                username:this.$store.state.currentuser,
                list_id:temp_id,
              }
            }).then(response =>{
              console.log(response);
            }).catch(error => console.log(error));
          }
      }
    }
</script>

<style scoped>

</style>
