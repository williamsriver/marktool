<template>
  <v-app>
    <!--系统栏-->
    <v-system-bar
      style="background-image: linear-gradient(to right, #c31432 , #240b36)" height="43">
      <v-row>

        <v-col cols="5" align-self="center">
          <v-main class="text-left" style="color: white">{{lantext.words.system_title[this.$store.state.lanType]}}</v-main>
        </v-col>

        <v-spacer></v-spacer>

        <v-col cols="2" align-self="center">
          <v-select
            dense filled flat hide-details dark
            v-model="lanValue"
            :items="lanlist">
          </v-select>
        </v-col>

        <v-col cols="1" align-self="center">
          <span style="color: white">{{nowtime}}</span>
        </v-col>

      </v-row>

    </v-system-bar>
    <router-view/>
  </v-app>
</template>

<script>
    import lantext from "../lib/lantext";
    export default {
        name: "sysbar",
      data:()=>({
        lantext:lantext,
        lanValue:'中文',
        lanlist:['English','中文'],




        nowtime:'',
        timer:'',//计时器
      }),

      computed:{
        lanPointer(){
          switch (this.lanValue) {
            case "English":return 0;
            case "中文":return 1;
            default : return  1;
          }
        }
      },

      watch:{
        lanValue(){
          switch (this.lanValue) {
            case "english":this.$store.state.lanType = 0; break;
            case "中文":this.$store.state.lanType = 1; break;
            default : this.$store.state.lanType = 0; break;
          }
        }
      },
      mounted(){

        this.getTime()
        this.timer = setInterval(this.getTime, 10000);





      },
      beforeDestroy() {
        clearInterval(this.timer);
      },
      methods:{




        reget(){
          this.getLists()
        },
        //get comment lists
        getLists(){
          this.axios.get('http://tonycoder.ziqiang.net.cn:8080/commentsList/',{params:{username:this.$store.state.currentuser} })
            .then(function (response) {
              console.log('commentslist',response)
              this.$store.state.commentsList = response.data.Details.comment_list_id
              //note : comment_list_id is an array

              //refresh the lists to remove the duplicate ones
              for (let j=0;j<this.$store.state.commentsList.length;j++){
                console.log(this.$store.state.commentsList[j])
                if (this.$store.state.lists_duplicate.indexOf(this.$store.state.commentsList[j]) === -1){
                  this.$store.state.lists_duplicate.push(this.$store.state.commentsList[j])
                }
              }
              this.$store.state.commentsList = this.$store.state.lists_duplicate
              console.log(this.$store.state.lists_duplicate)

              //get comment systematically by lists
              for (var i=0;i<this.$store.state.commentsList.length;i++){
                this.getCommentListByList(this.$store.state.commentsList[i])
              }

            }.bind(this)).catch(function (error) {
            console.log(error)
          })
        },

        //get comments by the list
        getCommentListByList(listid){
          this.axios.get('http://tonycoder.ziqiang.net.cn:8080/commentsList/',{params:{list_id:listid} })
            .then(function (response) {

              var cmtlist =response.data.comment_id_list;
              for (var i=0;i<cmtlist.length;i++){
                this.getcmt(cmtlist[i])
              }
            }.bind(this)).catch(function (error) {
            console.log(error)
          })
        },

        //get comment , including duplicate judgements
        getcmt(cmtid){
          var flag1 =false
          this.comment_need++;
          this.axios.get('http://tonycoder.ziqiang.net.cn:8080/comments/',{params:{comment_id:cmtid} })
            .then(function (response) {
              if (!!response.data.Details) {
                this.comment_got++;
                let details = response.data.Details
                details['comment_id'] = cmtid
                this.$store.state.comments.push(details)

                flag1 = false
                for (var i = 0; i < this.$store.state.apps.length; i++) {

                  flag1 = this.$store.state.apps[i].name === response.data.Details.app_name
                  if (flag1 && this.$store.state.apps[i].comments_id_list.indexOf(cmtid) === -1){
                    this.$store.state.apps[i].comments_id_list.push(cmtid)
                  }
                  //judge the time
                  if (response.data.Details.datetime_info > this.$store.state.apps[i].datetime_info)
                    this.$store.state.apps[i].datetime_info = response.data.Details.datetime_info
                  if (flag1) break; // already find the correct app, we can quit now
                }

                //haven't found the correct app, then create
                if (!flag1) {
                  this.$store.state.apps.push({
                    name: response.data.Details.app_name,
                    datetime_info: "",
                    comments_id_list: [cmtid],
                  })
                }
              }

            }.bind(this)).catch(function (error) {
            console.log(error)
          })
        },

        logoutOperation(){
          try {
            this.loginstatus = false
            this.$store.state.loginstatus = false
            this.$message.success(
              this.lantext.words.logout[this.$store.state.lanType] + ' ' +
              this.lantext.words.success[this.$store.state.lanType]
            )
            location.reload()
          }catch(e)
          {
            this.$message.error(
              this.lantext.words.logout[this.$store.state.lanType] +
              this.lantext.words.fail[this.$store.state.lanType])
          }

        },


        uploadExcel(event){
          let fileList = event.target.files;
          var excelFile = this.$refs['upLoadExcel'].files[0];

          console.log(excelFile)

          let formData1 = new FormData()
          formData1.append('files',excelFile)
          formData1.append('username',this.$store.state.currentuser)
          formData1.append('name',excelFile.name)
          this.axios.post('http://tonycoder.ziqiang.net.cn:8080/fileoperations/',formData1)
            .then(function (response) {
              console.log(response)
              if (response.data.msg==="ok"){
                this.$message.success(
                  this.lantext.words.upload[this.$store.state.lanType] + ' ' +
                  this.lantext.words.success[this.$store.state.lanType]
                )
              }
              else {
                this.$message.error(
                  this.lantext.words.upload[this.$store.state.lanType] +
                  this.lantext.words.fail[this.$store.state.lanType])
              }
            }.bind(this)).catch(function (error) {
            console.log(error)
          })


        },

        //获取时间
        getTime(){
          var date=new Date();
          this.nowtime=date.getHours()+":";
          if (date.getMinutes()<10) this.nowtime+='0'+date.getMinutes();
          else this.nowtime+=date.getMinutes();
        },


      },
    }
</script>

<style scoped>

</style>
