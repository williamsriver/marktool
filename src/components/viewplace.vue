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
            viewMode{{viewMode}}
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
          <v-simple-table
            :height="300"
            v-show="viewMode === 1 &&
            $store.state.workStatus &&
             tableFresh">
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">{{lantext.words.comment_id[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.recommended_value[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.review[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.details[$store.state.lanType]}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in $store.state.list.chosen_dataset_comment_id_list" :key="item">
                <!--                Comment Id-->
                <td>{{ item }}</td>
                <!--                recommended Value-->
                <td>{{get_recommended_name($store.state.map.comment_map.get(item).title)
                  || '--'}}</td>
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
                  <v-btn text @click="chosen_comment_id = item"
                         :disabled="item ?
                         (!($store.state.map.comment_tag_map.get(item)
                         && $store.state.map.comment_tag_map.get(item)[0].length > 0)
                         || $store.state.map.comment_tag_map.get(item).length === 1 && viewMode === 2)
                         : false" outlined>
                    {{lantext.words.details[$store.state.lanType]}}
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>

          <v-simple-table
            :height="300"
            v-show="viewMode === 2 &&
            $store.state.workStatus &&
            tableFresh">
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">{{lantext.words.comment_id[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.recommended_value[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.review[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.details[$store.state.lanType]}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in contradicted_comment_id_list" :key="item">
                <!--                Comment Id-->
                <td>{{ item }}</td>
                <!--                recommended Value-->
                <td>{{get_recommended_name($store.state.map.comment_map.get(item).title)
                  || '--'}}</td>
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
                  <v-btn text @click="chosen_comment_id = item"
                         :disabled="item ?
                         (!($store.state.map.comment_tag_map.get(item)
                         && $store.state.map.comment_tag_map.get(item)[0].length > 0)
                         || $store.state.map.comment_tag_map.get(item).length === 1 && viewMode === 2)
                         : false" outlined>
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
<!--          {{$store.state.map.comment_map.get(chosen_comment_id)}}-->
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
              <tr v-for="item in validTags" :key="item">
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

          <v-card-title>
            {{lantext.words.review_value[$store.state.lanType]}}:
            {{review_translate.join(',')}}</v-card-title>
          <v-row>
            <v-col>
              <v-container
                style="height: 150px"
                class="overflow-y-auto">

                <div class="d-flex flex-nowrap align-content-center justify-start"
                     v-for="index in $store.state.chosen_tag_category.object.tags.length"
                     :key="index">
                  <v-checkbox
                    class="align-self-center"
                    v-model="review_value"
                    :value="$store.state.chosen_tag_category.object.tags[index-1].value"
                  ></v-checkbox>
                  <v-chip
                    dark
                    :color="$store.state.colors[index-1]"
                    class="align-self-center"
                    @click="load_tag_description(index-1)">
                    {{$store.state.chosen_tag_category.object.tags[index-1]
                    .reference[$store.state.lanType === 0?'en':'ch']}}
                  </v-chip>
                </div>
              </v-container>
            </v-col>
            <v-col>
              <v-card-text class="elevation-1">
                <!--                  chosen tag's description-->
                <v-virtual-scroll
                  :items="['example_one_item']"
                  :height="150"
                  :item-height="450">
                  <template v-slot:default="{item}">
                    <v-card height="auto">
                      <div v-html="review_description"></div>
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
        lantext,
        review_description:"",
        chosen_comment_id:null,
        review_value:[],
        chosen_tag_description:null,
        tagListValid:false,
        overlayValid:false,
        overlayItem:null,
        valueTable:[['1','2','3','4','5'],['2','3','4','5'],['3','4','5'],['4','5'],['5']],
        lowerVal:'1',
        upperVal:'5',
        tagResultModifying:false,
        modifyPtr:-1,
        viewMode:1,
        tableFresh:true,
        value_index_map:null,
        contradicted_comment_id_list:null,

        all_comment_id_list:[],
      }),
      mounted() {
          console.log('mounted');
        //标签值到tagMap中index的映射
        this.value_index_map = new Map();
        this.$store.state.chosen_tag_category.object.tags.forEach((val, index) =>{
          this.value_index_map.set(val.value, index);
        });

        //完整的评论列表和存在矛盾的comment列表
        console.log(this.$store.state.list.chosen_dataset_comment_id_list)
        this.contradicted_comment_id_list = this.$store.state.list.chosen_dataset_comment_id_list.filter(
          comment_id =>{
            let tag_id_list = this.$store.state.map.comment_tag_map.get(comment_id);
            // console.log("contra", tag_id_list)
            let vals = tag_id_list.map(tag_id=>
              this.$store.state.map.tag_map.get(tag_id).tag_value);
            vals = vals.filter(val => !!val);
            return [...new Set(vals)].length !== 1;
          }
        );

        console.log(this.contradicted_comment_id_list)



        // this.contradictions = this.allTags.filter(tag_id=>{
        //   return this.contradicted_comment_id_list
        //     .indexOf(this.$store.state.map.tag_map.get(tag_id).comment_id) !== -1;
        // })

      },
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
      computed:{
        review_translate(){
          let vals = [];

          this.review_value.forEach(val =>{
            let index = this.value_index_map.get(val);
            vals.push(this.$store.state.chosen_tag_category.object.tags[index]
              .reference[this.$store.state.lanType === 0?'en':'ch']);
          });
          return vals;
        },
        validTags(){
          return this.$store.state.map.comment_tag_map.get(this.chosen_comment_id)
            .filter(tag_id => !!this.$store.state.map.tag_map.get(tag_id).tag_value);
        }
      },
      methods:{
        get_recommended_name(comment_title){
          let info = comment_title.split('&');
          if (info.length <= 1) return '--';
          let vals = info[1].split(',');
          if (vals[0] === '') return;
          //映射
          vals = vals.map(val =>this.$store.state.chosen_tag_category
            .object.tags[this.value_index_map.get(val)]
            .reference[this.$store.state.lanType===0?'en':'ch']);
          return vals.join(',');
        },

        load_tag_description(index){
          if (index >=0 && index < this.$store.state.chosen_tag_category.object.tags.length){
            this.review_description =
              this.$store.state.chosen_tag_category.
                object.tags[index].description[this.$store.state.lanType === 0 ? 'en' : 'ch'];
          }
          else this.chosen_tag_description = "--";
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

        sendView(comment, tag_result){
          console.log(comment, tag_result)
          if (tag_result instanceof Array) tag_result = tag_result.join(',');
          var date = new Date();
          let formData3 = new FormData()
          // let tag_index = this.$store.state.
          formData3.append("datetime_info",date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());
          formData3.append('comment_id',comment.comment_id);
          formData3.append('title',comment.title.split('&')[0] + '&' + tag_result );

          this.axios.put('/comments/',formData3)
            .then((response)=> {
              console.log(response);
              this.$message.success(
                lantext.words.view[this.$store.state.lanType] +
                lantext.sentences.item_success[this.$store.state.lanType]
              );
              //刷新列表
              this.tableFresh = false
              setTimeout(() => {
                this.tableFresh = true
              }, 1000);
            })
          .catch(error => console.log(error));
        },

        reviewBtnClick(){
          console.log(this.overlayItem)
          this.sendView(
            this.$store.state.map.comment_map.get(this.overlayItem),
            this.review_value
          );
        },

      },
    }
</script>

<style scoped>

</style>
