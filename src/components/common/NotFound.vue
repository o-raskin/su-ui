<template>
    <v-card
            class="mx-auto"
            max-width="344"
            outlined
    >
        <v-list-item three-line>
            <v-list-item-content class="text-center">

                <v-list-item-title class="headline mb-1">{{error_title_text}}</v-list-item-title>

                <v-list-item-subtitle>{{error_desc_text}}</v-list-item-subtitle>

                <v-card-actions>
                    <v-btn
                            class="mx-auto"
                            small
                            @click.prevent="returnToHome"
                            color="primary"
                    >
                        {{return_btn_text}}
                    </v-btn>
                </v-card-actions>
            </v-list-item-content>


        </v-list-item>

    </v-card>
</template>

<script>
    import Component from "vue-class-component";
    import Vue from "vue";
    import StatusReport from "@/components/status-report/StatusReport.vue";
    import Login from "@/components/auth/login/Login.vue";
    import {UserAPI} from "@/api/UserAPI";
    import UserActivity from "@/components/profile/widget/Activity";
    import UserMainInfo from "@/components/profile/widget/main-info/UserMainInfo";
    import InProgressList from "@/components/profile/widget/GradeProgress";
    import {ProfileAPI} from "@/api/ProfileAPI";
    import Profile from "@/models/Profile";

    export default {
        name: 'NotFound',
        components: {},
        data() {
            return {
                error_title_text: '404',
                error_desc_text: 'Page is not exists',
                return_btn_text: 'Back to the main',
            }
        },
        methods: {
            returnToHome() {
                this.$router.push({path: '/'})
            }
        },
        computed: {}
    }
</script>