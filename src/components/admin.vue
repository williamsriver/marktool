<template>
  <v-app>

    <v-container fluid>
      <v-main class="text-h3">{{lantext.words.upgrade[$store.state.lanType]+" "}}
        {{lantext.words.user[$store.state.lanType]}}</v-main>
      <v-text-field :label="lantext.words.username[$store.state.lanType]" v-model="userName"></v-text-field>
      <v-btn @click="userUpdate(userName)">{{lantext.words.upgrade[$store.state.lanType]+" "}}
        {{lantext.words.user[$store.state.lanType]}}</v-btn>
    </v-container>

  </v-app>
</template>

<script>
  import lantext from "../lib/lantext";
    export default {
      name: "admin",
      data:()=>({
        userName:"",
        lantext,
      }),
      methods:{
          userUpdate(userName){
            let cur_user_level = -1;
            console.log(userName);
            this.axios.get('http://tonycoder.ziqiang.net.cn:8080/userupgrade/',
              {params:{
                  username :userName
                }
              }).then(response =>{
                console.log(response.data.msg);
                if (response.data.msg === "ok") {
                  console.log('next')
                  cur_user_level = response.data.user_level;
                  if (cur_user_level===-1) this.$message.error("user not found");
                  else if (cur_user_level===1) this.$message.error("you are a reviewer now, can't upgrade");
                  else {
                    let formData1 = new FormData();
                    let tar_username = userName
                    formData1.append('cur_username',userName)
                    formData1.append('tar_username',tar_username)
                    formData1.append('tar_level',1)
                    this.axios.post('http://tonycoder.ziqiang.net.cn:8080/userupgrade/',formData1)
                      .then((response) => {
                        console.log(response)
                        if (response.data.msg === "ok") this.$message.success("升级成功");
                        else this.$message.error("升级失败");
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                }
            })


          }
      }
    }
</script>

<style scoped>

</style>
