import Vue from 'vue';
import Vuex from 'vuex';
import {UserAPI} from "@/api/UserAPI";
import {ISimpleUser, IUser} from "@/models/User";
import profile from './store/profile-store'

Vue.use(Vuex);

export const store = new Vuex.Store({

    state: {
        currentUser: JSON.parse(localStorage.getItem('user-data') || '{}'),
    },

    mutations: {
        setUser(state, payload: IUser) {
            localStorage.setItem('user-data', JSON.stringify(payload));
            state.currentUser = payload;
        },
        addFollowing(state, payload: ISimpleUser) {
            state.currentUser.followings.push(payload)
            localStorage.setItem('user-data', JSON.stringify(state.currentUser));
        },
        removeFollowing(state, payload: ISimpleUser) {
            state.currentUser.followings.splice(state.currentUser.followings.indexOf(payload), 1);
            localStorage.setItem('user-data', JSON.stringify(state.currentUser));
        }
    },

    actions: {
        updateCurrentUserData: function (context) {
            UserAPI.getCurrentUser()
                .then((userData: IUser) => {
                    context.commit('setUser', userData);
                    this.dispatch('fetchProfileByUserId', userData.id);
                })
        },
        follow: function (context, userId) {
            UserAPI.followUser(userId, context.state.currentUser.id)
                .then(e => {
                    context.commit('addFollowing', e.data);
                })
        },
        unfollow: function (context, userId) {
            UserAPI.unfollowUser(userId, context.state.currentUser.id)
                .then(e => {
                    context.commit('removeFollowing', e.data);
                })
        },
        logout: function () {
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
