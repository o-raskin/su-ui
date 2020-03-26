import Vue from 'vue';
import Vuex from 'vuex';
import {UserAPI} from "@/api/UserAPI";
import {IUser} from "@/models/User";
import profile from './store/profile-store'

Vue.use(Vuex);

export const store = new Vuex.Store({

    state: {
        currentUser: JSON.parse(localStorage.getItem('user-data') || '{}'),
    },

    mutations: {
        setUser(state, payload: IUser) {
            state.currentUser = payload;
        },
    },

    actions: {
        auth: function (context) {
            UserAPI.getCurrentUser()
                .then((userData: IUser) => {
                    localStorage.setItem('user-data', JSON.stringify(userData));
                    context.commit('setUser', userData);
                    this.dispatch('fetchProfileByUserId', userData.id);
                })
        },
        logout() {
            localStorage.clear()
            document.cookie = "backend-session" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            window.location.reload()
        },

    },

    getters: {

    },

    modules: {
        profile
    }
})

export enum UserGetter {
    CURRENT_USER = 'setter.user'
}
