<template>
  <v-app>
    <v-container fluid>
      <v-simple-table
        style="height: 240px"
        class="overflow-y-auto"
        v-if="isDataAlive" >
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">Id</th>
            <th class="text-left">FileName</th>
            <th class="text-left">Category</th>
            <th class="text-left">Kappa Value</th>
            <th class="text-left"></th>
          </tr>
          </thead>
          <tbody >
          <tr v-for="item in $store.state.list.dataset_id_list" :key="item">
            <!--                Id-->
            <td>{{ item }}</td>
            <!--                FileName-->
            <td>{{ $store.state.map.dataset_map.has(item) ?
              　$store.state.map.dataset_map.get(item).name : 'd' }}</td>
            <!--                Category-->
            <td>{{ $store.state.map.dataset_map.has(item) ?
              　$store.state.map.dataset_map.get(item).category_name : '' }}</td>
            <!--                Kappa Value-->
            <td>
              {{ $store.state.map.dataset_map.has(item) ?
              　$store.state.map.dataset_map.get(item).kappa : '' }}
              <v-btn text @click="updateKappa(item)">{{lantext.words.update[$store.state.lanType]}}</v-btn>
            </td>
            <!--                buttons-->
            <td>
              <div style="justify-content: space-around">
                <v-btn @click="draw_chart(item)" text>
                  <v-icon>mdi-chart-pie</v-icon>
                  {{lantext.words.graph[$store.state.lanType]}}
                </v-btn>
              </div>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
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
            colorByPoint: true,
            data: []
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
        //刷新表格信息
        console.log('mounted')


        this.chart1 = Highcharts.chart('chartshow',this.chart1_config);
        this.chart2 = Highcharts.chart('chartshow2',this.chart2_config);
      },
      beforeUpdate() {
        console.log('before update')

      },
      methods:{
        draw_chart(dataset_id){
          // this.chart1_config.series = [{
          //   name:"Functional",
          //   colorByPoint: true,
          //   data: []
          // }]

          this.chart1_config.series[0].data = []
          this.chart2_config.series[0].data = []

          var type_map = new Map()
          var group_map = new Map()
          var category_name = this.$store.state.map.dataset_map.get(dataset_id).category_name

          if (!this.$store.state.map.tag_category_map.has(category_name)) return

          var current_category = this.$store.state.map.tag_category_map.get(category_name).object
          current_category.tags.forEach(tag => {
            type_map.set(tag.value, 0)
          })
          current_category.group.forEach((group, index)=>{
            group_map.set(group.name, {
              list: group.list,
              index:index,
              hit:0
            })
          })


          this.$store.state.map.tag_map.forEach((value, key)=>{
            if (value.dataset_id === dataset_id && (
              this.$store.state.user_level===0 && value.tag_user_info === this.$store.state.currentuser
              || this.$store.state.user_level===1)){
              if (type_map.has(value.tag_value)) {
                var temp = type_map.get(value.tag_value)
                type_map.set(value.tag_value, temp + 1)

                var tag_index = -1
                var group_name = ""
                current_category.tags.forEach((tag, index)=>{
                  if (tag.value === value.tag_value) tag_index = index
                })
                group_map.forEach((value, key)=>{
                  if (value.list.indexOf(tag_index) !== -1) group_name = key
                })
                var hit_group = group_map.get(group_name)
                if (hit_group){
                  hit_group.hit++
                  group_map.set(group_name, hit_group)
                }
              }
            }
          })

          type_map.forEach((value, key)=>{
            this.chart1_config.series[0].data.push({
              name: key,
              y:value
            })
          })

          group_map.forEach((value, key)=>{
            this.chart2_config.series[0].data.push({
              name: key,
              y:value.hit
            })
          })


          //render
          this.chart1 = Highcharts.chart('chartshow',this.chart1_config);
          this.chart2 = Highcharts.chart('chartshow2',this.chart2_config);

          //set names for charts
          //
          // for (let j=0;j<this.chart1_config.series[0].data.length;j++){
          //   this.chart1_config.series[0].data[j].name = lantext.tagwords.tags[this.$store.state.lanType][j];
          //   this.chart1_config.series[0].data[j].y = 0
          // }
          // for (let j=0;j<this.chart2_config.series[0].data.length;j++){
          //   this.chart2_config.series[0].data[j].y = 0
          //   this.chart2_config.series[0].data[j].name = lantext.tagwords.class[this.$store.state.lanType][j];
          // }

          // if (this.$store.state.user_level===0){
            //contradiction statistics clearing
            // this.contradictions = 0
            // this.appeared_comments_list = []
            // this.tags_for_every_comment_list = []
            //

            // function count(arr, item) {
            //   return arr.reduce((prev,curr)=> curr === item ? prev+1 : prev, 0);
            // }

            // this.$store.state.tagsList[dataset.dataSetIndex].forEach(tag =>{
            //   if (tag.tag_user_info === this.$store.state.currentuser){
            //     if (this.$store.state.dataTree[dataset.dataSetIndex].commentList
            //       .comments[tag.commentIndex].tagList.tagIdList.length > 1){
            //       this.chart1_config.series[0].data[this.chart1_config.series[0].data.length-1].y += 1;
            //     }
            //     else {
            //       let temp_num = this.getTagValue(tag);
            //       if (temp_num>=1 && temp_num <=8) this.chart1_config.series[0].data[temp_num-1].y++;
            //       if (temp_num === 0 ) this.chart2_config.series[0].data[0].y++;
            //       else if (temp_num >= 9) this.chart2_config.series[0].data[2].y++;
            //       else if (temp_num>0) this.chart2_config.series[0].data[1].y++;
            //     }
            //   }
            // });

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
          // }
          // else{//reviewers
          //   //data from commentTagValueList
          //   this.reviewed_comments = 0
          //   this.$store.state.commentTagValueList[dataset.dataSetIndex].forEach(comment => {
          //     if (comment.tag_result !== -1) {
          //       this.reviewed_comments++;
          //       let temp_num = comment.tag_result;
          //       if (temp_num >= 1 && temp_num <= 8) this.chart1_config.series[0].data[temp_num - 1].y++;
          //       if (temp_num === 0) this.chart2_config.series[0].data[0].y++;
          //       else if (temp_num >= 9) this.chart2_config.series[0].data[2].y++;
          //       else if (temp_num > 0) this.chart2_config.series[0].data[1].y++;
          //     }
          //   })
          //
          // }
        },
        // getTagValue(item){
        //   let result = -1;
        //   if (!item) return result;
        //   lantext.tagwords.tags[0].forEach((prop_name,index) =>{
        //     if (item[prop_name]) result = index;
        //   });
        //   return result;
        // },

        updateKappa(dataset_id){

          // let dataset = this.$store.state.map.dataset_map.get(dataset_id)
          let comment_id_list = this.$store.state.map.dataset_comment_map.get(dataset_id)
          // let userList = []
          //kappa值计算取该数据集标注最多的两个用户的标注交集做相似度比较
          let user_map = new Map() //记录所有标注者以及他们的标注数量、列表
          // let userListTagNumber = []

          //遍历某个数据集的所有评论,构建user_map
          comment_id_list.forEach(comment_id=>{
            // console.log(comment_id)
            let tag_id_list = this.$store.state.map.comment_tag_map.get(comment_id)

            tag_id_list.forEach(tag_id=>{
              let tag = this.$store.state.map.tag_map.get(tag_id)
              // console.log(tag)
              //要注意没有tag user info的tag category标签
              if (tag && tag.hasOwnProperty('tag_user_info')){
                // console.log(tag)
                if (!user_map.has(tag.tag_user_info)){
                  user_map.set(tag.tag_user_info, {
                    hit:1,
                    comment_id_list:[tag.comment_id]
                  })
                }
                else {
                  let obj = user_map.get(tag.tag_user_info)
                  obj.hit++
                  obj.comment_id_list = [... new Set(obj.comment_id_list.concat([tag.comment_id]))]
                  user_map.set(tag.tag_user_info, obj)
                }
              }
            })
          })

          console.log(user_map.size)

          //选择标注数最多的两个用户,若没有或用户数量为1，则定为空
          if (user_map.size < 2) return

          let user_list = Array.from(user_map)
          user_list.sort((a, b)=>{
            return -(a[1].hit - b[1].hit)
          })

          console.log(user_list)

          let intersection = (arr1,arr2) =>{
            let a1 = new Set(arr1)
            let a2 = new Set(arr2)
            return [...a1].filter(item => a2.has(item))
          }

          //两个标注最多的标注者，相同的comment列表
          let intersection_list = intersection(user_list[0][1].comment_id_list, user_list[1][1].comment_id_list)

          console.log(intersection_list)
          let user1 = user_list[0][0], user2 = user_list[1][0] //两个标注最多标注者的名字
          let tags1 = [], tags2 = [] //这两个标注者标注的交集的各自的标注值

          if (intersection_list.length === 0) return;

          let kappa = intersection_list.reduce((pre, cur)=>{
            let tag_id_list = this.$store.state.map.comment_tag_map.get(cur)
            let user1_val, user2_val
            tag_id_list.forEach(tag_id =>{
              let tag = this.$store.state.map.tag_map.get(tag_id)
              if (tag.tag_user_info === user1) user1_val = tag.tag_value
              if (tag.tag_user_info === user2) user2_val = tag.tag_value
            })
            console.log(pre, cur, user1_val, user2_val)
            if (user1_val && user2_val) return pre + (user1_val === user2_val) ? 1 : 0
            else return pre
          }, 0)
          console.log(kappa)

          kappa /=  intersection_list.length

          let obj = this.$store.state.map.dataset_map.get(dataset_id)
          obj.kappa = kappa
          this.$store.state.map.dataset_map.set(dataset_id, obj)
          this.isDataAlive = false
          this.$nextTick(()=>{
            this.isDataAlive = true
          })

          // dataset.commentList.comments.forEach((comment, tagIndex) =>{
          //   if (comment.tagList.tags.length > 0){
          //     comment.tagList.tags.forEach(tag =>{
          //       let index = userList.indexOf(tag.tag_user_info);
          //       if (index===-1){
          //         userList.push(tag.tag_user_info);
          //         userListTagNumber.push({
          //           userInfo:tag.tag_user_info,
          //           frequency:1,
          //           tagsIndex:[tagIndex],
          //           tagsValues:[tag.tag_value],
          //         });
          //       }
          //       else{
          //         userListTagNumber[index].frequency++;
          //         userListTagNumber[index].tagsValues.push(tag.tag_value);
          //         userListTagNumber[index].tagsIndex.push(tagIndex);
          //       }
          //
          //     })
          //   }
          // })
          // userListTagNumber.sort((a,b)=> b.frequency-a.frequency);
          // console.log(userListTagNumber)
          // let kappa_1, kappa_2
          // if (userListTagNumber.length >= 2){
          //   kappa_1 = userListTagNumber[0]
          //   kappa_2 = userListTagNumber[1]
          //   let sameNum = 0
          //   let totalNum = 0
          //   dataSet.commentList.comments.forEach((comment, index) =>{
          //     if (kappa_1.tagsIndex.indexOf(index)!==-1 && kappa_2.tagsIndex.indexOf(index)!==-1){
          //       totalNum++;
          //       if (kappa_1.tagsValues[kappa_1.tagsIndex.indexOf(index)] ===
          //         kappa_2.tagsValues[kappa_2.tagsIndex.indexOf(index)]) sameNum++;
          //     }
          //   })
          //   console.log(sameNum, totalNum)
          //   if (totalNum>0) this.$store.state.dataTree[dataSetIndex].kappa = sameNum/totalNum
          //   else this.$store.state.dataTree[dataSetIndex].kappa = "--"
          //   this.isDataAlive = false
          //   this.$nextTick(()=>{
          //     this.isDataAlive =true
          //   })
          // }
          // else this.$store.state.dataTree[dataSetIndex].kappa = "--"
        }
      }
    }
</script>

<style scoped>

</style>
