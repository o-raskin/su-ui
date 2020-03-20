<template>
    <v-container fluid align="center" justify="center" ml-0 mr-0>
        <v-layout text-center wrap>
            <v-flex>

                <!--    Content    -->
                <v-btn>WELCOME HOME!</v-btn>

                <v-divider/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Component from "vue-class-component";
    import Vue from "vue";
    import StatusReport from "@/components/status-report/StatusReport.vue";
    import Login from "@/components/auth/login/Login.vue";
    import {AuthAPI} from "@/api/AuthAPI";

    export default {
        name: 'Home',
        components: {
            Login,
            StatusReport
        },
        methods: {
            setStatus() {
                this.$bus.$emit('status', {text: 'MY TEXT', color: 'error'})
            }
        }
    }
</script>