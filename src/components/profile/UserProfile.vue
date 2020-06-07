<template>

    <v-card class="mx-auto pa-2">

        <div class="justify-space-between">

            <div class="flex-wrap d-flex">
                <Avatar class="ma-1"
                        :profile="profile"
                        :user="user"
                        :skillsUser="skillsUser"
                />

                <UserMainInfo

                        class="ma-1"
                        :profile="profile"
                        :user="user"
                />
            </div>

            <div class="ma-0 pa-0">
                <Subordinates class="ma-1"
                              :user="user"/>
            </div>

            <div class="ma-0 pa-0 flex-wrap d-flex">

                <UserActivity :user="user"
                              :skillsUser="skillsUser"
                              class="flex-grow-1 ma-1"/>

                <History class="flex-grow-1 ma-1"
                         :user="user"
                         :skillsUser="skillsUser"/>

                <InProgressList class="flex-grow-1 ma-1"
                                :user="user"
                                :skillsUser="skillsUser"/>

            </div>

            <Grades class="flex-grow-1 ma-1" :user="user"
                     :skillsUser="skillsUser"/>

        </div>


    </v-card>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import {ProfileAPI} from "@/api/ProfileAPI";
    import {IUser, User} from "@/models/User";
    import {IProfile, Profile} from "@/models/Profile";
    import Avatar from "@/components/profile/widget/Avatar.vue";
    import UserMainInfo from "@/components/profile/widget/main-info/UserMainInfo.vue";
    import InProgressList from "@/components/profile/widget/GradeProgress.vue";
    import {UserAPI} from "@/api/UserAPI";
    import {State} from "vuex-class";
    import profileModule from "../../../store/profile-store";
    import Subordinates from "@/components/profile/widget/Subordinates.vue";
    import UserActivity from "@/components/profile/widget/Activity.vue";
    import History from "@/components/profile/widget/History.vue";
    import Grades from "@/components/profile/widget/Achievements.vue";
    import {SkillsAPI} from "@/api/SkillsAPI";
    import {ISkillsUser, SkillsUser} from "@/models/SkillsUser";

    @Component({
        components: {
            Avatar,
            UserMainInfo,
            InProgressList,
            Subordinates,
            UserActivity,
            History,
            Grades
        },
    })
    export default class UserProfile extends Vue {

        @State((state) => profileModule.state.currentUserProfile)
        public readonly currentUserProfile!: IProfile;

        @Prop()
        public readonly user!: IUser;

        public profile: IProfile = new Profile();

        public skillsUser: ISkillsUser = new SkillsUser();

        public dialog: boolean = false;

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

                SkillsAPI.getUserById(this.user.id)
                    .then(r => {
                        this.skillsUser = r.data
                    });
            }
        }

        wakeAlert() {
            this.$bus.$emit('status', {text: 'MY TEXT', color: 'error'})
        }

    }
</script>