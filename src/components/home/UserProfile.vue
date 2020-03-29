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
                        :mentor="mentor"
                />


            </div>

            <TODOList class="ma-1"/>

            <!--                <UserActivity/>-->

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

    @Component({
        components: {
            Avatar,
            UserMainInfo,
            TODOList: InProgressList
        },
    })
    export default class UserProfile extends Vue {

        @State((state) => profileModule.state.currentUserProfile)
        public readonly currentUserProfile!: IProfile;

        @Prop()
        public readonly user!: IUser;

        public mentor: IUser = new User();
        public profile: IProfile = new Profile();

        get isAuthorizedUserProfile() : boolean {
            return this.user.id === this.currentUserProfile.userId
        }

        mounted() {
            if (!!this.user.id) {
                if (!this.isAuthorizedUserProfile) {
                    ProfileAPI.getUserProfile(this.user.id)
                        .then((res) => {
                            this.profile = res.data;
                            if (!!this.user.mentorId) {
                                this.fetchMentor()
                            }
                        })
                        .catch((error) => {
                            this.$router.push({path: '/404'})
                        });
                } {
                    this.profile = this.currentUserProfile
                    this.fetchMentor()
                }
            }
        }

        public fetchMentor() {
            if (!!this.user.mentorId) {
                UserAPI.getUserById(this.user.mentorId)
                    .then((res) => {
                        this.mentor = res.data;
                    })
            }
        }

        wakeAlert() {
            this.$bus.$emit('status', {text: 'MY TEXT', color: 'error'})
        }

    }
</script>