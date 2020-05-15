<template>
    <v-app-bar clipped-left class="primary" dark app>

        <v-toolbar-title class="white--text headline text-uppercase">
            <span class="font-weight-light">{{main_title[0]}} </span> -
            <span class="font-weight-bold">{{main_title[1]}} </span>
            <span class="overline">{{main_title[2]}}</span>
        </v-toolbar-title>

        <v-spacer></v-spacer>

<!--        <v-menu v-if="isAuthenticated"-->
<!--                bottom-->
<!--                left-->
<!--                :close-on-content-click="false">-->
<!--            <template v-slot:activator="{ on }">-->
<!--                <v-btn dark icon v-on="on">-->
<!--                    <v-badge-->
<!--                            color="green"-->
<!--                            overlap-->
<!--                            content="23"-->
<!--                    >-->
<!--                        <v-icon>-->
<!--                            mdi-bell-->
<!--                        </v-icon>-->
<!--                    </v-badge>-->
<!--                </v-btn>-->
<!--            </template>-->

<!--            <v-card>-->
<!--                <v-list dense>-->
<!--                    <v-divider></v-divider>-->

<!--                    <v-list-item>-->
<!--                        <v-list-item-title>-->
<!--                            {{logout_btn_text}}-->
<!--                        </v-list-item-title>-->
<!--                    </v-list-item>-->
<!--                </v-list>-->
<!--            </v-card>-->
<!--        </v-menu>-->

        <v-menu v-if="isAuthenticated"
                bottom
                left
                :close-on-content-click="false">
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

                <ProfileSettings/>

                <v-divider></v-divider>

                <v-list-item

                        @click.prevent="logout"
                >
                    <v-list-item-avatar>
                        <v-icon>
                            mdi-logout-variant
                        </v-icon>
                    </v-list-item-avatar>
                    <v-list-item-title>
                        {{logout_btn_text}}
                    </v-list-item-title>
                </v-list-item>
                <!--                    <v-btn color="primary" text @click.prevent="logout">LOGOUT</v-btn>-->
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
    import ProfileSettings from "@/components/profile/ProfileSettings.vue"

    @Component({
        components: {
            ProfileSettings
        },
    })
    export default class Header extends Vue {

        @State((state) => state.currentUser)
        public currentUser!: IUser;

        data() {
            return {
                logout_btn_text: 'Logout',
                main_title: ['Skill', 'Up', 'sys.'],
            }
        }

        public logout() {
            this.$store.dispatch("logout")
        }

        get isAuthenticated() {
            return !!this.$store.state.currentUser.id;
        }
    }
</script>