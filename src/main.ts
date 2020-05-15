import Vue from 'vue'
import App from './App.vue'
import {routes} from './router'
import vuetify from './plugins/vuetify';
import EventBus from 'vue-bus-ts';
import moment from 'moment'
import VueRouter from "vue-router";


Vue.config.productionTip = false

/**
 *    EVENTS
 */
Vue.use(EventBus);
var bus = new EventBus.Bus();

/**
 *    DATE FORMATTER
 */
Vue.use(require('vue-moment'));
Vue.filter('formatDate', function (value: any) {
    if (value) {
        return moment(String(value), 'YYYY-MM-DD').format('DD.MM.YYYY');
    }
});
Vue.filter('formatDateTime', function (value: any) {
    if (value) {
        let d = moment(String(value)).format('HH:MM DD.MM.YYYY');
        if (!d || d === 'Invalid date') {
            d = moment(String(value), 'YYYY-MM-DD').format('DD.MM.YYYY');
        }
        return d;
    }
});

/**
 *    ROUTER
 */
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

/**
 *     STORE
 */
const {store} = require("../store");


new Vue({
    router,
    store,
    vuetify,
    bus,
    render: h => h(App)
}).$mount('#app')
