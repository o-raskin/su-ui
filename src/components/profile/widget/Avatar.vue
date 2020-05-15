<template>
    <v-card outlined max-width="204px">

        <div class="d-flex flex-wrap">

            <v-avatar
                    class="ma-3 avatar custom-card-border"
                    rounded
                    size="180"
                    tile
            >
                <v-img class="ma-1" :src="user.imageUrl"></v-img>
            </v-avatar>

        </div>

        <!--        v-if="!!this.user.position && !!this.user.grade"-->
        <div class="text-center">
            <span class="text--primary body-2 breakable-text">
                {{userPositionText + ' '}}
            </span>
            <br/>
            <span class="text--secondary caption breakable-text">
                {{userGradeText}}
            </span>
        </div>

        <div class="ma-3">
            <v-progress-linear
                    :height="current_grade_progress_height"
                    :value="skillsUser.gradeProgress"
                    :dark="skillsUser.gradeProgress > 50"
                    rounded
                    class="overline custom-card-border"
            >
                {{skillsUser.gradeProgress + '%'}}
            </v-progress-linear>
        </div>

        <v-list class="ma-1" nav dense>
            <v-tooltip bottom v-if="isWard && isReadyToUp && nextGradeExists">
                <template v-slot:activator="{ on }">
                        <v-list-item
                                v-on="on"
                                link
                                class="pa-0"
                                @click="approveGrade()"
                        >
                            <v-list-item-title class="text-uppercase text-center">
                                <v-btn dark class="pl-5 pr-5" color="green">
                                    {{btn_approve_grade_text}}
                                </v-btn>
                            </v-list-item-title>
                        </v-list-item>
                </template>
                <span>User get enough progress in current grade, you can approve he's grade up</span>
            </v-tooltip>


            <v-list-item
                    link
                    v-if="isNotYourProfile"
            >
                <v-list-item-title class="text-uppercase text-center">
                    {{btn_send_message_text}}
                </v-list-item-title>
            </v-list-item>

            <v-list-item
                    @click="follow()"
                    link
                    v-if="followBtnEnable"
            >
                <v-list-item-title class="text-uppercase text-center">
                    {{btn_follow_text}}
                </v-list-item-title>
            </v-list-item>

            <v-list-item
                    @click="unfollow()"
                    link
                    v-if="unfollowBtnEnable"

            >
                <v-list-item-title class="text-uppercase text-center">
                    {{btn_unfollow_text}}
                </v-list-item-title>
            </v-list-item>
        </v-list>


    </v-card>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {IProfile} from "@/models/Profile";
    import {SimpleUser, IUser} from "@/models/User";
    import {State} from "vuex-class";
    import {SkillsAPI} from "@/api/SkillsAPI";
    import {ISkillsUser} from "@/models/SkillsUser";
    import {SkillsGradeAPI} from "@/api/SkillsGradeAPI";

    @Component({
        components: {},
    })
    export default class Avatar extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        @Prop()
        public readonly user!: IUser;

        @Prop()
        public profile!: IProfile;

        @Prop()
        public skillsUser!: ISkillsUser;

        public userGradeProgress!: number;

        public approveGrade() {
            SkillsGradeAPI.raiseUserGrade(this.user)
                .then(r => this.skillsUser = r.data);
        }

        public follow() {
            this.$store.dispatch('follow', this.user.id);
            let follower = new SimpleUser(this.currentUser.id, this.currentUser.name, this.currentUser.imageUrl,
                this.currentUser.position);
            this.user.followers.push(follower);
        }

        public unfollow() {
            this.$store.dispatch('unfollow', this.user.id);
            let follower = new SimpleUser(this.currentUser.id, this.currentUser.name, this.currentUser.imageUrl,
                this.currentUser.position);
            this.user.followers.splice(this.user.followers.indexOf(follower), 1);
        }

        get isEditableStatus(): boolean {
            return this.currentUser.id === this.user.id
        }

        get gradeApproveBtnEnable(): boolean {
            return this.userGradeProgress === 100 && this.isWard
        }

        get followBtnEnable(): boolean {
            return this.isNotYourProfile && !this.haveInFollowers
        }

        get unfollowBtnEnable(): boolean {
            return this.isNotYourProfile && this.haveInFollowers
        }

        get isReadyToUp(): boolean {
            if (this.skillsUser && this.skillsUser.gradeProgress === 100) {
                return true
            }
            return false;
        }

        get nextGradeExists() : boolean {
            if (this.skillsUser.grade) {
                return !!this.skillsUser.grade.nextGradeId
            }
            return false;
        }

        get isWard(): boolean {
            return !!this.user.mentor && this.currentUser.id === this.user.mentor.id;
        }

        get haveInFollowers(): boolean {
            return !!this.currentUser.followings.find(e => e.id === this.user.id)
        }

        get isNotYourProfile(): boolean {
            return this.currentUser.id !== this.user.id
        }

        get userPositionText(): string {
            let userPosition = this.user.position;
            if (!!userPosition) {
                return this.user.position.name;
            } else {
                return '';
            }
        }

        get userGradeText(): string {
            if (this.skillsUser && this.skillsUser.grade) {
                return this.skillsUser.grade.name;
            } else {
                return '';
            }
        }

        data() {
            return {
                btn_send_message_text: 'Chat',
                btn_follow_text: 'Follow',
                btn_unfollow_text: 'Unfollow',
                btn_approve_grade_text: 'Approve grade',

                current_grade_progress_height: 20,
            }
        }
    }
</script>

<style lang="scss" scoped>
    .avatar {
        border-radius: 4px;
    }

    .action-btn {
        font-weight: bold;
    }

    .breakable-text {
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
    }
</style>