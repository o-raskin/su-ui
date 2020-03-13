<template>
    <v-app>
        <StatusReport @input="resetSnackbar" :color="color" :snackbar="snackbar" :text="text"/>
        <Main/>
    </v-app>
</template>

<script lang="ts">
    import Vue from "vue";
    import Main from "@/views/Main.vue";
    import StatusReport from "@/components/status-report/StatusReport.vue";

    export default Vue.extend({
        name: 'App',
        components: {
            Main,
            StatusReport,
        },
        data: () => ({
            text: '',
            color: '',
            snackbar: false,
        }),
        mounted() {
            this.$bus.$on('status', (status: any) => {
                this.text = status.text
                this.color = status.color
                this.snackbar = true
            })
        },
        methods: {
            resetSnackbar() {
                this.snackbar = false;
            }
        }
    });
</script>
