import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import './style/app.css'
import router from './router'
import  './utils/rem';
import axios from'axios'
import Vant from 'vant';
import 'vant/lib/index.css';
import store from './store'//引入store
Vue.use(Vant);
Vue.prototype.axios= axios;
Vue.config.productionTip = false
Vue.use(Vuex)
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
