<template>
    <v-container fluid align="center" justify="center" ml-0 mr-0>
        <v-layout text-center wrap>
            <v-flex>

                <!--    Content    -->

                <v-btn @click="setStatus">CLICK ME!</v-btn>

            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import StatusReport from "@/components/status-report/StatusReport.vue";

    @Component({
        components: {
            StatusReport
        },
    })
    export default class Home extends Vue {

        setStatus() {
            this.$bus.$emit('status', {text: 'MY TEXT', color: 'error'})
        }
    }
</script>