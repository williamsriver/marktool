<template>
  <v-app>
    <v-container fluid>
      <v-data-table
        :loading="$store.state.startLoading>$store.state.endLoading"
        :headers="lantext.headers.ItemListHeaderWithKappa[$store.state.lanType]"
        :items="$store.state.dataTree"
        :items-per-page="5"
        v-if="isDataAlive"
      >
        <template v-slot:item.uploadUserName="{item}">
          {{$store.state.currentuser}}
        </template>
        <template v-slot:item.tagged="{item}">
              <span v-show="item.commentList">
                {{item.commentList.tagged}}/{{item.commentList.commentIdList.length}}
              </span>
        </template>
        <template v-slot:item.buttons="{item}">
          <v-btn @click="setChart(item)" text :disabled="item.commentList.tagged===0">
            <v-icon>mdi-chart-pie</v-icon>
            {{lantext.words.graph[$store.state.lanType]}}
          </v-btn>
        </template>
        <template v-slot:item.kappa="{item}" v-if="$store.state.user_level===1">
          <v-btn @click="updateKappa(item.dataSetIndex)" text outlined
          :disabled="item.commentList.tagged===0">{{lantext.words.update[$store.state.lanType]}}</v-btn>
          <span>{{item.kappa}}</span>
        </template>
      </v-data-table>
    </v-container>
    <v-container fluid>
      <v-row>
        <v-col cols="5">
          <div style="text-align: center">{{lantext.sentences.tags_distribution_chart1[$store.state.lanType]}}</div>
          <div id="chartshow2" style="width: 400px;"></div>
        </v-col>
        <v-col>
          <div style="text-align: center">{{lantext.sentences.tags_distribution_chart2[$store.state.lanType]}}</div>
          <div style="text-align: center" v-if="list_choosen>=0">
            {{$store.state.user_level===0?lantext.words.mark_process[$store.state.lanType]
              :lantext.words.review_process[$store.state.lanType]}}
            {{$store.state.user_level===0?$store.state.dataTree[list_choosen].commentList.tagged
              :reviewed_comments}}
                /{{$store.state.dataTree[list_choosen].commentList.commentIdList.length}}
          </div>
          <div id="chartshow" style="width: 700px"></div>
        </v-col>
      </v-row>
    </v-container>




  </v-app>
</template>

<script>
  import Highcharts from 'highcharts/highstock';
  import HighchartsMore from 'highcharts/highcharts-more';
  import HighchartsDrilldown from 'highcharts/modules/drilldown';
  import Highcharts3D from 'highcharts/highcharts-3d';

  HighchartsMore(Highcharts)
  HighchartsDrilldown(Highcharts);
  Highcharts3D(Highcharts);
  import lantext from "../lib/lantext";
  import GetFile from "./getFile";
  import upfile from "./upfile";
  import allDatasetTable from "./allDatasetTable";
    export default {
        name: "dataplace",
      props:{
        enable:{
          type:Boolean,
          required:true,
        }
      },
      components: {GetFile, upfile,allDatasetTable},
      data:()=>({
        isDataAlive:true,
        reviewed_comments:0,
        appeared_comments_list:[],//record all the comments appeared in those tags
        tags_for_every_comment_list:[],//put all the tags into their respective belonged comment
        contradictions_number:0,//the number of contradicting tags

        lantext:lantext,
        list_choosen:-1,
        chart1:'',
        chart2:'',
        current_app_name:'',
        chart1_config:{
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text:''
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.y}({point.percentage:.1f} %)',
                style: {
                  color: (Highcharts.theme && Highcharts.theme.contrastTextColor)
                }
              },
              showInLegend: true
            }
          },
          colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00',
            '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
          series: [{
            name:"Functional",
            colorByPoint: true,
            data: [
              //{name:'Functional_requirements',y:0,},

              {name:'Functional Suitability',y:0},
              {name:'Performance Efficiency',y:0},
              {name:'Compatibility',y:0},
              {name:'Usability',y:0},
              {name:'Security',y:0},
              {name:'Reliability',y:0},
              {name:'Maintainability',y:0},
              {name:'Portability',y:0},
              {},
              {},
              {},
              {name:'Contradictions', y:0}

              //{name:'Bug_Fix',y:0},
              //{name:'Others',y:0},
            ]
          }]
        },
        chart2_config:{
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text:''
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f} %)',
                style: {
                  color: (Highcharts.theme && Highcharts.theme.contrastTextColor)
                }
              },
              showInLegend: true
            }
          },
          colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00',
            '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
          series: [{
            colorByPoint: true,

            data: [
              {name:'Functional_requirements',y:0},
              {name:'Non_Functional_requirements',y:0},
              {name:'Others',y:0},
            ]
          }]
        },
      }),
      watch:{
        enable:{
          handler(value){
            if (value) console.log(value);
          },
          immediate:true
        }
      },
      mounted() {
        this.chart1 = Highcharts.chart('chartshow',this.chart1_config);
        this.chart2 = Highcharts.chart('chartshow2',this.chart2_config);
      },
      methods:{
        setChart(dataset){
          //record chosen dataset
          this.list_choosen = dataset.dataSetIndex;

          //set names for charts
          for (let j=0;j<this.chart1_config.series[0].data.length;j++){
            this.chart1_config.series[0].data[j].name = lantext.tagwords.tags[this.$store.state.lanType][j];
            this.chart1_config.series[0].data[j].y = 0
          }
          for (let j=0;j<this.chart2_config.series[0].data.length;j++){
            this.chart2_config.series[0].data[j].y = 0
            this.chart2_config.series[0].data[j].name = lantext.tagwords.class[this.$store.state.lanType][j];
          }


          if (this.$store.state.user_level===0){
            //contradiction statistics clearing
            // this.contradictions = 0
            // this.appeared_comments_list = []
            // this.tags_for_every_comment_list = []
            //

            // function count(arr, item) {
            //   return arr.reduce((prev,curr)=> curr === item ? prev+1 : prev, 0);
            // }

            this.$store.state.tagsList[dataset.dataSetIndex].forEach(tag =>{
              if (tag.tag_user_info === this.$store.state.currentuser){
                if (this.$store.state.dataTree[dataset.dataSetIndex].commentList
                  .comments[tag.commentIndex].tagList.tagIdList.length > 1){
                  this.chart1_config.series[0].data[this.chart1_config.series[0].data.length-1].y += 1;
                }
                else {
                  let temp_num = this.getTagValue(tag);
                  if (temp_num>=1 && temp_num <=8) this.chart1_config.series[0].data[temp_num-1].y++;
                  if (temp_num === 0 ) this.chart2_config.series[0].data[0].y++;
                  else if (temp_num >= 9) this.chart2_config.series[0].data[2].y++;
                  else if (temp_num>0) this.chart2_config.series[0].data[1].y++;
                }
              }
            });

            //data from tags
            // this.$store.state.tagsList[dataset.dataSetIndex].forEach(tag =>{
            //   if (this.appeared_comments_list.indexOf(tag.comment_id) === -1 &&
            //       currentuser_labeled_comment_list.indexOf(tag.comment_)){
            //     //a new comment
            //     this.appeared_comments_list.push(tag.comment_id)
            //     this.tags_for_every_comment_list.push([tag])
            //   }
            //   else{
            //     //contradictions, all the tags belonged to this certain comment will be classified as contradictions
            //     this.tags_for_every_comment_list[this.appeared_comments_list.indexOf(tag.comment_id)].push(tag)
            //   }
            // });
            //
            // this.tags_for_every_comment_list.forEach(comment_unit=>{
            //   if (comment_unit.length === 1){
            //     let temp_num = this.getTagValue(comment_unit[0]);
            //     if (temp_num>=1 && temp_num <=8) this.chart1_config.series[0].data[temp_num-1].y++;
            //     if (temp_num === 0 ) this.chart2_config.series[0].data[0].y++;
            //     else if (temp_num >= 9) this.chart2_config.series[0].data[2].y++;
            //     else if (temp_num>0) this.chart2_config.series[0].data[1].y++;
            //   }
            //   else this.chart1_config.series[0].data[this.chart1_config.series[0].data.length-1].y += comment_unit
            //   //只记一个人
            // })
          }
          else{//reviewers
            //data from commentTagValueList
            this.reviewed_comments = 0
            this.$store.state.commentTagValueList[dataset.dataSetIndex].forEach(comment => {
              if (comment.tag_result !== -1) {
                this.reviewed_comments++;
                let temp_num = comment.tag_result;
                if (temp_num >= 1 && temp_num <= 8) this.chart1_config.series[0].data[temp_num - 1].y++;
                if (temp_num === 0) this.chart2_config.series[0].data[0].y++;
                else if (temp_num >= 9) this.chart2_config.series[0].data[2].y++;
                else if (temp_num > 0) this.chart2_config.series[0].data[1].y++;
              }
            })

          }

          //render
          this.chart1 = Highcharts.chart('chartshow',this.chart1_config);
          this.chart2 = Highcharts.chart('chartshow2',this.chart2_config);

        },


        getTagValue(item){
          let result = -1;
          if (!item) return result;
          lantext.tagwords.tags[0].forEach((prop_name,index) =>{
            if (item[prop_name]) result = index;
          });
          return result;
        },


        updateKappa(dataSetIndex){

          let dataSet = this.$store.state.dataTree[dataSetIndex]
          let userList = []
          let userListTagNumber = []
          dataSet.commentList.comments.forEach((comment, tagIndex) =>{
            if (comment.tagList.tags.length > 0){
              comment.tagList.tags.forEach(tag =>{
                let index = userList.indexOf(tag.tag_user_info);
                if (index===-1){
                  userList.push(tag.tag_user_info);
                  userListTagNumber.push({
                    userInfo:tag.tag_user_info,
                    frequency:1,
                    tagsIndex:[tagIndex],
                    tagsValues:[tag.tag_value],
                  });
                }
                else{
                  userListTagNumber[index].frequency++;
                  userListTagNumber[index].tagsValues.push(tag.tag_value);
                  userListTagNumber[index].tagsIndex.push(tagIndex);
                }

              })
            }
          })
          userListTagNumber.sort((a,b)=> b.frequency-a.frequency);
          console.log(userListTagNumber)
          let kappa_1, kappa_2
          if (userListTagNumber.length >= 2){
            kappa_1 = userListTagNumber[0]
            kappa_2 = userListTagNumber[1]
            let sameNum = 0
            let totalNum = 0
            dataSet.commentList.comments.forEach((comment, index) =>{
              if (kappa_1.tagsIndex.indexOf(index)!==-1 && kappa_2.tagsIndex.indexOf(index)!==-1){
                totalNum++;
                if (kappa_1.tagsValues[kappa_1.tagsIndex.indexOf(index)] ===
                  kappa_2.tagsValues[kappa_2.tagsIndex.indexOf(index)]) sameNum++;
              }
            })
            console.log(sameNum, totalNum)
            if (totalNum>0) this.$store.state.dataTree[dataSetIndex].kappa = sameNum/totalNum
            else this.$store.state.dataTree[dataSetIndex].kappa = "--"
            this.isDataAlive = false
            this.$nextTick(()=>{
              this.isDataAlive =true
            })
          }
          else this.$store.state.dataTree[dataSetIndex].kappa = "--"
        }
      }
    }
</script>

<style scoped>

</style>
