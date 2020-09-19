<template>
  <v-app>

  <v-container fluid>
    <v-simple-table>
      <thead>
      <tr>
        <th class="text-left">用户名</th>
        <th class="text-left">用户类型</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,i) in users" :key="i">
        <td>{{ item.name }}</td>
        <td>{{ item.comments.length }}</td>
        <td>
          <router-link to="/dataplace" class="text-decoration-none">
            <v-btn :disabled="false">修改</v-btn>
          </router-link>
        </td>
      </tr>
      </tbody>
    </v-simple-table>
  </v-container>

  </v-app>
</template>

<script>
    export default {
        name: "admin",
      data:()=>({
        users:[
          {
            update:'2020-09-16',
            name: 'Frozen Yogurt',
            version:'1.0',
            comments: [{rating:3,cmt:'大使馆的复合弓的发挥',}],
            cmt:[{value: 335, name: '置信度：1'},
              {value: 310, name: '置信度：2'},
              {value: 234, name: '置信度：3'},
              {value: 135, name: '置信度：4'},
              {value: 1548, name: '置信度：5'}]
          },
          {
            update:'2020-09-16',
            name: 'Ice cream sandwich',
            version:'1.0',
            comments: [{rating:3,cmt:'大使馆的复合弓的发挥',}],
            cmt:[{value: 335, name: '置信度：1'},
              {value: 310, name: '置信度：2'},
              {value: 234, name: '置信度：3'},
              {value: 135, name: '置信度：4'},
              {value: 1548, name: '置信度：5'}]
          },
          {
            update:'2020-09-16',
            name: 'Eclair',
            version:'1.0',
            comments: [{rating:3,cmt:'大使馆的复合弓的发挥',}],
            cmt:[{value: 335, name: '置信度：1'},
              {value: 310, name: '置信度：2'},
              {value: 234, name: '置信度：3'},
              {value: 135, name: '置信度：4'},
              {value: 1548, name: '置信度：5'}]
          },
          {
            update:'2020-09-16',
            name: 'Cupcake',
            version:'1.0',
            comments: [{rating:3,cmt:'大使馆的复合弓的发挥',}],
            cmt:[{value: 335, name: '置信度：1'},
              {value: 310, name: '置信度：2'},
              {value: 234, name: '置信度：3'},
              {value: 135, name: '置信度：4'},
              {value: 1548, name: '置信度：5'}]
          },
          {
            update:'2020-09-16',
            name: 'Gingerbread',
            version:'1.0',
            comments: [{rating:3,cmt:'大使馆的复合弓的发挥',}],
            cmt:[{value: 335, name: '置信度：1'},
              {value: 310, name: '置信度：2'},
              {value: 234, name: '置信度：3'},
              {value: 135, name: '置信度：4'},
              {value: 1548, name: '置信度：5'}]
          },
          {
            update:'2020-09-16',
            name: 'Jelly bean',
            version:'1.0',
            comments: [{rating:3,cmt:'大使馆的复合弓的发挥',}],
            cmt:[{value: 335, name: '置信度：1'},
              {value: 310, name: '置信度：2'},
              {value: 234, name: '置信度：3'},
              {value: 135, name: '置信度：4'},
              {value: 1548, name: '置信度：5'}]
          },
          {
            update:'2020-09-16',
            name: 'Lollipop',
            version:'1.0',
            comments: [{rating:3,cmt:'大使馆的复合弓的发挥',}],
            cmt:[{value: 335, name: '置信度：1'},
              {value: 310, name: '置信度：2'},
              {value: 234, name: '置信度：3'},
              {value: 135, name: '置信度：4'},
              {value: 1548, name: '置信度：5'}]
          },
        ],
      })
    }
</script>

<style scoped>

</style>
