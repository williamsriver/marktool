<template>
  <v-app>

    <!--search tab && table-->
    <v-container fluid>

      <v-row>
        <v-col>

          <v-btn text @click="reget">
            <v-icon>mdi-refresh</v-icon>
            {{lantext.sentences.reload_data[$store.state.lanType]}}
          </v-btn>
        </v-col>
        <v-col>
          <v-text-field v-model="listSrchString" append-icon="mdi-magnify"
                        :label="lantext.words.search[$store.state.lanType]"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-data-table
            :headers="lantext.headers.ItemListHeader[$store.state.lanType]" :items="$store.state.apps" :search="listSrchString"
            item-key="name"
            :loading="comment_got<comment_need"
            hide-default-footer>

            <template v-slot:item.buttons="{item}">
              <router-link :to="{path:'/' + $route.name + 'place', query:{app_info:item} }" class="text-decoration-none">
                <v-btn :disabled="false" text>
                  <span class="mdi mdi-pen-plus"></span>
                  <v-main>{{lantext.words[$route.name][$store.state.lanType]}}</v-main>
                </v-btn>
              </router-link>
            </template>

          </v-data-table>

        </v-col>
      </v-row>


    </v-container>

  </v-app>
</template>

<script>
  import lantext from "../lib/lantext";
    export default {
        name: "commentlist",
      data:()=>({
        lantext:lantext,
        listSrchString:'',

        comment_got:0,
        comment_need:0,

      }),
      created() {

        if (this.$store.state.apps.length===0) this.getLists()

      },
      mounted() {

      },
      methods:{

        reget(){
          this.$store.state.apps = []
          this.$store.state.tags = []
          this.$store.state.commentsList = []
          this.$store.state.comments = []
          this.$store.state.lists_duplicate = []
          this.getLists()
        },
          //get comment lists
        getLists(){
          this.axios.get('tonycoder.ziqiang.net.cn:8080/commentsList/',{params:{username:this.$store.state.currentuser} })
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
          this.axios.get('tonycoder.ziqiang.net.cn:8080/commentsList/',{params:{list_id:listid} })
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
          this.axios.get('tonycoder.ziqiang.net.cn:8080/comments/',{params:{comment_id:cmtid} })
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

      },

    }
</script>

<style scoped>

</style>
