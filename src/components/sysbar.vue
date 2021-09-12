<template>
  <v-app>
    <!--系统栏-->
    <v-system-bar
      color="#18a06e"
      style="color:white;"
       height="43">
      <v-row>

        <v-col cols="5" align-self="center">
          <v-main class="text-left" >
            {{lantext.words.system_title[this.$store.state.lanType]}}
            v1.210912
          </v-main>
        </v-col>

        <v-spacer></v-spacer>

        <v-col cols="2" align-self="center">
          <v-select
            dense filled flat hide-details
            dark
            color="white"
            v-model="lanValue"
            :items="lanlist">
          </v-select>
        </v-col>

        <v-col cols="1" align-self="center">
          <span >{{nowtime}}</span>
        </v-col>

      </v-row>

    </v-system-bar>
    <router-view/>
  </v-app>
</template>

<script>
    import lantext from "../lib/lantext";
    export default {
        name: "sysbar",
      data:()=>({
        lantext:lantext,
        lanValue:'中文',
        lanlist:['English','中文'],




        nowtime:'',
        timer:'',//计时器
      }),

      computed:{
        lanPointer(){
          switch (this.lanValue) {
            case "English":return 0;
            case "中文":return 1;
            default : return  1;
          }
        }
      },

      watch:{
        lanValue(){
          switch (this.lanValue) {
            case "english":this.$store.state.lanType = 0; break;
            case "中文":this.$store.state.lanType = 1; break;
            default : this.$store.state.lanType = 0; break;
          }
        }
      },
      mounted(){
        this.getTime()
        this.timer = setInterval(this.getTime, 10000);
      },
      beforeDestroy() {
        clearInterval(this.timer);
      },
      methods:{
        //获取时间
        getTime(){
          var date=new Date();
          this.nowtime=date.getHours()+":";
          if (date.getMinutes()<10) this.nowtime+='0'+date.getMinutes();
          else this.nowtime+=date.getMinutes();
        },
      },
    }
</script>

<style scoped>

</style>
