<template>
    <v-card
            class="text-center"
            color="primary"
            dark
            outlined
    >

        <v-card-text class="headline">
            {{title_text}}
        </v-card-text>
        <v-card-text>
            <v-sheet color="rgba(0, 0, 0, .12)">
                <v-sparkline
                        :value="value"
                        color="rgba(255, 255, 255, .7)"
                        height="100"
                        padding="24"
                        stroke-linecap="round"
                        smooth
                >
                    <template v-slot:label="item">
                        {{ item.value }}
                    </template>
                </v-sparkline>
            </v-sheet>
        </v-card-text>

        <v-divider></v-divider>
    </v-card>
</template>

<script>
    import Component from "vue-class-component";
    import Vue from "vue";
    import StatusReport from "@/components/status-report/StatusReport.vue";

    export default {
        name: 'UserActivity',
        components: {},
        data() {
            return {
                title_text: 'Stats for 6 month',

                value: [
                    0,
                    446,
                    675,
                    510,
                    590,
                    610,
                    760,
                ],
            }
        },
        methods: {}
    }
</script>