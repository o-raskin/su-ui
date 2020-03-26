<template>
    <v-container fluid align="center" justify="center" ml-0 mr-0>
        <v-card outlined class="mx-auto pa-2">

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
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {State} from 'vuex-class'
    import StatusReport from "@/components/status-report/StatusReport.vue";
    import Login from "@/components/auth/login/Login.vue";
    import {ProfileAPI} from "@/api/ProfileAPI";
    import {IUser, User} from "@/models/User";
    import {IProfile, Profile} from "@/models/Profile";
    import Avatar from "@/components/home/widget/Avatar.vue";
    import UserMainInfo from "@/components/home/widget/main-info/UserMainInfo.vue";
    import InProgressList from "@/components/home/widget/InProgressList.vue";
    import {UserAPI} from "@/api/UserAPI";

    @Component({
        components: {
            Login,
            StatusReport,
            Avatar,
            UserMainInfo,
            TODOList: InProgressList
        },
    })
    export default class Home extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        public user: IUser = new User();
        public mentor: IUser = new User();
        public profile: IProfile = new Profile();

        mounted() {
            let userId = this.currentUser.id;
            this.user = this.currentUser;

            if (!!this.$route.params.id) {
                userId = +this.$route.params.id;

                UserAPI.getUserById(userId)
                    .then((res) => {
                        this.user = res.data;
                    })
                    .catch((error) => {
                        this.$router.push({path: '/404'})
                    });
            }
            ProfileAPI.getUserProfile(userId)
                .then((res) => {
                    this.profile = res.data;

                    if (!!this.user.mentorId) {
                        UserAPI.getUserById(this.user.mentorId)
                            .then((res) => {
                                this.mentor = res.data;
                            })
                    }
                })
                .catch((error) => {
                    this.$router.push({path: '/404'})
                });
        }

        wakeAlert() {
            this.$bus.$emit('status', {text: 'MY TEXT', color: 'error'})
        }

    }
</script>