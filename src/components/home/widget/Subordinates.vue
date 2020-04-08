<template>
    <v-card class="custom-card-border" outlined v-if="subordinates.length > 0">
        <v-toolbar height="40px" color="primary" dense short dark elevation="0">
            <v-toolbar-title class="subtitle-2">Subordinates</v-toolbar-title>
        </v-toolbar>
        <v-container class="flex-wrap d-flex pa-1">
            <v-card
                    @click="goToUserProfile(subordinate.id)"
                    class="ma-1"
                    max-width="100px"
                    outlined
                    :key="index"
                    v-for="(subordinate, index) in this.subordinates">
                <v-img dark class="ma-1" max-height="100px"
                       :src="subordinate.imageUrl"
                >
                    <v-progress-linear :value="subordinate.gradeProgress"></v-progress-linear>
                </v-img>
            </v-card>

        </v-container>
    </v-card>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import {ISimpleUser, IUser} from "@/models/User";
    import {UserAPI} from "@/api/UserAPI";

    @Component({
        components: {},
    })
    export default class Subordinates extends Vue {

        @Prop()
        public readonly user!: IUser;

        public subordinates: ISimpleUser[] = [];

        public show: boolean = false;

        mounted() {
            this.fetchSubordinates();
        }

        public fetchSubordinates() {
            if (!!this.user.id) {
                UserAPI.getUserSubordinates(this.user.id)
                    .then((res) => {
                        this.subordinates = res.data.sort((a, b) => {
                            if (a.gradeProgress < b.gradeProgress) {
                                return -1;
                            } else if (a.gradeProgress > b.gradeProgress) {
                                return 1;
                            }
                            return 0;
                        })
                    });
            }
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