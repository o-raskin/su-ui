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
                            @click.prevent="action"
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
    import UserActivity from "@/components/home/widget/UserActivity";
    import UserMainInfo from "@/components/home/widget/main-info/UserMainInfo";
    import InProgressList from "@/components/home/widget/InProgressList";
    import {ProfileAPI} from "@/api/ProfileAPI";
    import Profile from "@/models/Profile";

    export default {
        name: 'Forbidden',
        components: {},
        data() {
            return {
                error_title_text: '403',
                error_desc_text: 'Access is restricted',
                return_btn_text: 'Back to home',
            }
        },
        methods: {
            action() {
                this.$router.push({path: '/'})
            }
        },
        computed: {}
    }
</script>