import {Module} from "vuex";
import {IProfile} from "@/models/Profile";
import {ProfileAPI} from "@/api/ProfileAPI";

const profileModule: Module<any, any> = {

    state: {
        currentUserProfile: JSON.parse(localStorage.getItem('profile-data') || '{}'),
    },

    mutations: {
        setProfile(state, payload: IProfile) {
            localStorage.setItem('profile-data', JSON.stringify(payload));
            state.currentUserProfile = payload;
        },
    },

    actions: {
        fetchProfileByUserId: function (context, userId: number) {
            ProfileAPI.getUserProfile(userId)
                .then(profileData => {
                    context.commit('setProfile', profileData.data);
                })
        },

        updateProfile(context, profile: IProfile) {
            if (!!profile.userId) {
                ProfileAPI.updateProfile(profile.userId, profile)
                    .then(response => {
                        context.commit('setProfile', response.data);
                    })
            }
        }
    },

    getters: {
        getCurrentUserProfile(state: any) {
            return state.currentUserProfile
        }
    },
};

export default profileModule;