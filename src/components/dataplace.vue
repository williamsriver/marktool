<template>
  <v-app>
    <v-container fluid>
      <v-data-table
        :headers="lantext.headers.ItemListHeader[$store.state.lanType]"
        :items="$store.state.apps"
        hide-default-footer>
        <template v-slot:item.buttons="{item}">
          <v-btn @click="setChart(item)" text>
            <v-icon>mdi-database</v-icon>
            {{lantext.words.look[$store.state.lanType]}}
          </v-btn>
        </template>
      </v-data-table>
    </v-container>
    <v-container fluid>
      <v-row justify="center">
        <span class="text-center text-h4">{{current_app_name}}</span>
      </v-row>

      <v-row>
        <v-col>
          <div id="chartshow"></div>
        </v-col>
        <v-col>
          <div id="chartshow2"></div>
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

  import * as echarts from 'echarts';
  import lantext from "../lib/lantext";
    export default {
        name: "dataplace",
      data:()=>({
        lantext:lantext,
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
            text: '功能分布'
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: false
              },
              showInLegend: true
            }
          },
          series: [{
            colorByPoint: true,

            data: [
              {name:'Performance',y:0},
              {name:'Compatibility',y:0},
              {name:'Usability',y:0},
              {name:'Security',y:0},
              {name:'Maintainability',y:0},
              {name:'Portability',y:0},
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
            text: ''
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: false
              },
              showInLegend: true
            }
          },
          series: [{
            colorByPoint: true,

            data: [
              {name:'Others',y:0},
              {name:'Functional_requirements',y:0},
              {name:'Non_Functional_requirements',y:0},
            ]
          }]
        },
      }),
      created() {
        if (this.$store.state.tags.length === 0) this.reget()
      },
      mounted() {
        this.chart1 = Highcharts.chart('chartshow',this.chart1_config);
        this.chart2 = Highcharts.chart('chartshow2',this.chart2_config);
      },
      methods:{
        setChart(app){
          this.current_app_name = app.name
          for (var j=0;j<this.chart1_config.series[0].data.length;j++){
            this.chart1_config.series[0].data[j].y = 0
          }
          this.chart2_config.title.text = lantext.words.tag_type[this.$store.state.lanType]
          for (var i=0;i< this.$store.state.tags.length;i++){
            if ( app.comments_id_list.indexOf(this.$store.state.tags[i].comment_id) !==-1 ){
              let result = this.$store.state.tags[i].tag_choose
              if (result <= 5) {
                this.chart2_config.series[0].data[2].y++;
                this.chart1_config.series[0].data[ result ].y++;
              }
              else {
                this.chart2_config.series[0].data[ result-6 ].y++;
              }
            }
          }
          this.chart1 = Highcharts.chart('chartshow',this.chart1_config);
          this.chart2 = Highcharts.chart('chartshow2',this.chart2_config);
        },


        reget(){
          for (var i = 0; i < this.$store.state.comments.length; i++) {
            this.getTags( this.$store.state.comments[i].tag_id_list.split(','), this.$store.state.comments[i].comment_id )
          }
        },

        findCmt(comment_id){
          for (var i=0;i<this.$store.state.comments.length;i++){
            if (this.$store.state.comments[i].comment_id === comment_id){
              return this.$store.state.comments[i]
            }
          }
          return -1;
        },

        getTags(list,comment_id){

          for (var i = 0; i < list.length; i++) {
            if (!!list[i]) {
              this.tag_need ++;
              this.axios.get('http://tonycoder.ziqiang.net.cn:8080/tag/', {params: {tag_id: list[i]}})
                .then(function (response) {
                  if (response.data.Msg === "OK") {
                    this.tag_got ++;
                    //judge which tag is marked
                    let tag_choose = -1
                    for (var i = 0; i < lantext.tagwords.tags[0].length; i++) {
                      if (response.data.Details[lantext.tagwords.tags[0][i]]) {
                        tag_choose = i;
                        break;
                      }
                    }

                    this.$store.state.tags.push({
                      comment_id:comment_id,
                      tag_id: response.data.Details.tag_id,
                      tag_choose: tag_choose,
                    })

                  }
                }.bind(this))
            }
          }

        },
      }
    }
</script>

<style scoped>

</style>
