<template>
  <v-app>
    <v-container fluid>
      <v-data-table
        :loading="$store.state.startLoading>$store.state.endLoading"
        :headers="lantext.headers.ItemListHeader[$store.state.lanType]"
        :items="$store.state.dataTree"
        :items-per-page="5"
      >
        <template v-slot:item.uploadUserName="{item}">
          {{$store.state.currentuser}}
        </template>
        <template v-slot:item.buttons="{item}">
          <v-btn @click="setChart(item)" text>
            <v-icon>mdi-database</v-icon>
            {{lantext.words.look[$store.state.lanType]}}
          </v-btn>
        </template>
      </v-data-table>
    </v-container>
    <v-container fluid>
      <v-row>
        <v-col>
          <div id="chartshow2"></div>
        </v-col>
        <v-col>
          <div id="chartshow"></div>
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
  import store from "../store";
    export default {
        name: "dataplace",
      props:{
        enable:{
          type:Boolean,
          required:true,
        }
      },
      data:()=>({
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
            text: 'NFR类型标签分布情况'
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
              {name:'Functional_requirements',y:0},

              {name:'Functional Suitability',y:0},
              {name:'Performance Efficiency',y:0},
              {name:'Compatibility',y:0},
              {name:'Usability',y:0},
              {name:'Security',y:0},
              {name:'Reliability',y:0},
              {name:'Maintainability',y:0},
              {name:'Portability',y:0},

              {name:'Bug_Fix',y:0},
              {name:'Others',y:0},
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
          this.list_choosen = dataset.dataSetIndex;
          for (let j=0;j<this.chart1_config.series[0].data.length;j++){
            this.chart1_config.series[0].data[j].name = lantext.tagwords.tags[this.$store.state.lanType][j];
            this.chart1_config.series[0].data[j].y = 0
          }
          for (let j=0;j<this.chart2_config.series[0].data.length;j++){
            this.chart2_config.series[0].data[j].y = 0
            this.chart2_config.series[0].data[j].name = lantext.tagwords.class[this.$store.state.lanType][j];
          }

          this.chart2_config.title.text = "标签分布情况"
          this.$store.state.tagsList[dataset.dataSetIndex].forEach(tag =>{


            let temp_num = this.getTagValue(tag);
            //console.log(tag, temp_num);
            if (temp_num>=0) this.chart1_config.series[0].data[temp_num].y++;
            if (temp_num === 0 ) this.chart2_config.series[0].data[0].y++;
            else if (temp_num >= 9) this.chart2_config.series[0].data[2].y++;
            else if (temp_num>0) this.chart2_config.series[0].data[1].y++;
          });

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
      }
    }
</script>

<style scoped>

</style>
