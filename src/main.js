// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App.vue';
import router from './router';

import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';

/* eslint-disable no-new */

Vue.config.productionTip = false;

Vue.use(VueMaterial);

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
