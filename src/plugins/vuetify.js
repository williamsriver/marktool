import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import zhHans from 'vuetify/es5/locale/zh-Hans';
import en from 'vuetify/es5/locale/en';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
  lang: {
    locales: { zhHans, en },
    current: 'zhHans',
  },
});
