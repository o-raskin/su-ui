<template>

    <v-card class="mx-auto pa-2">

        <div class="justify-space-between">

            <div class="flex-wrap d-flex">
                <Avatar class="ma-1"
                        :profile="profile"
                        :user="user"
                />

                <UserMainInfo

                        class="ma-1"
                        :profile="profile"
                        :user="user"
                />
            </div>

            <div class="mb-2">
                <Subordinates class="ma-1"
                              :user="user"/>
            </div>

            <div>
                <InProgressList class="ma-1"/>
            </div>

            <div class="flex-wrap d-flex">

                <UserActivity class="ma-1"/>

                <UserActivity class="ma-1"/>

            </div>

        </div>


    </v-card>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import {ProfileAPI} from "@/api/ProfileAPI";
    import {IUser, User} from "@/models/User";
    import {IProfile, Profile} from "@/models/Profile";
    import Avatar from "@/components/home/widget/Avatar.vue";
    import UserMainInfo from "@/components/home/widget/main-info/UserMainInfo.vue";
    import InProgressList from "@/components/home/widget/InProgressList.vue";
    import {UserAPI} from "@/api/UserAPI";
    import {State} from "vuex-class";
    import profileModule from "../../../store/profile-store";
    import Subordinates from "@/components/home/widget/Subordinates.vue";
    import UserActivity from "@/components/home/widget/UserActivity.vue";

    @Component({
        components: {
            Avatar,
            UserMainInfo,
            InProgressList,
            Subordinates,
            UserActivity
        },
    })
    export default class UserProfile extends Vue {

        @State((state) => profileModule.state.currentUserProfile)
        public readonly currentUserProfile!: IProfile;

        @Prop()
        public readonly user!: IUser;

        public profile: IProfile = new Profile();

        get isAuthorizedUserProfile(): boolean {
            return this.user.id === this.currentUserProfile.user.id;
        }

        mounted() {
            if (!!this.user.id) {
                if (!this.isAuthorizedUserProfile) {
                    ProfileAPI.getUserProfile(this.user.id)
                        .then((res) => {
                            this.profile = res.data;
                        })
                        .catch((error) => {
                            this.$router.push({path: '/403'})
                        });
                }
                this.profile = this.currentUserProfile;
            }
        }

        wakeAlert() {
            this.$bus.$emit('status', {text: 'MY TEXT', color: 'error'})
        }

    }
</script>