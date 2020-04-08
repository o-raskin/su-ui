<template>
    <v-card class="pa-3">
        <v-data-iterator
                :items="profiles"
                :items-per-page.sync="itemsPerPage"
                :page="page"
                :search="search"
                :sort-by="sortBy.toLowerCase()"
                :sort-desc="sortDesc"
                hide-default-footer
        >
            <template v-slot:header>
                <v-toolbar
                        dark
                        color="blue darken-3"
                        class="mb-1"
                >
                    <v-text-field
                            v-model="search"
                            clearable
                            flat
                            solo-inverted
                            hide-details
                            label="Search"
                    />
                    <template v-if="$vuetify.breakpoint.mdAndUp">
                        <v-spacer></v-spacer>
                        <v-select
                                v-model="sortBy"
                                flat
                                solo-inverted
                                hide-details
                                :items="keys"
                                label="Sort by"
                        ></v-select>
                        <v-spacer></v-spacer>
                        <v-btn-toggle
                                v-model="sortDesc"
                                mandatory
                        >
                            <v-btn
                                    large
                                    depressed
                                    color="blue"
                                    :value="false"
                            >
                                <v-icon>mdi-arrow-up</v-icon>
                            </v-btn>
                            <v-btn
                                    large
                                    depressed
                                    color="blue"
                                    :value="true"
                            >
                                <v-icon>mdi-arrow-down</v-icon>
                            </v-btn>
                        </v-btn-toggle>
                    </template>
                </v-toolbar>
            </template>

            <template v-slot:default="props">
                <v-row>
                    <v-col
                            v-for="item in props.items"
                            :key="item.user.id"
                            cols="12"
                            sm="6"
                            md="4"
                            lg="3"
                    >
                        <v-card @click="goToUserProfile(item.user.id)">

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title class="subtitle-1 mb-1">{{ item.user.name }}</v-list-item-title>
                                </v-list-item-content>

                                <v-list-item-avatar
                                        tile
                                        class="custom-card-border"
                                        size="80"
                                >
                                    <v-img :src="item.user.imageUrl"></v-img>
                                </v-list-item-avatar>
                            </v-list-item>

                            <v-divider></v-divider>

                            <v-list dense>
                                <v-list-item
                                        v-for="(key, index) in keys"
                                        :key="index"
                                        class="body-2"
                                >
                                    <v-list-item-content :class="{ 'blue--text': sortBy === key }">
                                        {{ key }}:
                                    </v-list-item-content>
                                    <v-list-item-content class="align-end"
                                                         :class="{ 'blue--text': sortBy === key }">
                                        {{item.user[key.toLowerCase()] }}
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>

                        </v-card>
                    </v-col>
                </v-row>
            </template>

            <template v-slot:footer>

                <v-row class="mt-2" align="center" justify="center">
                    <span class="grey--text">Items per page</span>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn
                                    dark
                                    text
                                    color="primary"
                                    class="ml-2"
                                    v-on="on"
                            >
                                {{ itemsPerPage }}
                                <v-icon>mdi-chevron-down</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item
                                    v-for="(number, index) in itemsPerPageArray"
                                    :key="index"
                                    @click="updateItemsPerPage(number)"
                            >
                                <v-list-item-title>{{ number }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>

<!--                    <v-spacer></v-spacer>-->

                    <span class="mr-4 grey--text">
                        Page {{ page }} of {{ numberOfPages }}
                    </span>

                    <v-btn
                            outlined
                            dark
                            color="blue darken-3"
                            @click="formerPage"
                    >
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn
                            outlined
                            dark
                            color="blue darken-3"
                            class="ml-1"
                            @click="nextPage"
                    >
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                </v-row>
            </template>
        </v-data-iterator>
    </v-card>

    <!--    <v-card-->
    <!--            max-width="500"-->
    <!--            class="mx-auto"-->
    <!--    >-->

    <!--        <v-list two-line subheader>-->
    <!--            <v-subheader>Employees</v-subheader>-->

    <!--            <v-list-item-->
    <!--                    v-for="profile in this.profiles"-->
    <!--                    :key="profile.user.id"-->
    <!--                    @click="goToUserProfile(profile.user.id)"-->
    <!--            >-->
    <!--                <v-list-item-avatar>-->
    <!--                    <v-img :src="profile.user.imageUrl"></v-img>-->
    <!--                </v-list-item-avatar>-->

    <!--                <v-list-item-content>-->
    <!--                    <v-list-item-title v-text="profile.user.name"></v-list-item-title>-->
    <!--                    <v-list-item-subtitle v-text="profile.user.position"></v-list-item-subtitle>-->
    <!--                </v-list-item-content>-->

    <!--                <v-list-item-icon>-->
    <!--                    <v-icon v-if="!profile.visibility && !hasAccessToProfile">mdi-lock</v-icon>-->
    <!--                    <v-icon v-if="hasAccessToProfile">mdi-lock-open-variant</v-icon>-->
    <!--                </v-list-item-icon>-->
    <!--            </v-list-item>-->
    <!--        </v-list>-->
    <!--    </v-card>-->
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import {IProfile, Profile} from "@/models/Profile";
    import {ProfileAPI} from "@/api/ProfileAPI";
    import {State} from "vuex-class";
    import {IUser} from "@/models/User";

    @Component
    export default class ProfilesBoard extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        public profiles: IProfile[] = [];

        public search: string = '';

        public itemsPerPageArray: number[] = [4, 8, 12];

        public filter: any = {};

        public page: number = 1;

        public sortDesc: boolean = false;

        public itemsPerPage: number = 4;

        public sortBy: string = 'name';

        public keys: string[] = [
            'Position',
        ];

        get numberOfPages(): number {
            return Math.ceil(this.profiles.length / this.itemsPerPage)
        }

        public nextPage() {
            if (this.page + 1 <= this.numberOfPages) this.page += 1
        }

        public formerPage() {
            if (this.page - 1 >= 1) this.page -= 1
        }

        public updateItemsPerPage(num: number) {
            this.itemsPerPage = num
        }

        mounted() {
            ProfileAPI.getAllActiveProfiles()
                .then((res) => {
                    this.profiles = res.data;
                })
                .catch((error) => {
                    this.$router.push({path: '/404'})
                });
        }

        public hasAccessToProfile(profile: IProfile): boolean {
            let i = profile.whitelist.findIndex(u => u.id === this.currentUser.id);
            return i !== -1;
        }

        public goToUserProfile(userId: number) {
            this.$router.push({
                name: 'UserProfile',
                params:
                    {
                        id: userId.toString()
                    }
            });
        }
    }
</script>