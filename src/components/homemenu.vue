<template>
<v-app>
  <v-container v-show="!$store.state.loginstatus">
        <v-tabs fixed-tabs v-model="MenuChoose">
          <v-tab>{{lantext.words.login[$store.state.lanType]}}</v-tab>
          <v-tab>{{lantext.words.register[$store.state.lanType]}}</v-tab>
        </v-tabs>

        <v-tabs-items v-model="MenuChoose">
          <v-tab-item>
                <v-text-field
                  clearable
                  v-model="loginUsername" :label="lantext.words.username[$store.state.lanType]"
                  @click:append="Login_showpassword = !Login_showpassword">
                </v-text-field>

                <v-text-field
                  clearable
                  v-model="loginPassword"
                  :append-icon="Login_showpassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="Login_showpassword ? 'text' : 'password'"
                  :label="lantext.words.password[$store.state.lanType]"
                  @click:append="Login_showpassword = !Login_showpassword">
                </v-text-field>
              <v-row></v-row>


          </v-tab-item>

          <v-tab-item>
              <v-text-field
                v-model="username"
                :label="lantext.words.username[$store.state.lanType]"
                :rules="[rules.required]"
              ></v-text-field>

              <v-text-field
                v-model="userpassword"
                :append-icon="Register_showpassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="Register_showpassword ? 'text' : 'password'"
                :label="lantext.words.password[$store.state.lanType]"
                :rules="[rules.required,rules.min]"
                @click:append="Register_showpassword = !Register_showpassword">
              </v-text-field>

              <v-text-field
                v-model="passwordmatch"
                :type="Register_showpassword ? 'text' : 'password'"
                :rules="[rules.sameCheck(passwordmatch,userpassword)]"
                :label="lantext.sentences.password_confirmation[$store.state.lanType]">
              </v-text-field>


                <v-radio-group v-model="registerType">
                  <v-row>
                  <v-col><v-radio :value="0" :label="lantext.words.marker[$store.state.lanType]"></v-radio></v-col>
                  <v-col><v-radio :value="1" :label="lantext.words.reviewer[$store.state.lanType]"></v-radio></v-col>
                  <v-col cols="6"></v-col>
                  </v-row>
                </v-radio-group>


          </v-tab-item>
        </v-tabs-items>

        <v-btn width="100%" :color="MenuChoose===0?'green':'blue'" style="color:white;"
               :disabled="MenuChoose===0?!loginValid:!registerValid"
               @click="MenuChoose===0?loginadmit():registerOpr()">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>

  </v-container>

  <v-container v-show="$store.state.loginstatus" fluid style="padding-top: 0">
    <v-row>
      <v-navigation-drawer permanent width="200">
        <v-list dense >
          <v-list-item-title class="title" style="text-align: center">{{$store.state.currentuser}}</v-list-item-title>
          <v-list-item-subtitle style="text-align: center" v-show="UserType!=='marker'">{{
            lantext.words[String(UserType)]!== undefined?
            lantext.words[String(UserType)][$store.state.lanType]:"Unknown"}}</v-list-item-subtitle>
          <v-list-item-subtitle style="text-align: center" v-show="UserType==='marker'">{{
            $store.state.lanType===0?'Coder':'标注者'}}</v-list-item-subtitle>
          <v-list-item
            v-for="(item,index) in items[$store.state.user_level]"
            :key="index" link
            @click="list_chosen=index">
            <v-row>
              <v-col><v-icon>{{ item.icon }}</v-icon></v-col>
              <v-col>{{ item.title[$store.state.lanType] }}</v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-col class="pa-0">
        <commentlist v-show="list_chosen===0 && $store.state.user_level<2" :enable=" $store.state.loginstatus"></commentlist>
        <dataplace v-show="(list_chosen===1 && $store.state.user_level<2)" :enable= " $store.state.loginstatus "></dataplace>
        <all-list v-show="list_chosen===0 && $store.state.user_level===2"
                  :enable="$store.state.user_level===2 && list_chosen===0"></all-list>
      </v-col>
    </v-row>
  </v-container>

</v-app>
</template>

<script>
  import lantext from "../lib/lantext";
  import store from "../store";
  import Commentlist from "./commentlist";
  import Dataplace from "./dataplace";
  import admin from "./admin";
  import AllList from "./allList";
  import upfile from "./upfile";
  import getFile from "./getFile";
  import GetFile from "./getFile";

  import Methods from "../lib/operationsLib"
    export default {
        name: "homemenu",
      inject:['reload'],
      components: {GetFile, AllList, Dataplace, Commentlist, upfile},
      data:()=>({
        list_chosen:"",
        lantext:lantext,
        loginUsername:'',
        loginPassword:'',
        Login_showpassword:false,
        MenuChoose:0,
        rules: {
          required: value => !!value || lantext.words.required[store.state.lanType],
          min: v => v.length >= 8 || lantext.sentences.least_eight_words[store.state.lanType],
          sameCheck:(value,password) =>{
            if (value !== password) return (lantext.sentences.passwords_different[store.state.lanType])
            else return true
          },
        },
        registerType:0,
        isUserNameDuplicated:false,
        username:'',
        userpassword:'',
        passwordmatch:'',
        matchmessage:'两次密码不一致',
        Register_showpassword:false,
        errormessage:'',

        items:[
          [
            { title: ['Labeling','标注'], icon: 'mdi-pen'},
            { title: ['Statistic','统计'], icon: 'mdi-image' },
            { title: ['Log Out','登出'], icon: 'mdi-logout'},

          ],
          [
            { title: ['Review','审阅'], icon: 'mdi-pen-plus'},
            { title: ['Data','统计'], icon: 'mdi-image' },
            { title: ['Log Out','登出'], icon: 'mdi-logout'},
          ],
          [
            { title: ['View All the List','全部列表'], icon: 'mdi-image' },
            { title: ['Log Out','登出'], icon: 'mdi-logout'},
          ],
        ],
      }),
      mounted() {
        document.onkeydown = (e)=>{
          let key = e.key;
          if (key=== "Enter") this.loginadmit();
        };
      },
      computed:{
        registerValid(){
          return(this.username!=='' && this.userpassword === this.passwordmatch
            && this.userpassword !== '')
        },
        loginValid(){
          return(this.loginUsername!=='' && this.loginPassword !== '')
        },
        UserType(){
          console.log(this.$store.state.user_level);
          switch(this.$store.state.user_level){

            case 0:return "marker";
            case 1:return "reviewer";
            case 2:return "admin";
            default:return "Unknown";
          }
        }
      },
      watch:{
          list_chosen(value){
            this.$store.state.workStatus = false;
            console.log(this.items[this.$store.state.user_level][value].title[0]==='Log Out')
            if (this.items[this.$store.state.user_level][value].title[0]==='Log Out') this.logOut();
          }
      },
      methods:{

        loginadmit(){
          //请求登录
          let formData1 = new FormData();
          formData1.append('username',this.loginUsername)
          formData1.append('password',this.loginPassword)
          this.axios.post('http://121.40.238.237:8080/login/',formData1)
            .then(function (response) {
              console.log(response)
              if (response.data.Msg === 'Login Succeeded.'){

                this.$message.success({
                    message:this.lantext.words.login[this.$store.state.lanType] +
                      this.lantext.words.success[this.$store.state.lanType],
                    duration:1000
                  }
                )
                this.$store.state.currentuser = response.data.username
                this.$store.state.token = response.data.token
                this.$store.state.user_level = response.data.user_level;
                this.$store.state.loginstatus = true

                this.loginUsername = ''
                this.loginPassword = ''

              }
              else this.$message.error(
                this.lantext.words.login[this.$store.state.lanType]+' '+
                this.lantext.words.fail[this.$store.state.lanType]
              )
            }.bind(this)).catch(function (error) {
            console.log(error)
            this.$message.error(
              this.lantext.words.login[this.$store.state.lanType]+' '+
              this.lantext.words.fail[this.$store.state.lanType]
            )
          }.bind(this))
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

          this.axios.get('http://121.40.238.237:8080/register/',config1)
            .then(function (response) {
              console.log(response)
              this.isUserNameDuplicated = response.data.is_duplicated
              if (!this.isUserNameDuplicated) {
                let formData1 = new FormData()
                formData1.append('username', this.username)
                formData1.append('password', this.userpassword)
                formData1.append('user_level', this.registerType)
                this.axios.post('http://121.40.238.237:8080/register/', formData1)
                  .then(function (response) {
                    console.log(response);
                    if (response.data.Msg === 'Register Succeeded.') {
                      this.$message.success(
                        lantext.words.register[this.$store.state.lanType]+
                        lantext.sentences.item_success[this.$store.state.lanType]
                      )
                      this.reload()
                    }
                    else this.$message.error(
                      lantext.words.register[this.$store.state.lanType]+
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




        },



        logOut() {
          try {
            this.loginstatus = false
            this.$store.state.loginstatus = false
            this.$message.success(
              lantext.words.logout[this.$store.state.lanType] + ' ' +
              lantext.words.success[this.$store.state.lanType]
            );
            this.$store.state.dataTree = [];
            this.$store.state.dataSetIdList = [];
            this.$store.state.tagsDuplicateList = [];
            this.$store.state.commentsDuplicateList = [];
            this.$store.state.startLoading = 0;
            this.$store.state.endLoading = 0;
          } catch (e) {
            this.$message.error(
              lantext.words.logout[this.$store.state.lanType] +
              lantext.words.fail[this.$store.state.lanType])
          }
        }
      }
    }
</script>

<style scoped>

</style>
