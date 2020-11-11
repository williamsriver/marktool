<template>
  <v-app>
    <v-container>
      <v-btn @click="showFile">show</v-btn>
      <v-file-input type="file" v-model="myFile"></v-file-input>
      <v-text-field label="File Name" v-model="fileName"></v-text-field>
      <v-btn @click="upLoadFile(myFile)">upload</v-btn>
    </v-container>

  </v-app>
</template>

<script>
    export default {
        name: "upfile",
      data:()=>({
        fileName:"",
        myFile:null,
      }),
      watch:{
          myFile:{
            handler(value){
              if (value){
                this.fileName = value.name.substring(0,value.name.length-5);
              }
            },
            immediate:true
          }
      },
      methods:{
        showFile(){
          console.log(this.myFile);
        },
        upLoadFile(file, name){
          console.log(file)
          let formData1 = new FormData();
          formData1.append("files",file);
          formData1.append("name",name);
          formData1.append("username",this.$store.state.currentuser);

          this.axios.post('http://tonycoder.ziqiang.net.cn:8080/fileoperations/',formData1)
            .then((response) =>{
            console.log(response);
            }).catch(error => console.log(error));
        }
      }
    }
</script>

<style scoped>

</style>
