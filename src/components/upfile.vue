<template>
    <v-container fluid>
      <v-main class="text-h4 ma-2">{{lantext.words.upload_file[$store.state.lanType]}}</v-main>
      <v-divider></v-divider>
      <v-row class="ma-2">
        <v-col> <v-file-input type="file" v-model="myFile"></v-file-input> </v-col>
        <v-col> <v-text-field label="File Name" v-model="fileName"></v-text-field> </v-col>

        <v-col>
          <v-btn @click="upLoadFile(myFile,fileName)" outlined color="primary" v-show="!!myFile">
            {{lantext.words.upload[$store.state.lanType]}}
          </v-btn>
        </v-col>

      </v-row>

    </v-container>

</template>

<script>
    import lantext from "../lib/lantext";

    export default {
        name: "upfile",
      data:()=>({
        lantext:lantext,
        fileName:"",
        myFile:null,
        uploading: false,
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
        upLoadFile(file, name){
          console.log(file, name)
          let formData1 = new FormData();
          formData1.append("files",file);
          formData1.append("name",name);
          formData1.append("username",this.$store.state.currentuser);
          this.$message.warning('uploading...')
          this.axios.post('/api/fileoperations/',formData1)
            .then((response) =>{
            console.log(response);
            if (response.data.msg==="ok") this.$message.success('ok')
            }).catch(error => console.log(error));
        }
      }
    }
</script>

<style scoped>

</style>
