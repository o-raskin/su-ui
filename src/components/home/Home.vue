<template>
    <v-container fluid align="center" justify="center" ml-0 mr-0>

        <UserProfile :key="getUser.id" :user="getUser"/>

    </v-container>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {State} from 'vuex-class'
    import StatusReport from "@/components/status-report/StatusReport.vue";
    import {IUser, User} from "@/models/User";
    import {UserAPI} from "@/api/UserAPI";
    import UserProfile from "@/components/home/UserProfile.vue";

    @Component({
        components: {
            StatusReport,
            UserProfile
        },
    })
    export default class Home extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        public anotherUser: IUser = new User();

        /**
         *  Check that it's profile of current authorized user
         */
        get isAuthorizedUserProfile(): boolean {
            return !this.$route.params.id || +this.$route.params.id === this.currentUser.id;
        }

        /**
         *  Current profile user
         */
        get getUser() {
            return !this.isAuthorizedUserProfile ? this.anotherUser : this.currentUser;
        }

        /**
         *  Listener of changing profile page
         */
        @Watch('getUser.id')
        public onUserChange(newVal: number, oldVal: number) {
            this.fetchUser();
        }

        /**
         *  Trigger to fetch user on direct profile load
         */
        mounted() {
            this.fetchUser()
        }

        public fetchUser() {
            if (!this.isAuthorizedUserProfile) {
                let userId = +this.$route.params.id;
                UserAPI.getUserById(userId)
                    .then((res) => {
                        this.anotherUser = res.data;
                    })
                    .catch((error) => {
                        this.$router.push({path: '/404'})
                    });
            } else {
                this.$store.dispatch('updateCurrentUserData')
            }
        }

        wakeAlert() {
            this.$bus.$emit('status', {text: 'MY TEXT', color: 'error'})
        }

    }
</script>