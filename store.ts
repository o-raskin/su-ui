import Vue from 'vue';
import Vuex from 'vuex';
import {AuthAPI} from "@/api/AuthAPI";
import {AxiosClient} from "@/api/AxiosClient";
import User from "@/models/User";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        currentUser : JSON.parse(localStorage.getItem('user-data') || '{}'),
    },
    mutations: {
        setUser(state, payload: User) {
            state.currentUser = payload;
        },
    },
    actions: {
        auth(context) {
            AuthAPI.getCurrentUser()
                .then(userData => {
                    localStorage.setItem('user-data', JSON.stringify(userData))
                    context.commit('setUser', userData)
                    // AxiosClient.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('ACCESS_TOKEN')
                })
        },
        logout() {
            localStorage.removeItem("ACCESS_TOKEN");
            localStorage.removeItem("user-data");
            document.cookie = "backend-session" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            window.location.reload()
        }
    },
})
