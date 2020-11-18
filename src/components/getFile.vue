<template>
  <v-container>
    <v-card>
      <v-card-title>get dataset</v-card-title>
      <v-text-field label="dataset ID" v-model="temp_dataSetId"></v-text-field>
      <v-card-actions>
        <v-btn @click="relateDataSet">get dataset</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
    export default {
        name: "getFile",
      data:()=>({
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
