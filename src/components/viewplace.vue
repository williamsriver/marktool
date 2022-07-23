<template>

  <v-app v-if="$store.state.user_level === 1">
    <!--mode radio & search tab-->
    <v-container fluid>

      <!--      go back-->
      <v-row>
        <v-btn text @click="$store.state.workStatus = false">
          <v-icon>mdi-arrow-left</v-icon>
          <v-main>{{lantext.words.back[$store.state.lanType]}}</v-main>
        </v-btn>
      </v-row>

      <!--select reviewing mode-->
      <v-container fluid class="ma-0 pa-0">
        <v-row align-content="center" class="ma-0 pa-0">
          <v-col cols="3">
            <v-main>
              <v-radio-group row v-model="viewMode">
                <v-radio :label="lantext.words.all[$store.state.lanType]" :value="1"></v-radio>
                <v-radio :label="lantext.words.contradictions[$store.state.lanType]" :value="2"></v-radio>
              </v-radio-group>
            </v-main>
          </v-col>

          <v-col align-self="center" cols="2">
            <v-main>
              {{lantext.words.confidence[$store.state.lanType]}}
            </v-main>
          </v-col>

          <v-col cols="3">
            <v-row>
              <v-col>
                <v-select v-model="lowerVal" :items="valueTable[0]" ></v-select>
              </v-col>

              <v-col align-self="center">-</v-col>
              <v-col>
                <v-select v-model="upperVal" :items="valueTable[lowerVal-1]"></v-select>
              </v-col>


            </v-row>
          </v-col>

        </v-row>
      </v-container>

    </v-container>

    <!--comments table-->
    <v-row>
      <v-col>
        <v-container fluid>
          <!--            数据集表-->
          <v-simple-table :height="300" v-if="$store.state.workStatus">
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">{{lantext.words.tag_id[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.recommended_value[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.review[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.details[$store.state.lanType]}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in
              $store.state.list.chosen_dataset_tag_id_list" :key="item">
                <!--                Tag Id-->
                <td>{{ item }}</td>
                <!--                recommended Value-->
                <td>{{ $store.state.map.tag_map.has(item) ?
                  　get_recommended_name($store.state.map.tag_map.get(item).tag_value) : '' }}</td>
                <!--                View-->
                <td>
                  <v-btn text @click="startOverlay(item)" :disabled="$store.state.startLoading!==$store.state.endLoading">
                    <v-icon>mdi-pen-plus</v-icon>
                    <v-main>{{tagResultModifying  && modifyPtr===item.commentIndex ?
                      lantext.words.finish[$store.state.lanType]:lantext.words.review[$store.state.lanType]}}</v-main>
                  </v-btn>
                </td>
                <!--                Details-->
                <td>
                  <v-btn text @click="chosen_comment_id = $store.state.map.tag_map.get(item).comment_id" outlined>
                    {{lantext.words.details[$store.state.lanType]}}
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
      </v-col>
      <v-col>
        <v-container v-if="chosen_comment_id">
          <v-main class="text-h4">{{lantext.words.review_details[$store.state.lanType]}}</v-main>
          <v-main class="text-h5">
            {{lantext.words.comment_id[$store.state.lanType]}} : {{chosen_comment_id}}
          </v-main>
<!--              <v-data-table-->
<!--                v-if="chosen_comment_id"-->
<!--                :search="'no'"-->
<!--                :custom-filter="customfilter1"-->
<!--                :headers="lantext.headers.viewTagHeader[$store.state.lanType]"-->
<!--                :items="$store.state.map.comment_map.tagList.tags"-->
<!--                hide-default-footer>-->
<!--                <template v-slot:item.tag_value="{item}">-->
<!--                  {{lantext.tagwords.tags[$store.state.lanType][item.tag_value]}}-->
<!--                </template>-->
<!--              </v-data-table>-->
          <v-simple-table :height="200">
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">{{lantext.words.coder[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.confidence[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.tag_value[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.rationale[$store.state.lanType]}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in $store.state.map.comment_tag_map.get(chosen_comment_id)" :key="item">
                <!--                Coder-->
                <td>{{ $store.state.map.tag_map.get(item).tag_user_info }}</td>
                <!--                Confidence-->
                <td>{{$store.state.map.tag_map.get(item).confidence}}</td>
                <!--                Tag Value-->
                <td>{{ $store.state.map.tag_map.has(item) ?
                  　$store.state.map.tag_map.get(item).tag_value : '' }}</td>
                <!--                Rationale-->
                <td>{{$store.state.map.tag_map.get(item).rationale}}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>

          <v-textarea
            outlined readonly
            :label="lantext.words.comment_word[$store.state.lanType]"
            v-model="$store.state.map.comment_map.get(chosen_comment_id).content"></v-textarea>
        </v-container>
      </v-col>
    </v-row>

    <v-overlay v-if="overlayValid" color="#eeeeee">
      <v-card  width="700" height="auto"  light>
        <div>
          <v-btn @click="overlayValid = false" color="red" style="color:white;" absolute right>
            <span class="mdi mdi-close" ></span>
          </v-btn>
          <v-sheet height="50px"></v-sheet>

          <v-card-title>{{lantext.words.review_value[$store.state.lanType]}}
            :{{review_selection ? get_recommended_name(review_selection.value) : '--'}}</v-card-title>
          <v-row>
            <v-col>
              <v-container
                style="height: 150px"
                class="overflow-y-auto">
                <v-main
                  v-for="index in $store.state.chosen_tag_category.object.tags.length"
                  :key="index">
                  <v-chip
                    :color="$store.state.colors[index-1]"
                    class="ma-2" dark
                    @click="chooseTag(index-1)">
                    <v-avatar left
                              v-if="review_selection &&
                          review_selection.tag_value===$store.state.chosen_tag_category.object.tags[index-1].value">
                      <v-icon>mdi-checkbox-marked-circle</v-icon>
                    </v-avatar>
                    {{$store.state.chosen_tag_category.object.tags[index-1]
                    .reference[$store.state.lanType === 0?'en':'ch']}}
                  </v-chip>
                </v-main>
              </v-container>
            </v-col>
            <v-col>
              <v-card-text class="elevation-1">
                <!--                  chosen tag's name-->
                <v-main>{{review_selection ? review_selection.tag_value : '--'}}</v-main>
                <!--                  chosen tag's description-->
                <v-virtual-scroll
                  :items="['example_one_item']"
                  :height="150"
                  :item-height="450">
                  <template v-slot:default="{item}">
                    <v-card height="auto">
                      <div v-html="chosen_tag_description"></div>
                    </v-card>
                  </template>
                </v-virtual-scroll>
              </v-card-text>
            </v-col>
          </v-row>
          <v-main style="text-align: center">
              <v-spacer></v-spacer>
              <v-btn style="justify-self: center" @click="reviewBtnClick()"
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
        // enable:{
        //   type:Boolean,
        //   required:true,
        // }
      },
      data:()=>({
        //static data
        chosen_comment_id:null,
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

        review_selection:null,
        review_index:-1,
        chosen_tag_description:null,

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

        // treeviewSel(value){
        //   if (value.length>=2) this.treeviewSel = [this.treeviewSel[this.treeviewSel.length-1]];
        // },

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
        change_chosen_tag_description(){
          if (!this.currentTag) this.chosen_tag_description = '--'

          var desc_index = -1
          this.$store.state.chosen_tag_category.object.tags.forEach((tag, index)=>{
            if (tag.value === this.review_selection.value) desc_index = index
          })
          // console.log(this.currentTag.tag_value, "index", desc_index)
          if (desc_index === -1) this.chosen_tag_description = "--"
          else {
            this.chosen_tag_description = this.$store.state.chosen_tag_category.object.tags[desc_index]
              .description[this.$store.state.lanType === 0 ? 'en' : 'ch']
          }
        },

        chooseTag(index){
          this.review_selection = this.$store.state.chosen_tag_category.object.tags[index]
          this.review_index = index
          this.change_chosen_tag_description()
          this.isSaved = false
        },

        get_recommended_name(tag_value){
          let res = null;
          this.$store.state.chosen_tag_category.object.tags.forEach((tag)=>{
            if (tag.value === tag_value){
              res = tag.reference[this.$store.state.lanType===0?'en':'ch'];
            }
          })
          if (!res) return tag_value;
          else return res;
        },

        showTag(tag_result){
          if (tag_result===-1) return lantext.words.none[this.$store.state.lanType];
          else return lantext.tagwords.tags[this.$store.state.lanType][tag_result];
        },

        startOverlay(item){
          this.overlayValid = true;
          this.overlayItem = item;
          // this.treeviewSel = [item.tag_result];
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
          // let tag_index = this.$store.state.
          formData3.append("datetime_info",date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());
          formData3.append('comment_id',comment.comment_id);
          formData3.append('tag_result',tag_result);

          this.axios.put('/comments/',formData3)
            .then((response)=>{
              console.log(response)
              if (response.data.new_tag_result){
                this.$message.success(
                  lantext.words.view[this.$store.state.lanType] + lantext.sentences.item_success[this.$store.state.lanType]
                );
                // this.$store.state.dataTree[comment.dataSetIndex].commentList.comments[comment.commentIndex]["tag_result"] = tag_result;
                // this.$store.state.commentTagValueList[comment.dataSetIndex][comment.totalCommentIndex].tag_result = tag_result;
              }
              else this.$message.error(
                lantext.words.view[this.$store.state.lanType] + lantext.sentences.item_failed[this.$store.state.lanType]
              );
            })
          .catch(error => console.log(error));
        },

        reviewBtnClick(){
          console.log(this.overlayItem)
          this.sendView(this.$store.state.map.tag_map.get(this.overlayItem), this.review_index);
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
