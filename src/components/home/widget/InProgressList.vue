<template>
    <v-card
            color="primary"
            dark
    >
        <v-card-title>
            <v-icon
                    large
                    left
            >
                mdi-clipboard-text
            </v-icon>
            <span class="title font-weight-light text-uppercase">{{in_progress_list_text}}</span>

            <v-spacer/>
            <div
            >
<!--                <v-icon class="mr-1">mdi-diamond-outline</v-icon>-->
<!--                <span class="subheading mr-2">{{ remainingTasks }}</span>-->
<!--                <span class="mr-1">·</span>-->
                <v-icon class="mr-1">mdi-diamond-stone</v-icon>
                <span class="subheading">{{ completedTasks }}</span>
            </div>
        </v-card-title>

        <v-card-text class="headline font-weight-bold">
                        <v-slide-y-transition
                                class="py-0"
                                group
                                tag="v-list"
                        >
                            <template v-for="(task, i) in tasks">
                                <v-divider
                                        v-if="i !== 0"
                                        :key="`${i}-divider`"
                                ></v-divider>

                                <v-list-item :key="`${i}-${task.text}`">
                                    <v-list-item-action>
                                        <v-checkbox
                                                v-model="task.done"
                                                :color="task.done && 'light-green' || 'white'"
                                        >
                                            <template v-slot:label>
                                                <div
                                                        :class="task.done && 'green--text' || 'white--text'"
                                                        class="ml-4"
                                                        v-text="task.text"
                                                ></div>
                                            </template>
                                        </v-checkbox>
                                    </v-list-item-action>
                                </v-list-item>
                            </template>
                        </v-slide-y-transition>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">

    import {Component, Vue} from "vue-property-decorator";

    @Component({
        components: {},
    })
    export default class InProgressList extends Vue {

        data() {
            return {
                in_progress_list_text: 'in progress'
            }
        }

        public tasks = [
            {
                done: false,
                text: 'Foobar',
            },
            {
                done: false,
                text: 'Fizzbuzz',
            },
        ];

        public task: string = '';

        get completedTasks() : number {
            return this.tasks.filter(task => task.done).length
        }

        get progress() : number {
            return this.completedTasks / this.tasks.length * 100
        }

        get remainingTasks () {
            return this.tasks.length - this.completedTasks
        }

        public create() {
            this.tasks.push(
                {
                    done: false,
                    text: this.task,
                });

            this.task = '';
        }
    }
</script>