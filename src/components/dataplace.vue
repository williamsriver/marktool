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
        /**
         * 画出指定数据库标签分布的饼图
         * @param dataset_id 数据库id
         */
        draw_chart(dataset_id){
          /**
           * type_map结构
           * 包含所有type小类的Map对象
           *
           * group_map结构
           * {
           * list:当前组对应的小类(type)的序号的集合【按照文件或category对象中的定义顺序】,
           * index:组号【按照文件或category对象中的定义顺序】,
           * hit:被访问的次数
           * }
           */
          let type_map = new Map(); //按照标签集中规定的标签种类进行统计
          let group_map = new Map(); //按照标签中规定的标签进行统计
          let current_category; //指定数据集使用的标签集
          let category_name; //用于标注的标签集的名称
          let type_group_map = new Map(); //【辅助】通过标签项找到group项的map, 标签值=>group序号

          //ROBUST 如果当前没有指定名字的标签集那么直接放弃绘画
          category_name = this.$store.state.map.dataset_map.get(dataset_id).category_name;
          if (!this.$store.state.map.tag_category_map.has(category_name)){
            console.log("No tag category named "+String(category_name)+" exists in local Vue Store Structure.");
            return;
          }

          //图表数据结构初始化
          this.chart1_config.series[0].data = [];
          this.chart2_config.series[0].data = [];

          //否则找到对应名字的标签集并读取
          current_category = this.$store.state.map.tag_category_map.get(category_name).object;

          //分类map type_map录入标签集中所有标签值
          current_category.tags.forEach(tag => type_map.set(tag.value, 0));

          //分组map group_map初始化
          current_category.group.forEach((group, index)=>{
            group_map.set(group.name, {
              list: group.list,
              index:index,
              hit:0
            });

            //建立辅助数组 type值=>group序号
            group.list.forEach(val=>type_group_map.set(current_category.tags[val].value, index));
          });

          //遍历tag_map寻找符合条件的tag【标注】来进行统计
          /**
           * 对于标注者只显示自己的标注
           * 对于审阅者显示所有有效标注
           */
          this.$store.state.map.tag_map.forEach(value=>{
            if (value.dataset_id === dataset_id &&
              !!value.tag_value &&
              (
                this.$store.state.user_level===0 &&
                value.tag_user_info === this.$store.state.currentuser
                ||
                this.$store.state.user_level===1
              )
            ){
              //注意：已经检查过标注值不为空
              let vals; //该标注的值（可能为单个或多个）
              //ROBUST tag_value可能为字符串或数组
              vals = (value.tag_value instanceof Array) ? value.tag_value : [value.tag_value];
              //对于每个标注项单个/多个值的统计
              vals.forEach(val =>{
                if (type_map.has(val)) {
                  //type map统计
                  type_map.set(val, type_map.get(val) + 1); //对应项自增
                  //group map统计
                  let group_name = current_category.group[type_group_map.get(val)].name;
                  let hit_group = group_map.get(group_name); //标签值对应的组
                  if (hit_group){
                    hit_group.hit++;
                    group_map.set(group_name, hit_group);
                  }
                }
              });
            }
          });

          //两张饼图的数据录入
          type_map.forEach((value, key)=>{
            this.chart1_config.series[0].data.push({
              name: key,
              y:value
            })
          })
          group_map.forEach((value, key)=>{
            console.log(value, key)
            this.chart2_config.series[0].data.push({
              name: key,
              y:value.hit
            })
          })

          //渲染
          this.chart1 = Highcharts.chart('chartshow',this.chart1_config);
          this.chart2 = Highcharts.chart('chartshow2',this.chart2_config);
        },

        updateKappa(dataset_id){
          let comment_id_list = this.$store.state.map.dataset_comment_map.get(dataset_id)
          //kappa值计算取该数据集标注最多的两个用户的标注交集做相似度比较
          let user_map = new Map() //记录所有标注者以及他们的标注数量、列表

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
