import {Module} from "vuex";
import {IProfile} from "@/models/Profile";
import {ProfileAPI} from "@/api/ProfileAPI";

const profileModule: Module<any, any> = {

    state: {
        currentUserProfile: JSON.parse(localStorage.getItem('profile-data') || '{}'),
    },

    mutations: {
        setProfile(state, profile: IProfile) {
            localStorage.setItem('profile-data', JSON.stringify(profile));
            state.currentUserProfile = profile;
        },
    },

    actions: {
        fetchProfileByUserId: function (context, userId: number) {
            ProfileAPI.getUserProfile(userId)
                .then(profileData => {
                    context.commit('setProfile', profileData.data);
                })
        },

        updateProfile: function(context, profile: IProfile) {
            if (!!profile.user.id) {
                ProfileAPI.updateProfile(profile)
                    .then(response => {
                        context.commit('setProfile', response.data);
                    })
            }
        },
    },

    getters: {
        getCurrentUserProfile(state: any) {
            return state.currentUserProfile
        }
    },
};

export default profileModule;