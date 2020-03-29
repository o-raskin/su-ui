<template>
    <v-card outlined class="flex-grow-1">
        <div class="d-flex flex-wrap">
            <div>
                <v-card-title class="headline pb-0">
                    {{user.name}}

                    <v-btn v-if="!isAuthorizedUserProfile && !isInWhitelist"
                           icon
                           @click="addWhitelistUser()"
                    >
<!--                            <v-img max-width="20px" src="/picture/star.svg"/>-->
                                                <v-icon small
                                                >
                                                    mdi-star
                                                </v-icon>
                    </v-btn>
                </v-card-title>

                <div class="ml-2 mr-2" v-if="isAuthorizedUserProfile">
                    <div class="status-label" v-if="!editing">
                        <span
                                @click="enableEditingStatus"
                                class="pa-2 body-2 text--secondary"
                        >
                            {{profile.status}}
                        </span>
                    </div>
                    <v-form
                            ref="form"
                            v-model="validStatus"
                            lazy-validation
                            class="status-edit pa-2 custom-card-border flex-wrap d-flex"
                            v-if="editing">
                        <v-text-field
                                outlined
                                counter="50"
                                solo
                                single-line
                                flat
                                dense
                                v-model="profile.status"
                                :rules="this.statusRules"
                        ></v-text-field>
                        <!--                        <input v-model="profile.status" class="input custom-card-border"/>-->
                        <v-btn dark rounded icon @click="cancelTempStatus">
                            <v-icon>mdi-close-circle</v-icon>
                        </v-btn>
                        <v-btn
                                :disabled="!validStatus"
                                dark rounded icon @click="commitStatus">
                            <v-icon>mdi-checkbox-marked-circle</v-icon>
                        </v-btn>
                    </v-form>
                </div>
                <div class="ml-2 mr-2" v-if="!isAuthorizedUserProfile">
                   <span class="pa-2 body-2 text--secondary">
                       {{profile.status}}
                   </span>
                </div>


                <v-tabs vertical grow>
                    <v-tabs-slider></v-tabs-slider>

                    <v-tab>
                        Profile
                    </v-tab>
                    <v-tab>
                        Followers
                    </v-tab>
                    <v-tab>
                        Following
                    </v-tab>
                    <v-tab-item>
                        <UserProfileTab :profile="profile"
                                        :user="user"
                                        :mentor="mentor"/>
                    </v-tab-item>
                    <v-tab-item>
                        <UserFollowersTab :user="user"/>
                    </v-tab-item>
                    <v-tab-item>
                        <UserFollowingTab :user="user"/>
                    </v-tab-item>
                </v-tabs>
            </div>
        </div>
    </v-card>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {ISimpleUser, IUser, SimpleUser, User} from "@/models/User";
    import {IProfile, Profile} from "@/models/Profile";
    import {ProfileAPI} from "@/api/ProfileAPI";
    import {UserAPI} from "@/api/UserAPI";
    import UserProfileTab from "@/components/home/widget/main-info/UserProfileTab.vue";
    import UserFollowersTab from "@/components/home/widget/main-info/UserFollowersTab.vue";
    import UserFollowingTab from "@/components/home/widget/main-info/UserFollowingTab.vue";
    import {State} from "vuex-class";
    import profileModule from "../../../../../store/profile-store";

    @Component({
        components: {
            UserProfileTab,
            UserFollowersTab,
            UserFollowingTab,
        },
    })
    export default class UserMainInfo extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        @State((state) => profileModule.state.currentUserProfile)
        public currentUserProfile!: IProfile;

        @Prop()
        public readonly user!: IUser;

        @Prop()
        public readonly profile!: IProfile;

        @Prop()
        public readonly mentor!: IUser;

        public editing: boolean = false;
        public tempValue: string = this.profile.status;
        public validStatus: boolean = false;

        get isAuthorizedUserProfile(): boolean {
            return this.currentUser.id === this.profile.userId
        }

        get isInWhitelist() {
            let i = this.currentUserProfile.whitelist.findIndex(u => u.id === this.user.id);
            return i !== -1;
        }

        public addWhitelistUser() {
            this.currentUserProfile.whitelist.push(this.user);
            this.$store.dispatch('updateProfile', this.currentUserProfile)
        }

        public enableEditingStatus() {
            this.tempValue = this.profile.status;
            this.editing = true;
        }

        public commitStatus() {
            this.$store.dispatch('updateProfile', this.profile)
            this.tempValue = '';
            this.editing = false;
        }

        public cancelTempStatus() {
            this.profile.status = this.tempValue;
            this.commitStatus();
        }

        data() {
            return {
                statusRules: [
                    (v: any) => (v && v.length <= 50)
                ],
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tab-max-size {
        max-width: 700px;
    }

    .status-edit {
        background: #1976d2;
    }
</style>