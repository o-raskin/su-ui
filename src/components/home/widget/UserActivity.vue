<template>
    <v-card
            class="flex-grow-1 custom-card-border"
            outlined
    >
        <v-toolbar height="40px" color="primary" dense short dark elevation="0">
            <v-toolbar-title class="subtitle-2">Activity</v-toolbar-title>
        </v-toolbar>
        <v-sheet
                class="v-sheet--offset mx-auto mt-2 mb-2"
                elevation="3"
                max-width="calc(100% - 32px)"
        >
            <v-sparkline
                    :labels="labels"
                    :gradient="sparkline_gradient"
                    :value="value"
                    color="rgb(54,54,54)"
                    line-width="2"
                    padding="16"
                    :smooth="sparkline_radius || false"
            >
                <template v-slot:label="item">
                    {{ item.value }}
                </template>
            </v-sparkline>
        </v-sheet>

        <v-card-text class="pt-0 text-center">
            <div class="title font-weight-light mb-2">{{activity_description_text}}</div>
            <v-divider class="my-2"></v-divider>
            <v-icon
                    class="mr-2"
                    small
            >
                mdi-clock
            </v-icon>
            <span class="caption grey--text font-weight-light">{{activity_last_skill_text}}</span>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class UserActivity extends Vue {

        data() {
            return {
                title_text: 'Stats for 6 month',
                activity_description_text: 'Skills achieved by user in 12 months',
                activity_last_skill_text: 'Last: 26 minutes ago',

                sparkline_gradient: ['#f72047', '#ffd200', '#1feaea'],
                sparkline_radius: 6,
                value: [
                    0,
                    2,
                    3,
                    6,
                    10,
                    11,
                    12,
                    10,
                    0,
                    1,
                    5,
                    3
                ],
            }
        }

    }
</script>