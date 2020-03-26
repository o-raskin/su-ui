<template>
    <v-app-bar clipped-left class="primary" dark app>

        <v-toolbar-title class="white--text headline text-uppercase">
            <span class="font-weight-light">{{main_title[0]}} </span> -
            <span class="font-weight-bold">{{main_title[1]}} </span>
            <span class="overline">{{main_title[2]}}</span>
        </v-toolbar-title>

        <v-spacer></v-spacer>


        <v-menu v-if="isAuthenticated" bottom left :close-on-content-click="false">
            <template v-slot:activator="{ on }">
                <v-btn dark icon v-on="on">
                    <v-avatar size="30">
                        <img :src="currentUser.imageUrl">
                    </v-avatar>
                </v-btn>
            </template>

            <v-card>
                <v-list>
                    <v-list-item>
                        <v-list-item-avatar size="50">
                            <img :src="currentUser.imageUrl">
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title>{{currentUser.name}}</v-list-item-title>
                            <v-list-item-subtitle>{{currentUser.email}}</v-list-item-subtitle>
                        </v-list-item-content>

                    </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list>
                    <v-list-item>
                        <v-list-item-action>
                            <v-switch
                                    v-model="currentUserProfile.visibility"
                                    v-on:change="updateCurrentUserProfile()"
                                    color="primary"
                            >
                            </v-switch>
                        </v-list-item-action>
                        <v-list-item-title v-if="currentUserProfile.visibility">
                            {{visible_profile_text}}
                        </v-list-item-title>
                        <v-list-item-title v-if="!currentUserProfile.visibility">
                            {{invisible_profile_text}}
                            <span
                                    class="caption text-break"
                                    v-if="!currentUserProfile.visibility">
                                <br/>{{invisible_profile_subtitle_text}}
                            </span>
                        </v-list-item-title>
                    </v-list-item>

                    <!--                    <v-list-item>-->
                    <!--                        <v-list-item-action>-->
                    <!--                            <v-switch v-model="hints" color="purple"></v-switch>-->
                    <!--                        </v-list-item-action>-->
                    <!--                        <v-list-item-title>Enable hints</v-list-item-title>-->
                    <!--                    </v-list-item>-->
                </v-list>

                <v-card-actions>
                    <v-btn color="primary" text @click.prevent="logout">LOGOUT</v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </v-app-bar>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {State} from "vuex-class";
    import {IProfile} from "@/models/Profile";
    import {IUser} from "@/models/User";
    import profileModule from "../../../store/profile-store";

    @Component({
        components: {},
    })
    export default class Home extends Vue {

        @State((state) => profileModule.state.currentUserProfile)
        public currentUserProfile!: IProfile;

        @State((state) => state.currentUser)
        public currentUser!: IUser;

        data() {
            return {
                main_title: ['Skill', 'Up', 'sys.'],
                visible_profile_text: 'Visible profile',
                invisible_profile_text: 'Invisible profile',
                invisible_profile_subtitle_text: 'Only important and users in your whitelist can see this page',
            }
        }

        public updateCurrentUserProfile() {
            this.$store.dispatch('updateProfile', this.currentUserProfile)
        }

        public logout() {
            this.$store.dispatch("logout")
        }

        get isAuthenticated() {
            return !!this.$store.state.currentUser.id;
        }
    }
</script>