<template>
    <v-container>
        <v-toolbar dense short flat>
            <v-toolbar-title class="pl-0">
                {{ $t('employees_board.title') }}
            </v-toolbar-title>
        </v-toolbar>

        <v-divider class="mb-3"/>

        <v-data-iterator
                :items="users"
                :items-per-page.sync="itemsPerPage"
                :page="page"
                :search="search"
                :sort-by="sortBy"
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
                            :label="getLocalizedMessage('employees_board.search.placeholder')"
                    ></v-text-field>

                    <template v-if="$vuetify.breakpoint.mdAndUp">
                        <v-spacer></v-spacer>

                        <!--                        <v-select-->
                        <!--                                v-model="sortBy"-->
                        <!--                                flat-->
                        <!--                                solo-inverted-->
                        <!--                                hide-details-->
                        <!--                                :items="keys"-->
                        <!--                                prepend-inner-icon="mdi-filter"-->
                        <!--                                label="Sort by"-->
                        <!--                        ></v-select>-->
                    </template>
                </v-toolbar>
            </template>

            <template v-slot:default="props">
                <v-row>
                    <v-col
                            v-for="item in props.items"
                            :key="item.id"
                            cols="12"
                            sm="6"
                            md="4"
                            lg="3"
                    >
                        <v-card @click="goToUserProfile(item.id)">

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title class="subtitle-1 mb-1">{{ item.name }}</v-list-item-title>
                                </v-list-item-content>

                                <v-list-item-avatar
                                        tile
                                        class="custom-card-border"
                                        size="80"
                                >
                                    <v-img :src="item.imageUrl"></v-img>
                                </v-list-item-avatar>
                            </v-list-item>

                        </v-card>
                    </v-col>
                </v-row>
            </template>

            <template v-slot:footer>

                <v-row class="mt-2" align="center" justify="center">
                    <span class="grey--text">
                        {{ $t('employees_board.pagination.items_per_page') }}
                    </span>
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
                        {{ $t('employees_board.pagination.page_number') }}
                        {{ page }}
                        {{ $t('employees_board.pagination.page_count_article') }}
                        {{ numberOfPages }}
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

    </v-container>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import {IProfile, Profile} from "@/models/Profile";
    import {ProfileAPI} from "@/api/ProfileAPI";
    import {State} from "vuex-class";
    import {IUser} from "@/models/User";
    import {UserAPI} from "@/api/UserAPI";

    @Component
    export default class ProfilesBoard extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        public users: IUser[] = [];

        public search: string = '';

        public itemsPerPageArray: number[] = [4, 8, 12];

        public filter: any = {};

        public page: number = 1;

        public sortDesc: boolean = false;

        public itemsPerPage: number = 16;

        public sortBy: string = 'name';

        public keys: string[] = [
            'Name',
        ];

        get numberOfPages(): number {
            return Math.ceil(this.users.length / this.itemsPerPage)
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

        public getLocalizedMessage(key: string) {
            return this.$t(key)
        }

        mounted() {
            UserAPI.getAllUsers()
                .then((res) => {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].position) {
                            // @ts-ignore
                            res.data[i].position = res.data[i].position.name;
                        }
                        // if (res.data[i].mentor) {
                        //     // @ts-ignore
                        //     res.data[i].mentor = res.data[i].mentor.name;
                        // }
                    }

                    this.users = res.data
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