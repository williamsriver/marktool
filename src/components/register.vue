<template>
  <v-app>
    <v-card style=" padding: 0 40px 0 40px">
      <v-card-title>{{lantext.words.welcome[$store.state.lanType]}} {{lantext.words.register[$store.state.lanType]}}</v-card-title>
      <!--用户名-->
      <v-text-field
        v-model="username"
        :label="lantext.words.username[$store.state.lanType]"
        :rules="[rules.required,usernameCheck(username)]"
        @change=""
      ></v-text-field>
      <!--密码-->
      <v-text-field
        v-model="userpassword"
        :append-icon="showpassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showpassword ? 'text' : 'password'"
        :label="lantext.words.password[$store.state.lanType]"
        :rules="[rules.required,rules.min]"
        @click:append="showpassword = !showpassword">
      </v-text-field>
      <!--确认密码-->
      <v-text-field
        v-model="passwordmatch"
        :type="showpassword ? 'text' : 'password'"
        :rules="[rules.sameCheck(passwordmatch,userpassword)]"
        :label="lantext.words.confirm[$store.state.lanType] + ' ' + lantext.words.password[$store.state.lanType]">
      </v-text-field>

      <v-card-actions>
        <!--注册验证-->
        <v-btn :disabled="!registerValid"
               @click="registerOpr">{{lantext.words.register[$store.state.lanType]}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<script>
  import lantext from "../lib/lantext";
  import store from "../store";
  export default {
    name: "register",
    data:()=>({
      lantext:lantext,
      rules: {
        required: value => !!value || lantext.words.required[store.state.lanType],
        min: v => v.length >= 8 || lantext.sentences.least_eight_words[store.state.lanType],
        sameCheck:(value,password) =>{
          if (value !== password) return (lantext.sentences.passwords_different[store.state.lanType])
          else return true
        },
      },
      isUserNameDuplicated:false,
      username:'',
      userpassword:'',
      passwordmatch:'',
      matchmessage:'两次密码不一致',
      showpassword:false,
      errormessage:'',
      formData: new FormData(),
      parms:[
        {
          username:this.username,
          userpassword: this.userpassword,
        }
      ]
    }),
    computed:{
      registerValid(){
        return(this.username!=='' && this.userpassword === this.passwordmatch
          && this.userpassword !== '')
      }
    },
    methods:{
      //用户名重复检测
      usernameCheck(usernameStr){
        /*
        this.axios.post('',{
          username: usernameStr
        }).then(function (response) {
          console.log(response);
          return ('用户名被占用')
        })
          .catch(function (error) {
            console.log(error);
          });

         */
        return true
      },
      registerOpr() {

        let config1 = {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          params:{
            username:this.username,
            password:this.userpassword
          }
        };

        this.axios.get('http://tonycoder.ziqiang.net.cn:8080/register/',config1)
          .then(function (response) {
            console.log(response)
           this.isUserNameDuplicated = response.data.is_duplicated
            if (!this.isUserNameDuplicated) {
              let formData1 = new FormData()
              formData1.append('username', this.username)
              formData1.append('password', this.userpassword)
              this.axios.post('http://tonycoder.ziqiang.net.cn:8080/register/', formData1)
                .then(function (response) {
                  console.log(response);
                  if (response.data.Msg === 'Register Succeeded.') {
                    const that =this
                    this.$message.success(
                      lantext.words.login[this.$store.state.lanType]+
                      lantext.sentences.item_success[this.$store.state.lanType]
                    )
                    setTimeout(function () {
                      that.$router.push('/')
                    },1000)
                  }
                  else this.$message.error(
                    lantext.words.login[this.$store.state.lanType]+
                    lantext.sentences.item_failed[this.$store.state.lanType]
                  )

                }.bind(this))
                .catch(function (error) {
                  console.log(error);
                });
            }
            else this.$message.error(lantext.sentences.user_duplicated[this.$store.state.lanType])
          }.bind(this))
          .catch(function (error) {
            console.log(error);
          });

        //将注册数据发到后台进行处理



      }
    }
  }
</script>

<style scoped>

</style>
