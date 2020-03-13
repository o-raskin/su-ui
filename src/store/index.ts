import Vue from 'vue'
import Vuex, {StoreOptions} from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
    }
})
// const state = {
//     status: {
//         visible: false,
//         color: 'info',
//         text: '...',
//         multiline: true,
//         timeout: 6000
//     },
// };
//
// const mutations = {
//     WAKE_STATUS({state, text, color}: { state: any, text: string, color: string }) {
//         state.status.text = text;
//         state.status.color = color;
//     }
// };
//
// const actions = {
//     inform({ context, color, text}: { context: any, color: string, text: string }) {
//         context.commit("WAKE_STATUS", color, text);
//     }
// };
//
// const getters = {
//     getStatus({state}: { state: any }): { visible: boolean, color: string, text: string, multiline: boolean, timeout: number } {
//         return state.status;
//     }
// };

