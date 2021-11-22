<template>

  <v-app>
    <!--mode radio & search tab-->
    <v-container fluid>
      <v-row>
        <v-btn text @click="$store.state.workStatus = false">
          <v-icon>mdi-arrow-left</v-icon>
          <v-main>{{lantext.words.back[$store.state.lanType]}}</v-main>
        </v-btn>
      </v-row>
      <v-container fluid class="ma-0 pa-0">
        <v-row align-content="center" class="ma-0 pa-0">
          <v-col cols="3">
            <v-radio-group row v-model="viewMode">
              <v-radio :label="lantext.words.all[$store.state.lanType]" :value="1"></v-radio>
              <v-radio :label="lantext.words.contradictions[$store.state.lanType]" :value="2"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col align-self="center" cols="1">{{lantext.words.confidence[$store.state.lanType]}}</v-col>
          <v-col cols="1">
            <v-select v-model="lowerVal" :items="valueTable[0]"></v-select>
          </v-col>
          <v-col align-self="center" cols="1">——</v-col>
          <v-col cols="1">
            <v-select v-model="upperVal" :items="valueTable[lowerVal-1]"></v-select>
          </v-col>
        </v-row>
      </v-container>


    </v-container>
    <!--comments table-->
    <v-row>
      <v-col>
        <v-container fluid>
          <v-data-table
            class="elevation-1"
            :search="'no'"
            :loading="$store.state.startLoading>$store.state.endLoading"
            :headers="lantext.headers.viewHeaders[$store.state.lanType]"
            :custom-filter="customfilter3"
            :items="$store.state.commentTagValueList[dataSetIndex]"
            v-if="tagListValid"
            item-key="commentIndex">

            <template v-slot:item="{item}">
              <tr :style="{'background-color':item.comment_id === chosenCmtId?'#78ffd6':
                (item.totalCommentIndex % 2===0?'#f3f3f3':'') }">
                <td>
                <span >
                {{item.comment_id}}
                </span>
                </td>

                <td>
                  <span >
                  {{lantext.tagwords.tags[$store.state.lanType][item.tag_result]||"--"}}
                  </span>
                </td>
                <td>
                  <v-btn text @click="startOverlay(item)" :disabled="$store.state.startLoading!==$store.state.endLoading">
                    <v-icon>mdi-pen-plus</v-icon>
                    <v-main>{{tagResultModifying  && modifyPtr===item.commentIndex ?
                      lantext.words.finish[$store.state.lanType]:lantext.words.review[$store.state.lanType]}}</v-main>
                  </v-btn>
                </td>

                <td>
                  <!--有拓宽作用域的作用？？？-->
                  <v-btn text @click="chosenCmt = item, chosenCmtId = item.comment_id" outlined>
                    {{lantext.words.details[$store.state.lanType]}}
                  </v-btn>
                </td>

              </tr>
            </template>



<!--            <template v-slot:item.viewValue="{item, header, value}">-->
<!--             {{value}}-->
<!--              <span :style="{'background-color':item.comment_id === chosenCmtId?'green':'' }">-->
<!--                {{lantext.tagwords.tags[$store.state.lanType][item.tag_result]||"&#45;&#45;"}}-->
<!--              </span>-->

<!--            </template>-->
<!--            <template v-slot:item.details="{item}">-->
<!--              {{$store.state.reviewChosenCmt}}-->

<!--              &lt;!&ndash;有拓宽作用域的作用？？？&ndash;&gt;-->
<!--              <v-btn text @click="chosenCmt = item, chosenCmtId = item.comment_id">-->
<!--                {{lantext.words.details[$store.state.lanType]}}-->
<!--              </v-btn>-->
<!--            </template>-->
<!--            <template v-slot:item.view="{item}" >-->
<!--              <v-btn text @click="startOverlay(item)" :disabled="$store.state.startLoading!==$store.state.endLoading">-->
<!--                <v-icon>mdi-pen-plus</v-icon>-->
<!--                <v-main>{{tagResultModifying  && modifyPtr===item.commentIndex ?-->
<!--                  lantext.words.finish[$store.state.lanType]:lantext.words.review[$store.state.lanType]}}</v-main>-->
<!--              </v-btn>-->

<!--            </template>-->
          </v-data-table>
        </v-container>
      </v-col>
      <v-col>
        <v-container>

          <v-main class="text-h4">{{lantext.words.review_details[$store.state.lanType]}}</v-main>
          <v-main class="text-h5">
            {{lantext.words.comment_id[$store.state.lanType]}} :
            {{chosenCmtId}}
          </v-main>
              <v-data-table
                v-if="chosenCmt"
                :search="'no'"
                :custom-filter="customfilter1"
                :headers="lantext.headers.viewTagHeader[$store.state.lanType]"
                :items="chosenCmt.tagList.tags"
                hide-default-footer>
                <template v-slot:item.tag_value="{item}">
                  {{lantext.tagwords.tags[$store.state.lanType][item.tag_value]}}
                </template>
              </v-data-table>
        </v-container>
        <v-container>
              <v-textarea
                v-if="chosenCmt"
                outlined readonly :label="lantext.words.comment_word[$store.state.lanType]" v-model="chosenCmt.content"></v-textarea>
        </v-container>

      </v-col>
    </v-row>

    <v-overlay v-show="overlayValid" color="#eeeeee">
      <v-card  width="700"  light>
        <div>
          <v-btn @click="overlayValid = false" color="red" style="color:white;" absolute right>
            <span class="mdi mdi-close" ></span>
          </v-btn>
          <v-row>
            <v-col>
              <v-treeview
                dense
                open-all
                selectable
                v-model="treeviewSel"
                selected-color="red"
                :items="tagItems[$store.state.lanType]">

              </v-treeview>
            </v-col>
            <v-col>
              <v-container>
                <v-row>
                  <v-col>
                    <v-main class="font-weight-black text-h6" >
                      {{lantext.tagwords.tags[$store.state.lanType][treeviewSel]}}
                    </v-main>
                    <v-virtual-scroll
                      v-if="treeviewSel"
                      :items="lantext.tagwords.taghelpwords[$store.state.lanType][treeviewSel]"
                      :item-height="80"
                      height="450">
                      <template v-slot:default="{item}">
                        <v-card :color="item.id%2===0?'white':'grey'" height="100">
                          <span >{{item.name}}</span>
                        </v-card>
                      </template>
                    </v-virtual-scroll>
                  </v-col>

                </v-row>
              </v-container>
            </v-col>
          </v-row>
          <v-main style="text-align: center">
              <v-spacer></v-spacer>
              <v-btn style="justify-self: center" @click="reviewBtnClick(overlayItem)"
                     outlined color="primary">{{lantext.words.submit[$store.state.lanType]}}</v-btn>
              <v-spacer></v-spacer>
          </v-main>

        </div>

      </v-card>
    </v-overlay>

  </v-app>
</template>

<script>
  import lantext from "../lib/lantext";
    export default {
        name: "viewplace",
      props: {
        dataSetIndex:{
          type:Number,
          required:true,
        },
        enable:{
          type:Boolean,
          required:true,
        }
      },
      data:()=>({
        //static data
        chosenCmtId:null,
        chosenCmt:null,
        tagItems: [
            [
            {id:0, name:'Functional Requirement'},
              {id: 234, name: 'Non Functional Requirement',
                children: [{id: 1,name: 'Functional Suitability'},
                  {id: 2, name: 'Performance Efficiency'},
                  {id: 3, name: 'Compatibility'},
                  {id: 4, name: 'Usability'},
                  {id: 5, name: 'Security'},
                  {id: 6, name: 'Reliability'},
                  {id: 7, name: 'Maintainability'},
                  {id: 8, name: 'Portability'}]
              },
              {id: 141, name: 'Others',
                children: [
                  {id: 9, name: 'Bug_Fix'},
                  {id: 10, name: 'Others'},
                ]
              },
          ],
            [
              {id:0, name:'功能性需求'},
              {id: 234, name: '非功能性需求',
                children: [{id: 1, name: '适用性'},
                  {id: 2, name: '性能'},
                  {id: 3, name: '兼容性'},
                  {id: 4, name: '可用性'},
                  {id: 5, name: '安全性'},
                  {id: 6, name: '可靠性'},
                  {id: 7, name: '可维护性'},
                  {id: 8, name: '可移植性'}]
              },
              {id: 114, name: '其他',
                children: [
                  {id: 9, name: 'Bug修复'},
                  {id: 10, name: '其他'},
                ]
              },
            ],
        ],
        treeviewSel:[],

        lantext:lantext,
        tagListValid:false,

        overlayValid:false,
        overlayItem:null,

        valueTable:[['1','2','3','4','5'],['2','3','4','5'],['3','4','5'],['4','5'],['5']],
        lowerVal:'1',
        upperVal:'5',

        tagResultModifying:false,
        temp_tagResult:-1,
        temp_tagContent:'',
        modifyPtr:-1,

        tagsInfo:{
          colors:["teal", "green", "primary", "orange", "indigo", "red", "pink","purple"],
          text:['Performance','Compatibility', 'Usability','Security','Maintainability','Portability','Others','Functional'],
        },

        tagValue:0,
        tagPtr:-1,

        tag_need:0,
        tag_got:0,
        comment_pointer:-1,

        ptr:-1,

        //all the tag under all comments
        comments_list:[],
        comments_order:[],
        tags_list:[],
        contradict_list:{},//record the comment having contradict tags

        panel_value:[],

        viewMode:1, viewStatus:false,
        viewSearch:'',
        taghelp:'',


      }),

      watch: {

        treeviewSel(value){
          if (value.length>=2) this.treeviewSel = [this.treeviewSel[this.treeviewSel.length-1]];
        },

        enable: {
          handler(value) {
            console.log("enable", value);
            if (value) this.startReview();
          },
          immediate: true,
        },

        lowerVal:{
          handler(value){
            this.upperVal = String(Math.max(value, Number(this.upperVal)) );
          },
          immediate: true,
        }
      },
      methods:{

        showTag(tag_result){
          if (tag_result===-1) return lantext.words.none[this.$store.state.lanType];
          else return lantext.tagwords.tags[this.$store.state.lanType][tag_result];
        },

        startOverlay(item){
          this.overlayValid = true;
          this.overlayItem = item;
          this.treeviewSel = [item.tag_result];
        },

        goBack(){
          this.$emit("goBack",true);
        },

        startReview(){
          let timer = setInterval(()=>{this.totalStartTime += 1},1000);
          this.tagListValid = true;
        },

        customfilter1(value,search,item){
          return item.confidence >= Number(this.lowerVal) && item.confidence <= Number(this.upperVal)
        },

        customfilter2(value,search,item){
          return this.$store.state.commentTagValueList[this.dataSetIndex][item.totalCommentIndex].tagValueList.length > 1;
        },

        customfilter3(value,search,item){
          let flag = false;
          item.tagList.tags.forEach(tag =>{
            if (tag.confidence >= Number(this.lowerVal) && tag.confidence <= Number(this.upperVal) ){
              flag = true;
            }
          });
          if (this.viewMode===2){
            flag = this.$store.state.commentTagValueList[this.dataSetIndex][item.totalCommentIndex].tagValueList.length > 1;
          }
          return flag;
        },

        sendView(comment, tag_result){
          console.log(comment, tag_result)
          var date = new Date();
          let formData3 = new FormData()
          formData3.append("datetime_info",date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());
          formData3.append('comment_id',comment.comment_id);
          formData3.append('tag_result',tag_result);

          this.axios.put('http://121.40.238.237:8080/comments/',formData3)
            .then((response)=>{
              console.log(response)
              if (response.data.new_tag_result){
                this.$message.success(
                  lantext.words.view[this.$store.state.lanType] + lantext.sentences.item_success[this.$store.state.lanType]
                );
                this.$store.state.dataTree[comment.dataSetIndex].commentList.comments[comment.commentIndex]["tag_result"] = tag_result;
                this.$store.state.commentTagValueList[comment.dataSetIndex][comment.totalCommentIndex].tag_result = tag_result;
              }
              else this.$message.error(
                lantext.words.view[this.$store.state.lanType] + lantext.sentences.item_failed[this.$store.state.lanType]
              );
            })
          .catch(error => console.log(error));
        },

        reviewBtnClick(comment){
          this.sendView(comment, this.treeviewSel[0]);
        },

      },



      beforeRouteLeave (to, from, next) {
        if (this.comment_pointer!==-1){
          if (confirm(lantext.sentences.exit_work[this.$store.state.lanType]) ) {
            this.$store.state.workstatus = false;
            next()
          }
        }
        else next()
      }
    }
</script>

<style scoped>

</style>
