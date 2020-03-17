import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import EventBus from 'vue-bus-ts';
import moment from 'moment'
import GAuth from 'vue-google-oauth2'


const gauthOption = {
  clientId: '1474277588-78pkl6epmnpia0pql3c7ot753obmp6vp.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)

Vue.config.productionTip = false

Vue.use(EventBus);
var bus = new EventBus.Bus();

Vue.use(require('vue-moment'));
Vue.filter('formatDate', function(value : any) {
  if (value) {
    return moment(String(value),'YYYY-MM-DD').format('DD.MM.YYYY');
  }
});

new Vue({
  router,
  store,
  vuetify,
  bus,
  render: h => h(App)
}).$mount('#app')
