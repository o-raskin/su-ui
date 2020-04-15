<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card class="mx-auto" outlined>
                    <v-sheet tile class="pa-4 primary lighten-1">
                        <v-text-field
                                v-model="search"
                                :label="this.filter_default_value"
                                dark
                                flat
                                solo-inverted
                                hide-details
                                clearable
                                clear-icon="mdi-close-circle-outline"
                        ></v-text-field>
                    </v-sheet>
                    <v-treeview
                            :items="users"
                            :search="search"
                            :filter="this.filter"
                            selection-type="leaf"
                            activatable
                            hoverable
                            :active.sync="active"
                    >
                        <template v-slot:prepend="{ item, active }">
                            <v-avatar size="30">
                                <v-img :src="item.imageUrl"></v-img>
                            </v-avatar>
                        </template>
                    </v-treeview>
                </v-card>
            </v-col>

            <v-divider vertical></v-divider>

            <v-col>
                <v-scroll-y-transition mode="out-in">
                    <div
                            v-if="!selected"
                            class="title grey--text text--lighten-1 font-weight-light"
                            style="align-self: center;"
                    >
                        Select a User
                    </div>
                    <div v-else>

                        <!--    USER CARD   -->
                        <UserCard :user="selected" :users="users"/>

                    </div>
                </v-scroll-y-transition>
            </v-col>
        </v-row>
        <v-btn
                title="Add new users"
                elevation="10"
                class="custom-nav-button"
                v-if="displayButton"
                fab
                dark
                color="red"
        >
            <v-icon>mdi-plus</v-icon>
        </v-btn>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {State} from "vuex-class";
    import {IUser, User} from "@/models/User";
    import {ProfileAPI} from "@/api/ProfileAPI";
    import {UserAPI} from "@/api/UserAPI";
    import UserCard from "@/components/management/users/UserCard.vue";

    @Component({
        components: {
            UserCard
        },
    })
    export default class ManagementUsersTab extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        public users: IUser[] = [];

        public caseSensitive: boolean = false;

        public active: number[] = [];

        public search: string = '';

        public fab: boolean = false;

        get selected(): IUser | undefined {
            if (!this.active.length) return undefined

            const id = this.active[0]

            return this.users.find(user => user.id === id)
        }

        public fieldValueOrDefault(field: any) {
            return !!field ? field : 'Not setted'
        }

        get filter() {
            return this.caseSensitive
                ? (skill: any, search: any, name: any) => skill[name].indexOf(search) > -1
                : undefined
        }

        get displayButton(): boolean {
            return this.users.length > 0;
        }

        mounted() {
            UserAPI.getAllUsers()
                .then((res) => {
                    this.users = res.data;
                });
        }

        data() {
            return {
                // Strings
                filter_default_value: 'Start typing to filter...',

            }
        }

    }
</script>
