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
                    <v-avatar size="25">
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

                        <v-list-item-action>
                            <v-btn
                                    :class="fav ? 'red--text' : ''"
                                    icon
                                    @click="fav = !fav"
                            >
                                <v-icon>mdi-heart</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>

                <v-divider></v-divider>

<!--                <v-list>-->
<!--                    <v-list-item>-->
<!--                        <v-list-item-action>-->
<!--                            <v-switch v-model="message" color="purple"></v-switch>-->
<!--                        </v-list-item-action>-->
<!--                        <v-list-item-title>Enable messages</v-list-item-title>-->
<!--                    </v-list-item>-->

<!--                    <v-list-item>-->
<!--                        <v-list-item-action>-->
<!--                            <v-switch v-model="hints" color="purple"></v-switch>-->
<!--                        </v-list-item-action>-->
<!--                        <v-list-item-title>Enable hints</v-list-item-title>-->
<!--                    </v-list-item>-->
<!--                </v-list>-->

                <v-card-actions>
                    <v-btn color="primary" text @click.prevent="logout">LOGOUT</v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </v-app-bar>
</template>

<script>
    import Component from "vue-class-component";
    import Vue from "vue";

    export default {
        name: 'Header',
        data () {
            return {
                main_title: ['Skill', 'Up', 'sys.']
            }
        },
        methods: {
            logout() {
                this.$store.dispatch("logout")
            }
        },
        computed: {
            currentUser() {
                return this.$store.state.currentUser
            },
            isAuthenticated() {
                return this.$store.state.currentUser.id;
            }
        },
    }
</script>
