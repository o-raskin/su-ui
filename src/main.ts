import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import EventBus from 'vue-bus-ts';
import moment from 'moment'

Vue.config.productionTip = false

Vue.use(EventBus);
var bus = new EventBus.Bus();

Vue.use(require('vue-moment'));
Vue.filter('formatDate', function(value : any) {
  if (value) {
    let d = moment(String(value),'YYYY-MM-DD').format('DD.MM.YYYY');
    debugger
    return d
  }
});

new Vue({
  router,
  store,
  vuetify,
  bus,
  render: h => h(App)
}).$mount('#app')
