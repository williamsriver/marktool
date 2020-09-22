<template>
<v-app>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-main class="text-center font-weight-bold text-h3">{{lantext.words.welcome[$store.state.lanType]}}</v-main>
      </v-col>
    </v-row>

    <v-row v-show="$store.state.loginstatus">
      <v-col>
        <v-main class="text-center font-weight-bold text-h4">Welcome! {{$store.state.currentuser}}</v-main>
      </v-col>
    </v-row>
  </v-container>

</v-app>
</template>

<script>
  import lantext from "../lib/lantext";
    export default {
        name: "homemenu",
      data:()=>({
        lantext:lantext,
      }),
    }
</script>

<style scoped>

</style>
