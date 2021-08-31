<template>
  <div id="app" style="margin: 0;">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () {
    return {
      reload:this.reload
    }
  },
  data:()=>({
    isRouterAlive : true
  }),
  methods: {
    reload(){
      this.isRouterAlive =false;
      this.$nextTick(()=>{
        console.log('reload')
        this.isRouterAlive =true;
      });
    },
  }
};
</script>
