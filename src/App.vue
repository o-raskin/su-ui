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
        created() {
            if (this.$i18n.locale !== this.$store.state.userLocale) {
                this.$i18n.locale = this.$store.state.userLocale
            }
            // get from LOCAL STORAGE and set
        },
        methods: {
            resetSnackbar() {
                this.snackbar = false;
            }
        }
    });
</script>


<style lang="scss">
    .link:hover {
        text-decoration: underline;
    }
    .custom-card-border {
        border: thin solid rgba(0, 0, 0, 0.12);
        border-radius: 4px;
    }
    .widget-content-height {
        max-height: 235px;
    }
</style>