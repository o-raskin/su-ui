<template>
    <v-card class="custom-card-border" outlined >
        <v-toolbar height="40px" color="primary" dense short dark elevation="0">
            <v-toolbar-title class="subtitle-2">In progress</v-toolbar-title>
        </v-toolbar>

        <v-content class="pa-1">
            <div
            >
                <span class="mr-1">{{'TOTAL COMPLETED: '}}</span>
                <v-icon class="mr-1">mdi-diamond-stone</v-icon>
                <span class="subheading">{{ completedTasks }}</span>
            </div>
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
                                    :color="task.done && 'green'"
                            >
                                <template v-slot:label>
                                    <div
                                            :class="task.done &&  'black--text'"
                                            class="ml-4"
                                            v-text="task.text"
                                    ></div>
                                </template>
                            </v-checkbox>
                        </v-list-item-action>
                    </v-list-item>
                </template>
            </v-slide-y-transition>
        </v-content>
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

        get completedTasks(): number {
            return this.tasks.filter(task => task.done).length
        }

        get progress(): number {
            return this.completedTasks / this.tasks.length * 100
        }

        get remainingTasks() {
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