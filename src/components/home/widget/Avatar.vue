<template>
    <v-card outlined>

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

        <div class="ma-3">
            <v-progress-linear
                    :height="current_grade_progress_height"
                    :value="current_grade_progress"
                    dark
                    rounded
                    class="overline custom-card-border"
            >
                {{current_grade_progress + '%'}}
            </v-progress-linear>
        </div>

        <v-list class="ma-1" nav dense>
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

            <v-list-item
                    link
                    v-if="isWard"
            >
                <v-list-item-title class="text-uppercase text-center">
                    {{btn_approve_grade_text}}
                </v-list-item-title>
            </v-list-item>
        </v-list>


    </v-card>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {IProfile} from "@/models/Profile";
    import {SimpleUser, IUser} from "@/models/User";
    import {State} from "vuex-class";

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

        public userGradeProgress!: number;

        public follow() {
            this.$store.dispatch('follow', this.user.id);
            let follower = new SimpleUser(this.currentUser.id, this.currentUser.name, this.currentUser.imageUrl);
            this.user.followers.push(follower);
        }

        public unfollow() {
            this.$store.dispatch('unfollow', this.user.id);
            let follower = new SimpleUser(this.currentUser.id, this.currentUser.name, this.currentUser.imageUrl);
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

        get isWard(): boolean {
            return this.currentUser.id === this.user.mentorId
        }

        get haveInFollowers(): boolean {
            return !!this.currentUser.followings.find(e => e.id === this.user.id)
        }

        get isNotYourProfile(): boolean {
            return this.currentUser.id !== this.user.id
        }

        data() {
            return {
                btn_send_message_text: 'Chat',
                btn_follow_text: 'Follow',
                btn_unfollow_text: 'Unfollow',
                btn_approve_grade_text: 'Grade approve',

                current_grade_progress: 100,
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
</style>