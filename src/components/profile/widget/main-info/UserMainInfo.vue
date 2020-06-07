<template>
    <v-card outlined class="flex-grow-1">
        <div class="d-flex flex-wrap">
            <div>
                <v-card-title class="headline pb-0">
                    {{user.name}}
                    <!--    EXTRA ACTIONS   -->
                    <div v-if="!isAuthorizedUserProfile && !isInWhitelist">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                        v-on="on"

                                        icon
                                        @click="addWhitelistUser()"
                                >
                                    <v-icon small
                                    >
                                        mdi-star
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t('profile.widget.main_info.whitelist_action') }}</span>
                        </v-tooltip>
                    </div>

                    <div v-if="!isAuthorizedUserProfile && isWard">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                        v-on="on"
                                        icon
                                        @click="goToSubordinateSkillBoard()"
                                >
                                    <v-icon small>
                                        mdi-format-list-checks
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t('profile.widget.main_info.skill_board_action') }}</span>
                        </v-tooltip>
                    </div>

                </v-card-title>

                <div class="ml-4 mr-2 mb-2" v-if="isAuthorizedUserProfile">
                    <div class="status-label" v-if="!editing">
                        <span
                                @click="enableEditingStatus"
                                class="body-2 text--secondary"
                        >
                            {{profileStatus}}
                        </span>
                    </div>
                    <v-form
                            ref="form"
                            v-model="validStatus"
                            lazy-validation
                            class="my-auto custom-box-shadow status-edit custom-card-border flex-wrap d-flex"
                            v-if="editing">
                        <v-text-field
                                class="mt-1 pl-1 edit-status-field"
                                hide-details
                                outlined
                                counter="50"
                                solo
                                single-line
                                flat
                                dense
                                v-model="profile.status"
                                :rules="this.statusRules"
                        ></v-text-field>
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
                       {{profileStatus}}
                   </span>
                </div>

                <v-tabs vertical grow class="main-info-widget-content-height overflow-y-auto">
                    <v-tabs-slider></v-tabs-slider>

                    <v-tab>
                        {{ $t('profile.widget.main_info.profile_tab.title') }}
                    </v-tab>
                    <v-tab>
                        {{ $t('profile.widget.main_info.followers_tab.title') }}
                    </v-tab>
                    <v-tab>
                        {{ $t('profile.widget.main_info.following_tab.title') }}
                    </v-tab>
                    <v-tab-item>
                        <UserProfileTab :profile="profile"
                                        :user="user"/>
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
    import UserProfileTab from "@/components/profile/widget/main-info/UserProfileTab.vue";
    import UserFollowersTab from "@/components/profile/widget/main-info/UserFollowersTab.vue";
    import UserFollowingTab from "@/components/profile/widget/main-info/UserFollowingTab.vue";
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

        public editing: boolean = false;
        public tempValue: string = this.profile.status;
        public validStatus: boolean = false;

        get profileStatus(): string {
            if ((!this.profile.status || this.profile.status === '') && this.isAuthorizedUserProfile) {
                return '...'
            }
            return this.profile.status;
        }

        get isAuthorizedUserProfile(): boolean {
            return !!this.profile.user && this.currentUser.id === this.profile.user.id
        }

        get isInWhitelist() {
            let i = this.currentUserProfile.whitelist.findIndex(u => u.id === this.user.id);
            return i !== -1;
        }

        get isWard(): boolean {
            return !!this.user.mentor && this.currentUser.id === this.user.mentor.id;
        }

        public addWhitelistUser() {
            this.currentUserProfile.whitelist.push(this.user);
            this.$store.dispatch('updateProfile', this.currentUserProfile)
        }

        public goToSubordinateSkillBoard() {
            if (this.isWard) {
                this.$router.push({
                    name: 'UserSkillBoard',
                    params:
                        {
                            id: this.user.id.toString()
                        }
                });
            }
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
                    (v: any) => (v && v.length <= 50 || v.length == 0)
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

    .custom-box-shadow {
        box-shadow: 0 0 8px rgba(0,0,0,0.5);
    }

    .edit-status-field {
        font-size: 10pt;

        ::v-deep .v-input__slot {
            min-height: 5px !important;
        }
    }

    .main-info-widget-content-height {
        max-height: 320px;
    }
</style>