<template>
    <v-card
            outlined
            max-width="400"
    >
        <div class="d-flex flex-wrap">
            <div>
                <v-card-title class="headline">
                    {{user.name}}
                </v-card-title>

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
                        <UserFollowersTab />
                    </v-tab-item>
                    <v-tab-item>
                        <UserFollowingTab />
                    </v-tab-item>
                </v-tabs>
            </div>
        </div>
    </v-card>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {IUser, User} from "@/models/User";
    import {IProfile, Profile} from "@/models/Profile";
    import {ProfileAPI} from "@/api/ProfileAPI";
    import {UserAPI} from "@/api/UserAPI";
    import UserProfileTab from "@/components/home/widget/main-info/UserProfileTab.vue";
    import UserFollowersTab from "@/components/home/widget/main-info/UserFollowersTab.vue";
    import UserFollowingTab from "@/components/home/widget/main-info/UserFollowingTab.vue";

    @Component({
        components: {
            UserProfileTab,
            UserFollowersTab,
            UserFollowingTab,
        },
    })
    export default class UserMainInfo extends Vue {

        @Prop()
        public readonly user!: IUser;

        @Prop()
        public readonly profile!: IProfile;

        @Prop()
        public readonly mentor!: IUser;

        data() {
            return {
            }
        }
    }
</script>