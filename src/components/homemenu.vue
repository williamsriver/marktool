<template>
<v-app>

  <v-container v-show="!$store.state.loginstatus" fluid>
    <v-row>
      <v-col></v-col>

      <v-col cols="8">
        <v-tabs fixed-tabs v-model="MenuChoose">
          <v-tab>{{lantext.words.login[$store.state.lanType]}}</v-tab>
          <v-tab>{{lantext.words.register[$store.state.lanType]}}</v-tab>
        </v-tabs>
      </v-col>

      <v-col></v-col>
    </v-row>

    <v-row>
      <v-col></v-col>

      <v-col cols="8">

        <v-tabs-items v-model="MenuChoose">
          <v-tab-item>
            <v-card elevation="0">
              <v-card-text>
                <v-text-field
                  v-model="inputUsername" :label="lantext.words.username[$store.state.lanType]"
                  @click:append="Login_showpassword = !Login_showpassword">
                </v-text-field>
              </v-card-text>

              <v-card-text>
                <v-text-field
                  v-model="inputPassword"
                  :append-icon="Login_showpassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="Login_showpassword ? 'text' : 'password'"
                  :label="lantext.words.password[$store.state.lanType]"
                  @click:append="Login_showpassword = !Login_showpassword">
                </v-text-field>
              </v-card-text>


              <v-card-actions>
                <v-btn @click="loginadmit">{{lantext.words.login[$store.state.lanType]}}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>

            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card elevation="0">
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
                :label="lantext.words.confirm[$store.state.lanType] + ' ' + lantext.words.password[$store.state.lanType]">
              </v-text-field>

              <v-card-actions>
                <v-btn :disabled="!registerValid" @click="registerOpr">{{lantext.words.register[$store.state.lanType]}}</v-btn>
              </v-card-actions>

            </v-card>

          </v-tab-item>
        </v-tabs-items>



      </v-col>

      <v-col></v-col>
    </v-row>


  </v-container>

  <v-container v-show="$store.state.loginstatus" fluid>
    <v-row>
      <v-navigation-drawer permanent width="200">
        <v-list dense nav>
          <v-list-item-title class="title">{{$store.state.currentuser}}</v-list-item-title>
          <v-list-item-subtitle>{{UserType}}</v-list-item-subtitle>
          <v-divider></v-divider>
          <v-list-item
            v-for="(item,index) in items[$store.state.user_level]"
            :key="item.title" link
            @click="list_chosen=index">
            <v-list-item-icon> <v-icon>{{ item.icon }}</v-icon> </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-col class="pa-0">
        <commentlist v-show="list_chosen===0 && $store.state.user_level<2" :enable=" $store.state.loginstatus"></commentlist>
        <dataplace v-show="(list_chosen===1 && $store.state.user_level<2)" :enable= " $store.state.loginstatus "></dataplace>
        <admin v-show="list_chosen===0 && $store.state.user_level===2"></admin>
        <all-list v-show="list_chosen===1 && $store.state.user_level===2"
                  :enable="$store.state.user_level===2 && list_chosen===1 "></all-list>
        <upfile v-show="list_chosen===2 && $store.state.user_level<2"></upfile>
        <get-file v-show="list_chosen===4 && $store.state.user_level<2"></get-file>
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
    export default {
        name: "homemenu",
      components: {GetFile, AllList, Dataplace, Commentlist,  admin, upfile},
      data:()=>({
        list_chosen:"",
        lantext:lantext,
        inputUsername:'',
        inputPassword:'',
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
        isUserNameDuplicated:false,
        username:'',
        userpassword:'',
        passwordmatch:'',
        matchmessage:'两次密码不一致',
        Register_showpassword:false,
        errormessage:'',

        items:[
          [
            { title: 'Mark', icon: 'mdi-pen'},
            { title: 'Data', icon: 'mdi-image' },
            { title: 'Upload Data', icon: 'mdi-content-save' },
            { title: 'Log-out', icon: 'mdi-logout'},
            { title: 'Get DataSet', icon: 'mdi-image'},

          ],
          [
            { title: 'Review', icon: 'mdi-pen-plus'},
            { title: 'Data', icon: 'mdi-image' },
            { title: 'Upload Data', icon: 'mdi-content-save' },
            { title: 'Log-out', icon: 'mdi-logout'},
            { title: 'Get DataSet', icon: 'mdi-image'},
          ],
          [
            { title: 'Upgrade User', icon: 'mdi-pen'},
            { title: 'View All the List', icon: 'mdi-image' },
            { title: 'Log-out', icon: 'mdi-logout'},
          ],
        ],
      }),
      computed:{
        registerValid(){
          return(this.username!=='' && this.userpassword === this.passwordmatch
            && this.userpassword !== '')
        },
        UserType(){
          console.log(this.$store.state.user_level);
          switch(this.$store.state.user_level){

            case 0:return "Marker";
            case 1:return "Viewer";
            case 2:return "Admin";
            default:return "Unknown";
          }
        }
      },
      watch:{
          list_chosen(value){
            this.$store.state.workStatus = false;
            if (this.items[this.$store.state.user_level][value].title==='Log-out') this.logoutOperation();
          }
      },
      methods:{

        loginadmit(){
          //请求登录
          let formData1 = new FormData();
          formData1.append('username',this.inputUsername)
          formData1.append('password',this.inputPassword)
          this.axios.post('http://tonycoder.ziqiang.net.cn:8080/login/',formData1)
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

                this.inputUsername = ''
                this.inputPassword = ''

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

          this.axios.get('http://tonycoder.ziqiang.net.cn:8080/register/',config1)
            .then(function (response) {
              console.log(response)
              this.isUserNameDuplicated = response.data.is_duplicated
              if (!this.isUserNameDuplicated) {
                let formData1 = new FormData()
                formData1.append('username', this.username)
                formData1.append('password', this.userpassword)
                formData1.append('user_level', 2)
                this.axios.post('http://tonycoder.ziqiang.net.cn:8080/register/', formData1)
                  .then(function (response) {
                    console.log(response);
                    if (response.data.Msg === 'Register Succeeded.') {
                      const that =this
                      this.$message.success(
                        lantext.words.register[this.$store.state.lanType]+
                        lantext.sentences.item_success[this.$store.state.lanType]
                      )
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

        logoutOperation(){
          try {
            this.loginstatus = false
            this.$store.state.loginstatus = false
            this.$message.success(
              this.lantext.words.logout[this.$store.state.lanType] + ' ' +
              this.lantext.words.success[this.$store.state.lanType]
            )
          }catch(e)
          {
            this.$message.error(
              this.lantext.words.logout[this.$store.state.lanType] +
              this.lantext.words.fail[this.$store.state.lanType])
          }

        },
      }
    }
</script>

<style scoped>

</style>
