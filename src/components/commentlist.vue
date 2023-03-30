<template>
  <v-app>
<!--    commentlist部分-->
    <v-container fluid v-show="!$store.state.workStatus">
<!--      上方第一行按钮-->
      <v-row align="baseline">
        <v-col cols="3">
          <v-btn text @click="refreshCommentList">
              <v-icon>mdi-refresh</v-icon>
              {{lantext.sentences.reload_data[$store.state.lanType]}}
          </v-btn>
        </v-col>
        <v-col cols="3" v-show="$store.state.user_level===0" >
          <v-btn text @click="overlay_show.upload_dataset = true">
            <v-icon>mdi-file-upload-outline</v-icon>
            {{lantext.sentences.upload_dataset[$store.state.lanType]}}
          </v-btn>
        </v-col>
        <v-col cols="3">
          <v-btn text @click="overlay_show.get_dataset = true">
            <v-icon>mdi-file-download-outline</v-icon>
            {{lantext.sentences.get_dataset[$store.state.lanType]}}
          </v-btn>
        </v-col>

<!--        <v-col cols="3">-->
<!--          <v-btn text @click="overlay_show.upload_tag_category = true">-->
<!--            <v-icon>mdi-file-download-outline</v-icon>-->
<!--            {{lantext.sentences.upload_tag_category[$store.state.lanType]}}-->
<!--          </v-btn>-->
<!--        </v-col>-->

        <!--        标签集合的操作台-->
        <v-col
          cols="3"
        >
          <v-btn
            text
            @click="overlay_show.tag_category_edit = true"
          >
            <v-icon>
              mdi-file-download-outline
            </v-icon>
            {{lantext.sentences.tag_category_edit[$store.state.lanType]}}
          </v-btn>
        </v-col>
      </v-row>

<!--&lt;!&ndash;      上方第二行按钮&ndash;&gt;-->
<!--      <v-row>-->

<!--      </v-row>-->


      <!--            数据集表-->
      <v-container fluid>
        <v-card-title>
          <v-main>{{lantext.words.dataset_list[$store.state.lanType]}}</v-main>
          <!--          搜索栏-->
          <v-text-field
            v-model="listSrchString"
            append-icon="mdi-magnify"
            :label="lantext.words.search[$store.state.lanType]">
          </v-text-field>
        </v-card-title>

<!--            数据集表-->
          <v-simple-table
            :height="200"
            v-if="isListAlive">
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">{{lantext.words.datasetID[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.file_name[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.tag_category[$store.state.lanType]}}</th>
                <th class="text-left">{{lantext.words.tagged[$store.state.lanType]}}</th>
                <th class="text-left"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in $store.state.list.dataset_id_list" :key="index">
<!--                Id-->
                <td>{{ item }}</td>
<!--                FileName-->
                <td>{{ $store.state.map.dataset_map.has(item) ?
                  　$store.state.map.dataset_map.get(item).name : '' }}</td>
                <!--                Category-->
                <td>{{ $store.state.map.dataset_map.has(item) ?
                  　$store.state.map.dataset_map.get(item).category_name : '' }}</td>
<!--                Tagged-->
                <td>
                  {{$store.state.map.dataset_comment_map.has(item)
                  ? $store.state.map.dataset_comment_map.get(item).reduce(get_tagged_num, 0)
                  : '--'}}
                  /{{$store.state.map.dataset_comment_map.has(item)
                  ? $store.state.map.dataset_comment_map.get(item).length
                  : '--'}}
                </td>
<!--                buttons-->
                <td>
                  <div style="justify-content: space-around">
                    <v-btn color="blue" dark
                           @click="choose_dataset(item)"
                          :disabled="!work_ready">
                      {{lantext.words[$store.state.user_level===0?"mark":"view"][$store.state.lanType]}}
                    </v-btn>
                    <v-btn color="orange" dark
                           v-show="$store.state.user_level===0"
                           @click="share_dataset(item)"
                           :disabled="!work_ready">
                      {{lantext.words.share[$store.state.lanType]}}
                    </v-btn>
                  </div>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
      </v-container>


<!--      标签集合表-->

      <v-container fluid>
        <v-card-title>
          <v-main>{{lantext.words.tag_category_list[$store.state.lanType]}}</v-main>
          <!--          搜索栏-->
          <v-text-field
            v-model="listSrchString"
            append-icon="mdi-magnify"
            :label="lantext.words.search[$store.state.lanType]">
          </v-text-field>
        </v-card-title>

        <!--            标签集合表-->
        <v-simple-table
          :height="200"
          v-if="isListAlive">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">Category Name</th>
<!--              <th class="text-left">Datasets Using Category</th>-->
              <th class="text-left"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in $store.state.list.tag_category_name_list" :key="index">
              <!--                Category Name-->
              <td>{{ item }}</td>
              <!--                Datasets Using Category-->
<!--              <td>{{ }}</td>-->
              <!--                buttons-->
              <td>
                <div style="justify-content: space-around">
                  <v-btn color="blue" text
                         @click="inspect_tag_category(item)">
                    {{lantext.words.look[$store.state.lanType]}}
                  </v-btn>
                </div>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
    </v-container>


<!--    标注/审阅界面-->
    <v-container fluid v-show="$store.state.workStatus" class="pa-0">
      <markplace v-if="$store.state.user_level===0 && $store.state.workStatus"/>
      <viewplace v-if="$store.state.user_level===1 && $store.state.workStatus"/>
    </v-container>


    <!--分享数据集-->
    <v-overlay v-show="overlay_show.dataset_share" color="#eeeeee">
      <v-card  width="700" height="350" light>
        <div>
          <v-btn @click="overlay_show.dataset_share = false" text absolute right>
            <span class="mdi mdi-close" ></span>
          </v-btn>
        </div>

        <v-card-title >{{lantext.words.share[$store.state.lanType]
          +" "+lantext.words.dataset[$store.state.lanType]}}</v-card-title>
        <v-divider ></v-divider>
        <v-text-field :label="lantext.words.share[$store.state.lanType]
        +' '+lantext.words.username[$store.state.lanType]"
                      v-model="temp_username"></v-text-field>
        <v-text-field :label="lantext.words.dataset[$store.state.lanType]+' ID'" v-model="temp_dataSetId"></v-text-field>
        <v-card-actions>
          <v-btn @click="relateDataSet">{{lantext.words.share[$store.state.lanType]}}</v-btn>
        </v-card-actions>

      </v-card>
    </v-overlay>

<!--    上传数据集-->
    <v-overlay v-show="overlay_show.upload_dataset" color="#eeeeee">
      <v-card  width="700" height="500" light
               class="overflow-y-auto overflow-x-hidden">
        <div>
          <v-btn @click="overlay_show.upload_dataset = false" text absolute right>
            <span class="mdi mdi-close" ></span>
          </v-btn>
        </div>
        <upfile></upfile>
      </v-card>
    </v-overlay>

<!--    获取数据集-->
    <v-overlay v-show="overlay_show.get_dataset" color="#eeeeee">
      <v-card  width="700" height="500" light>
        <div>
          <v-btn @click="overlay_show.get_dataset = false" text absolute right>
            <span class="mdi mdi-close"></span>
          </v-btn>
        </div>
        <all-dataset-table></all-dataset-table>
      </v-card>
    </v-overlay>

<!--上传tag category, 上传标签组-->
    <v-overlay v-show="overlay_show.upload_tag_category" color="#eeeeee"
    z-index="10">
      <v-card  width="700" height="500" light

               class="overflow-y-auto overflow-x-hidden">
        <div>
          <v-btn @click="overlay_show.upload_tag_category = false" text absolute right>
            <span class="mdi mdi-close"></span>
          </v-btn>
        </div>
        <v-card-title>{{lantext.sentences.upload_tag_category[$store.state.lanType]}}</v-card-title>
        <v-divider></v-divider>
        <v-card-title>{{lantext.words.category_template[$store.state.lanType]}}</v-card-title>

        <v-divider></v-divider>
        <v-row class="ma-2">
          <v-col> <v-file-input type="file" v-model="tag_category"></v-file-input> </v-col>
          <v-col>
            <v-btn @click="upload_tag_category(tag_category)"
                   outlined color="primary" :disabled="!tag_category">
              {{lantext.words.upload[$store.state.lanType]}}
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-overlay>

<!--        标签集合详情-->
    <v-overlay v-if="overlay_show.tag_category_info" color="#111111" light
      class="pa-4">

      <v-card width="800" height="500" color="transparent" flat>
        <v-btn @click="overlay_show.tag_category_info = false"
               dark text absolute right>
          <span class="mdi mdi-close"></span>
        </v-btn>

        <v-card  width="700" height="500" light
                 class="overflow-y-auto overflow-x-hidden">
<!--            退出按钮-->

<!--            标签集合的所有组，每个组的所有标签-->
<!--            每个组用一个段落来表示-->
          <v-card-text
            v-for="(group, index) in chosen_tag_category.category_obj.group"
            :key="index">
<!--              组的名称-->
            <v-main class="ma-1 text-h5">Group Name: {{group.name||'--'}}</v-main>
<!--              根据组内的数组指定tags数组中对应的tag-->
<!--              item.list是tags数组中tag的id列表-->
            <v-card
              v-for="(tag_id,index) in group.list"
              :key="index" >
              <v-main class="ma-1 text-h6">Tag Name:
                {{chosen_tag_category.category_obj.tags[tag_id].reference[$store.state.lanType===0?'en':'ch'] || '--'}}
              </v-main>
              <!--                    渲染html片段-->
              <v-container v-html="chosen_tag_category.category_obj.tags[tag_id].description[
              $store.state.lanType===0?'en':'ch']"
                class="overflow-y-auto overflow-x-hidden">
              </v-container>
            </v-card>
          </v-card-text>
        </v-card>
      </v-card>
    </v-overlay>

    <!--开始标注前选择标注集合-->
    <v-overlay v-show="overlay_show.choose_tag_category" color="#eeeeee">
      <v-card  width="700" height="500" light
               class="overflow-y-auto overflow-x-hidden">
        <div>
          <v-btn @click="overlay_show.choose_tag_category = false" text absolute right>
            <span class="mdi mdi-close"></span>
          </v-btn>
        </div>
        <v-card-title>{{lantext.sentences.choose_tag_category[$store.state.lanType]}}</v-card-title>
        <v-divider></v-divider>
        <v-container>

        <v-main>{{lantext.sentences.current_tag_category[$store.state.lanType]}} :
        {{$store.state.chosen_tag_category?$store.state.chosen_tag_category.category_obj.name:'--'}}</v-main>
        <v-simple-table
          :height="150"
          v-if="isListAlive">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">Category Name</th>
              <th class="text-left">Datasets Using Category</th>
              <th class="text-left"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in $store.state.list.tag_category_name_list" :key="index">
              <!--                Category Name-->
              <td>{{ item }}</td>
              <!--                Datasets Using Category-->
              <td>{{ }}</td>
              <!--                buttons-->
              <td>
                <div style="justify-content: space-around">
                  <v-btn color="blue" text
                         @click="choose_tag_category(item)">
                    {{lantext.words.choose[$store.state.lanType]}}
                  </v-btn>
                </div>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>

        </v-container>

        <v-row>
          <v-spacer></v-spacer>
          <v-btn color="green" @click="go_to_tag()" light>{{lantext.sentences.ready_to_tag[$store.state.lanType]}}</v-btn>
          <v-spacer></v-spacer>
        </v-row>
      </v-card>
    </v-overlay>

    <!--标签组操作台，用于创建、编辑标签组-->
    <v-overlay v-show="overlay_show.tag_category_edit" color="#eeeeee">
      <v-card
        light
        width="1200"
        height="550"
        class="overflow-y-auto overflow-x-hidden"
      >
<!--        关闭按钮-->
        <div>
          <v-btn
            text
            absolute
            right
            @click="overlay_show.tag_category_edit = false">
            <span class="mdi mdi-close"></span>
          </v-btn>
        </div>
<!--        标题-->
        <v-card-title>{{lantext.sentences.tag_category_edit[$store.state.lanType]}}</v-card-title>

        <v-divider></v-divider>

        <!--          当前选择的标签组（全局唯一，用于标注）-->
        <v-card-title>
          {{lantext.sentences.current_tag_category[$store.state.lanType]}} :
          {{$store.state.chosen_tag_category?$store.state.chosen_tag_category.category_obj.name:'--'}}
        </v-card-title>

        <v-divider></v-divider>


        <v-container>
          <!--        关于标签组的操作-->
          <v-card-actions>
            <!--          创建新的标签组-->
            <v-btn
              text
              @click="overlay_show.tag_category_create = true">
              <v-main>
                {{lantext.sentences.create_new_tag_category[$store.state.lanType]}}
              </v-main>
            </v-btn>
            <!--          上传标签组-->
            <v-btn
              text
              @click="overlay_show.upload_tag_category = true">
              <v-main>
                {{lantext.sentences.upload_tag_category[$store.state.lanType]}}
              </v-main>
            </v-btn>
          </v-card-actions>
<!--          数据集中所有标签组的集合-->
          <v-simple-table
            :height="150"
            v-if="isListAlive">
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">{{lantext.words.tag_category_name[$store.state.lanType]}}</th>
                <th class="text-left">Datasets Using Category</th>
                <th class="text-left"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in $store.state.list.tag_category_name_list" :key="index">
                <!--                Category Name-->
                <td>{{ item }}</td>
                <!--                Datasets Using Category-->
                <td>{{ }}</td>
                <!--                buttons-->
                <td>
                  <div style="justify-content: space-around">
                    <v-btn color="blue" text
                           @click="choose_tag_category(item)">
                      {{lantext.words.choose[$store.state.lanType]}}
                    </v-btn>
                  </div>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>

        </v-container>

        <v-row>
          <v-spacer></v-spacer>
          <v-btn color="green" @click="go_to_tag()" light>{{lantext.sentences.ready_to_tag[$store.state.lanType]}}</v-btn>
          <v-spacer></v-spacer>
        </v-row>
      </v-card>
    </v-overlay>

<!--    标签组操作台上方的——创建新标签组的界面，为了在标签组操作台的上方展现，z-index的值10-->
    <v-overlay v-show="overlay_show.tag_category_create" color="#efffff">
      <v-card
        light
        width="700"
        height="500"
        class="overflow-y-auto overflow-x-hidden"
      >
        <!--        关闭按钮-->
        <div>
          <v-btn
            text
            absolute
            right
            @click="overlay_show.tag_category_create = false">
            <span class="mdi mdi-close"></span>
          </v-btn>
        </div>
<!--        标题-->
        <v-card-title>
          {{lantext.sentences.create_new_tag_category[$store.state.lanType]}}
        </v-card-title>
        <v-divider></v-divider>
<!--        标签组名称-->
        <v-text-field
          clearable
          class="ma-3"
          v-model="custom_tag_category_obj.name"
          :label="lantext.words.tag_category_name[$store.state.lanType]"
          >
        </v-text-field>
<!--        标签组中的细类（分组表/group table）-->
        <v-card-title>
          {{ lantext.words.group_table[$store.state.lanType] }}
          <!--          添加新的分组的按钮-->
          <v-btn
            text
            color="primary"
            @click="create_item(custom_tag_category_obj.group, {name:'', list:[]})"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-card-title>
        <v-simple-table
          :height="150"
          v-if="isListAlive"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">{{ lantext.words.name[$store.state.lanType] }}</th>
<!--                注：直接利用多选器完成了数据绑定，无需单独删除或添加的组件-->
                <th class="text-left">{{ lantext.sentences.tags_contained[$store.state.lanType] }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(group, index) in custom_tag_category_obj.group" :key="index">
                <!--                标签组名称 Group Name-->
                <td>
                  <v-text-field
                    v-model="group.name"
                  >
                  </v-text-field>
                </td>
                <!--                标签组所包含的标签 Tags Contained In-->
                <!--                注：直接利用多选器完成了数据绑定，无需单独删除或添加的组件-->
                <td>
<!--                  {{ group.list }}-->

                  <v-select
                    deletable-chips
                    multiple
                    v-model="group.list"
                    :items="tagIdList">
                  </v-select>

                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <!--        标签组中的每个标签（标签表/tag table）-->
        <v-card-title>
          {{ lantext.words.tag_table[$store.state.lanType] }}
<!--          添加标签的按钮-->
          <v-btn
            text
            color="primary"
            @click="create_item(custom_tag_category_obj.tags,
            {value:'', reference:{en:'', ch:''}, description:{en:'', ch:''}})"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>

        </v-card-title>
        <v-simple-table
          :height="150"
          v-if="isListAlive"
        >
          <template v-slot:default>
            <thead>
            <tr>
<!--              次序-->
              <th class="text-left">ID</th>
<!--              标签值-->
              <th class="text-left">
                {{ lantext.words.value[$store.state.lanType] }}
              </th>
<!--              标签名称-->
              <th class="text-left">
                {{ lantext.words.tag_reference[$store.state.lanType] }}
              </th>
<!--              标签描述-->
              <th>
                {{ lantext.words.tag_description[$store.state.lanType] }}
              </th>
<!--              按钮操作区-->
            </tr>
            </thead>
            <tbody>
            <tr v-for="(tag, index) in custom_tag_category_obj.tags" :key="index">
<!--              次序ID-->
              <td>
                {{index}}
              </td>
              <!--                标签值 Tag Value-->
              <td>
                <v-text-field
                  v-model="tag.value"
                >
                </v-text-field>
              </td>
              <!--                标签的中英名称 Tag Reference-->
              <td>
                <!--              注：为了表格的紧凑性，控制每行的高度-->
                <!--                为了控制高度，在【reference的v-text-field】外面套上【v-card】-->
                <!--                将内容包含在【v-card】中，并设置一定间隔让内容相对清爽-->
                <!--                让【v-card】与表格融为一体，让其透明-->
                <v-card
                  color="transparent"
                  flat
                  class="overflow-y-auto pa-2"
                  height="100">
<!--                中文名称-->
                  <v-text-field
                    outlined
                    :label="lantext.words.ch_reference[$store.state.lanType]"
                    v-model="tag.reference.ch"
                  >
                  </v-text-field>
  <!--                英文名称-->
                  <v-text-field
                    outlined
                    :label="lantext.words.en_reference[$store.state.lanType]"
                    v-model="tag.reference.en"
                  >
                  </v-text-field>
                </v-card>
              </td>
              <!--                标签的中英描述 Tag Description-->
              <td>
                <!--              注：为了表格的紧凑性，控制每行的高度-->
<!--                为了控制高度，在【描述textarea】外面套上【v-card】-->
<!--                将内容包含在【v-card】中，并设置一定间隔让内容相对清爽-->
<!--                让【v-card】与表格融为一体，让其透明-->
                <v-card
                  color="transparent"
                  flat
                  class="overflow-y-auto pa-2"
                  height="100">
                  <!--                中文描述-->
                  <v-textarea
                    outlined
                    :label="lantext.words.ch_description[$store.state.lanType]"
                    v-model="tag.description.ch"
                  >
                  </v-textarea>
                  <!--                英文描述-->
                  <v-textarea
                    outlined
                    :label="lantext.words.en_description[$store.state.lanType]"
                    v-model="tag.description.en"
                  >
                  </v-textarea>
                </v-card>

              </td>
              <!--                buttons-->
              <td>
                <div
                  style="justify-content: space-around"
                >
                  <!--                    删除这个标签-->
                  <v-btn
                    text
                    color="primary"
                    @click="delete_item(custom_tag_category_obj.tags, index)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>

<!--        提交按钮-->
        <div
        style="text-align: center">
          <v-btn
            text
          @click="submit_tag_category">
            {{lantext.words.submit[$store.state.lanType]}}
          </v-btn>
        </div>

      </v-card>
    </v-overlay>
  </v-app>
</template>

<script>
  /**
   * 将tag_category的信息和数据集、标注者绑定，以tag的形式保存在【对应】的数据集中
   */
  import lantext from "../lib/lantext";
  import Markplace from "./markplace";
  import Viewplace from "./viewplace";
  import GetFile from "./getFile";
  import upfile from "./upfile";
  import allDatasetTable from "./allDatasetTable";
  import defaultTagCategory from '../lib/defaultTagCategory'
  import TagCategory from "../lib/TagCategory"
    export default {
        name: "commentlist",
      props:{
        enable:{
          type: Boolean,
          required:true
        }
      },
      components: {Viewplace, Markplace, GetFile, upfile , allDatasetTable},
      computed:{
        tagIdList(){
          let len = this.custom_tag_category_obj.tags.length;
          return [...Array(len).keys()];
        }
      },
      data:()=>({
        lantext:lantext,
        listSrchString:'',
        dataSetPtr:-1,
        isListAlive:true,
        defaultTagCategory,

        custom_tag_category_obj:{
          name:"--",
          group:[
            {
              name:"Default Group",
              list:[0]
            },
          ],
          tags:[
            {
              value: "example",
              //reference:标签中/英假名
              reference:{
                "en":"Functional Requirements",
                "ch":"功能性需求"
              },
              description:{
                "en":"Description in English",
                "ch":"中文解释文"
              }
            },
          ]
        },

        overlay_show:{
          dataset_share:false,
          upload_dataset:false,
          get_dataset:false,
          upload_tag_category: false,
          tag_category_info:false,
          choose_tag_category:false,
          tag_category_edit:false, //标签组操作台界面的开关
          tag_category_create:false //标签组操作台中创建全新的标签组界面的开关
        },
        temp_username:"",
        temp_dataSetId: "",

        work_ready:false,
        comment_loading_start:0,
        comment_loading_end:0,
        tag_loading_start:0,
        tag_loading_end:0,

        // chosen_tag_category_name:"",
        chosen_tag_category:null,
        tag_category:null,
        tag_category_name:"",
      }),
      watch:{
        work_ready(newval, oldval){
          console.log("work_ready")
          this.get_categories()
        }
      },
      created() {
          console.log('created')
        // this.get_dataset_id_list()
      },
      mounted() {
          console.log('mounted')
        if (this.$store.state.list.tag_category_name_list.indexOf('ISO 25010') === -1){
          this.$store.state.map.tag_category_map.set('ISO 25010', new TagCategory(defaultTagCategory, null))
          this.$store.state.list.tag_category_name_list.push('ISO 25010')
        }
        this.$store.state.chosen_tag_category = this.$store.state.map.tag_category_map.get('ISO 25010')

      },
      updated() {

      },
      methods: {
        //选择tag_category准备进行标注：在用户选好用于标记某个数据集的tag category后，确定该选择，并进入标记界面
        go_to_tag() {
          // this.overlay_show.choose_tag_category = false
          // this.$store.state.current_tag_category_saved = false
          this.$store.state.workStatus = true
        },

        //选择tag_category准备进行标注：选择一个tag category准备进行标注
        choose_tag_category(category_name) {
          this.$store.state.chosen_tag_category = this.$store.state.map.tag_category_map.get(category_name)
        },

        //在tag_category列表中选择某个tag category进行查看
        inspect_tag_category(category_name) {
          // this.chosen_tag_category_name = category_name
          this.chosen_tag_category = this.$store.state.map.tag_category_map.get(category_name)
          this.overlay_show.tag_category_info = true
        },

        //用于上传用户自定义的tag category
        upload_tag_category(file) {
          console.log(file)
          let reader = new FileReader()
          reader.readAsText(file)
          reader.onload = ((e) => {
            let o = new TagCategory(null, e.target.result)
            let index = this.$store.state.list.tag_category_name_list.length
            let list = [...this.$store.state.set.tag_category_comment_id_set]
            console.log("list list", list)
            o.save(null, o.dataset_id, list[index])
            this.$store.state.list.tag_category_name_list.push(o.category_obj.name)
            this.$store.state.map.tag_category_map.set(o.category_obj.name, o)
            this.$message.success('ok')
          })
        },

        submit_tag_category() {
          let o = new TagCategory(this.custom_tag_category_obj, null)
          let index = this.$store.state.list.tag_category_name_list.length
          let list = [...this.$store.state.set.tag_category_comment_id_set]
          console.log("list list", list)
          o.save(null, o.dataset_id, list[index])
          this.$store.state.list.tag_category_name_list.push(o.category_obj.name)
          this.$store.state.map.tag_category_map.set(o.category_obj.name, o)
          this.$message.success('ok')
        },


        //选择某个数据集进行标注
        choose_dataset(dataset_id) {
          this.$store.state.chosen_dataset_id = dataset_id
          // if (this.$store.state.user_level === 0){
          //
          //   // this.overlay_show.choose_tag_category = true
          // }
          // else {
          //   this.$store.state.list.chosen_dataset_tag_id_list = []
          //   this.$store.state.list.chosen_dataset_comment_id_list = []
          //   this.$store.state.map.comment_map.forEach((value, key)=>{
          //     if (value.dataset_id === dataset_id
          //     && (this.$store.state.map.comment_tag_map.get(key).length > 0
          //         && this.$store.state.map.comment_tag_map.get(key)[0].length > 0)
          //       ) this.$store.state.list.chosen_dataset_comment_id_list.push(key)
          //   })
          //
          //   let category_name = this.$store.state.map.dataset_map.get(dataset_id).category_name
          //   if (category_name){
          //     this.$store.state.chosen_tag_category = this.$store.state.map.tag_category_map.get(category_name)
          //     console.log(category_name, this.$store.state.chosen_tag_category)
          //   }
          this.$store.state.workStatus = true
        },

        //分享某个数据集，打开界面
        share_dataset(dataset_id) {
          this.temp_dataSetId = dataset_id
          this.overlay_show.dataset_share = true
        },

        //重新刷新所有界面
        refreshCommentList() {
          console.log('refresh')
          this.$store.state.list.dataset_id_list = []
          this.$store.state.list.comment_id_list = []
          this.$store.state.list.tag_id_list = []
          this.$store.state.map.dataset_map = new Map()
          this.$store.state.map.dataset_comment_map = new Map()
          this.$store.state.map.comment_map = new Map()
          this.$store.state.map.comment_tag_map = new Map()
          this.$store.state.map.tag_map = new Map()
          this.work_ready = false
          this.get_dataset_id_list()
        },

        /**
         * 获取过程中list不是强制性完整的，允许报错等，层级获取
         */
        get_dataset_id_list() {
          this.axios.get('/commentsList/', {
            params: {
              username: this.$store.state.currentuser
            }
          }).then(response => {
            console.log(response)
            if (response.data.Details) {
              console.log(response.data.Details)
              this.$store.state.list.dataset_id_list = [...new Set(response.data.Details.comment_list_id)]
              this.$store.state.list.dataset_id_list.forEach(dataset_id => {
                this.get_dataset_object(dataset_id)
              })
            } else this.$message.error('datasets acquiring error');
          }).catch(error => console.log(error))
        },


        addNewTagForComment(tag_id, comment_id) {
          let formData1 = new FormData()
          let date = new Date();
          formData1.append("datetime_info", date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())
          formData1.append('comment_id', comment_id)
          formData1.append('tag_id', tag_id)
          this.axios.put('/comments/', formData1).then(response => {
            console.log(response)
            if (response.data) {
              this.$message.success("create new tag succeed");
              this.isSaved = true;
              var dataset_id = this.currentComment.dataset_id
              this.get_tag_object(tag_id, comment_id, dataset_id)
              this.ptr++;
            } else this.$message.error("create new tag failed");
          }).catch(error => console.log(error))
        },

        get_tag() {
          this.tag_loading_end++;
          console.log(this.tag_loading_start, this.tag_loading_end)
          if (this.tag_loading_end === this.tag_loading_start) {
            // this.refresh_table_data()
            // this.get_tag_categories()
            this.work_ready = true
          }
        },

        //得到一个comment对象的回调函数
        get_comment() {
          this.comment_loading_end++;
          if (this.comment_loading_end === this.comment_loading_start) {
            this.refresh_table_data()
            // this.work_ready = true
          }
        },

        //拿到所有category
        get_categories(){
          const dataset_id = 1680064092965
          let list = [...this.$store.state.set.tag_category_comment_id_set]
          list.forEach(comment_id =>{
            console.log("routine")
            let sub_tag_id_list = this.$store.state.map.comment_tag_map.get(comment_id)
            if (sub_tag_id_list > 0){
              sub_tag_id_list.forEach(tag_id => {
                let tag_obj = this.$store.state.map.tag_map.get(tag_id)
                if (!!tag_obj){
                  console.log("NEW CATEGORY", tag_obj)
                  let o = new TagCategory(null, tag_obj.remarks)
                  this.$store.state.list.tag_category_name_list.push(o.category_obj.name)
                  this.$store.state.map.tag_category_map.set(o.category_obj.name, o)
                }
              })
            }
          })
        },

        //获取数据集对象
        get_dataset_object(dataset_id) {
          /**
           * dataset object
           * {
           *   comment_id_list:[]
           *   name:String
           * }
           */
          this.axios.get('/commentsList/', {
            params: {
              list_id: dataset_id
            }
          }).then(response => {
            // console.log(response)
            if (response.data) {
              this.$store.state.map.dataset_map.set(dataset_id, {
                name: response.data.name,
                category_name: null, //所使用的tag category
                kappa: null, //每个数据集kappa值
              })
              // this.refresh_table_data()
              var sub_comment_id_list = [...new Set(response.data.comment_id_list)]
              this.$store.state.map.dataset_comment_map.set(dataset_id, sub_comment_id_list)
              this.$store.state.list.comment_id_list = this.$store.state.list.comment_id_list.concat(sub_comment_id_list)
              sub_comment_id_list.forEach(comment_id => {
                this.comment_loading_start++;
                this.get_comment_object(this.get_comment, comment_id, dataset_id)
              })
            } else console.log(String(dataset_id) + "号数据集 Id. 数据对象")
          }).catch(error => console.log(error))
        },

        //获取comment对象
        get_comment_object(callback, comment_id, dataset_id) {
          if (!comment_id) return
          // console.log("get comment object", comment_id)
          /**
           * comment object
           * app_name: "Monkey"
           * content: "- \"Add Friend\" changed to \"Follow\""
           * datetime_info: "2019-02-07"
           * rank_level: 1
           * tag_id_list: ""
           * tag_result: -1
           * title: ""
           * version_info: "5.1.8"
           */
          this.axios.get('/comments/', {
            params: {
              comment_id: comment_id
            }
          }).then(response => {
            // console.log(response)
            if (response.data.Details) {
              var comment_object = response.data.Details
              comment_object["dataset_id"] = dataset_id
              comment_object["comment_id"] = comment_id
              if (dataset_id === 1680064092965) this.$store.state.set.tag_category_comment_id_set.add(comment_id)
              this.$store.state.map.comment_map.set(comment_id, comment_object)
              if (dataset_id === 1680064092965 &&
                comment_object.tag_id_list.length > 0) console.log("notice", comment_object)
              var sub_tag_id_list = [...new Set(comment_object.tag_id_list.split(','))]
              this.$store.state.map.comment_tag_map.set(comment_id, sub_tag_id_list)
              callback()
              // this.refresh_table_data()
              this.$store.state.list.tag_id_list = [...new Set(this.$store.state.list.tag_id_list.concat(sub_tag_id_list))]
              // console.log(comment_id, sub_tag_id_list)
              sub_tag_id_list.forEach((tag_id, index) => {
                if (tag_id) {
                  this.tag_loading_start++
                  this.get_tag_object(this.get_tag, tag_id, comment_id, dataset_id, index)
                }
              })
            } else this.$message.error('comment acquiring error');
          }).catch(error => {
            callback()
            console.log(error)
          });
        },

        isNumber(obj) {
          var num_obj = Number(obj)
          return !isNaN(num_obj)
        },

        //得到tag对象
        get_tag_object(callback, tag_id, comment_id, dataset_id, index) {

          if (!this.isNumber(tag_id)) {
            callback()
            return
          }
          /**
           * tag object
           * tag_id = models.AutoField(primary_key=True)
           * remarks = models.CharField(max_length=500,default="",verbose_name=u'备注信息')
           *  => tag_value
           *  => rationale
           * tag_user_info = models.CharField(max_length=32,verbose_name=u'标注者信息')
           * confidence = models.IntegerField(default=0,verbose_name=u'置信度')
           *
           * tag_category:{
           *   name:<String>
           *   groups:<Array>
           *   tags:<Array>
           *
           * }
           */
          this.axios.get('/tag/', {
            params: {
              tag_id: tag_id
            }
          }).then(response => {
            console.log(response)
            if (response.data.Details) {
              let tag_object = response.data.Details
              if (dataset_id === 1680064092965) console.log("chosen one", tag_object)
              callback()
              this.$store.state.map.tag_map.set(tag_id, tag_object)

              // try {
              //   var t1 = JSON.parse(tag_object.remarks);
              //   console.log('all tags', t1)
              //   //有两种情况：（1）正常标注tag（2）tag_category tag
              //   //正常tag
              //   if (t1.tag_value) {
              //     tag_object["tag_value"] = t1.tag_value;
              //     tag_object["rationale"] = t1.rationale;
              //   } else if (t1.category_name) {
                  //tag categorg map
                  /**
                   * key : <Name>
                   * value:{
                   *   complete : <Bool>
                   *     slices:<Array>
                   *   object: <Object>
                   * }
                   *
                   * tag category
                   * {
                   *   category_name
                   *   total
                   *   no
                   *   str_slice
                   * }
                   */
                  // //之前有
                  // let current_category, content
                  //
                  //   tag_object["category_name"] = t1.category_name
                  //   console.log('tag category', t1.category_name)
                  //   //更新对应数据集所使用的tag category
                  //
                  //   var current_dataset = this.$store.state.map.dataset_map.get(dataset_id)
                  //   current_dataset.category_name = t1.category_name
                  //   this.$store.state.map.dataset_map.set(dataset_id, current_dataset)
                  //
                  //   if (this.$store.state.map.tag_category_map.has(t1.category_name)){
                  //     current_category = this.$store.state.map.tag_category_map.get(t1.category_name)
                  //     //这个tag category没有完成，继续拼接
                  //     if (!current_category.complete) {
                  //       current_category.slices[t1.no] = t1.str_slice
                  //
                  //       //检查是否完成 0 -> total-1
                  //       var has_slices = current_category.slices.
                  //         reduce((pre, cur)=>(cur && cur.length > 0) ? pre+1 : pre, 0)
                  //       if (has_slices === t1.total) current_category.complete = true
                  //
                  //       if (current_category.complete) {
                  //         content = current_category.slices.reduce((pre, cur)=>pre+cur, "")
                  //         current_category["object"] = JSON.parse(content)
                  //         this.$store.state.list.tag_category_name_list =
                  //           [... new Set(this.$store.state.list.tag_category_name_list.concat([t1.category_name]))]
                  //         current_category.object.tags.forEach(tag=>{
                  //           this.$store.state.set.tag_category_value_set.add(tag.value)
                  //         })
                  //       }
                  //
                  //       this.$store.state.map.tag_category_map.set(t1.category_name, current_category)
                  //     }
                  //   }
                  //   else {
                  //     //第一部分
                  //     current_category = {
                  //       slices:new Array(t1.total),
                  //       complete: t1.total===1,
                  //       object: null
                  //     }
                  //     current_category.slices[t1.no] = t1.str_slice
                  //     if (current_category.complete) {
                  //       content = current_category.slices.reduce((pre, cur)=>pre+cur, "")
                  //       current_category["object"] = JSON.parse(content)
                  //       this.$store.state.list.tag_category_name_list =
                  //         [... new Set(this.$store.state.list.tag_category_name_list.concat([t1.category_name]))]
                  //       current_category.object.tags.forEach(tag=>{
                  //         this.$store.state.set.tag_category_value_set.add(tag.value)
                  //       })
                  //     }
                  //     this.$store.state.map.tag_category_map.set(t1.category_name, current_category)
                  //
                  //   }
              //   }
              // } catch (e) {
              //   console.log(e)
                // let flag1 = false
                //向老版本兼容，检查其内容是否支持用ISO 25010来解释【不向老版本兼容】
                // lantext.tagwords.tags[0].forEach( (tag_name, index) => {
                //   if (tag_object[tag_name]) {
                //     flag1 = true
                //     tag_object["tag_value"] = tag_name;
                //   }
                // });
                // if (flag1) console.log("已挽回！")
              // } finally {

              // }
            } else this.$message.error('tag acquiring error');

          }).catch(error => console.log(error))
        },

        get_tagged_num(pre, comment_id) {
          if (!this.$store.state.map.comment_tag_map.has(comment_id)) return 0
          return pre + ((this.$store.state.map.comment_map.get(comment_id).tag_id_list.length > 0) ? 1 : 0)
        },

        /**
         * refresh table data
         * 更新表格数据
         * 1.页面中用到的，需要及时动态更新的数据表格共用一个变量：this.isListAlive
         * 2.在必要的时候调用这个函数来更新表格数据
         */
        refresh_table_data() {
          this.isListAlive = false
          this.$nextTick(() => {
            this.isListAlive = true
          })

        },

        //分享数据集：将某个数据集与某一位用户（手动输入，绑定为temp_username）相关联
        relateDataSet() {
          let formData1 = new FormData();
          formData1.append('username', this.temp_username);
          formData1.append('list_id', String(this.temp_dataSetId));

          console.log('sent');
          this.axios.put('/commentsList/', {
            username: this.temp_username, list_id: this.temp_dataSetId
          })
            .then(response => {
              console.log(response);
              if (response.data.msg === "ok") {
                this.$message.success("ok");
              } else this.$message.error("wrong");
            }).catch(error => console.log(error));
        },


        get_tag_categories() {
          this.axios.get('/adminview/',
            {
              params: {username: this.$store.state.currentuser}
            }).then(response => {
            // console.log(response)
            if (response.data.details) {
              response.data.details.comment_id_list.forEach(item => {
                let new_item = item.replace(/'/g, "\""); //将对象中的单引号转为双引号，确保JSON合法
                new_item = JSON.parse(new_item); //得到JSON对象
                this.$store.state.list.all_dataset_id_list =
                  [...new Set(this.$store.state.list.all_dataset_id_list.concat([new_item.commentList_id_list]))]
                //     this.dataTree.push({
                //       dataSetId : new_item.commentList_id_list,
                //       fileName : new_item.name,
                //       uploadUserName : new_item.username,
                //     });
                //   }
                // });
              })
            }
          }).catch(error => console.log(error))
        },

        /**
         * 重写类
         * 删除集合类中的某个元素
         * 影响：
         * 1.数组中少了一个元素，group数组可能为空
         * 注意：
         * 1.使用该方法删除Tag Category中的group元素时，其list属性
         * 随之销毁，用户在编写Tag Category时应当注意
         *
         * @param arr
         * @param delete_index
         */
        delete_item(arr, delete_index) {
          if (delete_index < arr.length) {
            arr.splice(delete_index, 1);
          }
        },


        create_item(arr, default_val) {
          arr.push(default_val);
        },
      }
    }
</script>

<style scoped>

</style>
