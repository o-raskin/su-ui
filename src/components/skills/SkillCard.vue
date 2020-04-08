<template>
    <div>
        <v-card class="mx-auto" outlined>
            <v-list-item>
                <!--    Status  -->
                <v-chip :key="index" v-for="(item, index) in status" v-if="skill.status === item.id"
                        :color="item.color"
                        text-color="white"
                        label
                        small
                        :value="item.text"
                >
                    <v-avatar left>
                        <v-icon small>{{item.icon}}</v-icon>
                    </v-avatar>
                    {{item.text}}
                </v-chip>
            </v-list-item>

            <v-divider class="mx-4"></v-divider>

            <v-list-item class="my-2">
                <v-list-item-content>

                    <!--    Name    -->
                    <v-list-item-title class="headline mb-1">{{skill.name}}</v-list-item-title>
                    <!--    Description -->
                    <v-list-item-subtitle>{{skill.description}}</v-list-item-subtitle>
                </v-list-item-content>
                <!--    Avatar  -->
                <v-avatar class="my-auto" size="70px" tile color="red">
                    <span class="white--text headline">
                        {{ defaultAvatar }}
                    </span>
                </v-avatar>
            </v-list-item>

            <v-divider class="mx-4"></v-divider>

            <!--    Materials   -->
            <v-list-item>
                <v-list-item-icon>
                    <v-icon>mdi-cloud-download</v-icon>
                </v-list-item-icon>
                <!--                    v-if="skill.materials.length !== 0"-->
                <template
                >
                    <v-list-item-title>Materials</v-list-item-title>
                    <v-list-item-subtitle>Materials</v-list-item-subtitle>
                </template>
            </v-list-item>

            <v-divider class="mx-4"></v-divider>

            <!--    Actions -->
            <v-card-actions class="mx-2 my-1">
                <v-btn
                        v-if="!existsInTODOList"
                        class="custom-card-border"
                        elevation="0">
                    learn
                </v-btn>

                <v-btn
                        v-if="!isCompleted && allSuccessCriteriaCompleted"
                        @click="completeLearnSkill()"
                        dark
                        color="green"
                        class="custom-card-border"
                        elevation="0">
                    complete
                </v-btn>
            </v-card-actions>

        </v-card>

        <v-card outlined class="my-3" v-if="skill.successCriteria !== null && skill.successCriteria.length !== 0">
            <v-toolbar color="primary" dense short dark elevation="0">
                <v-toolbar-title class="subtitle-2">Success criteria</v-toolbar-title>
            </v-toolbar>

            <v-list outlined dense>
                <v-list-item-group
                        v-model="selectedSuccessCriteria"
                        multiple
                >
                    <template v-for="(successCriterion, index) in this.skill.successCriteria">
                        <v-list-item :key="successCriterion.name"
                                     v-on:click="successCriterionClick(successCriterion)"
                                     inactive>
                            <template>
                                <v-list-item-content>
                                    <v-list-item-title class="subtitle-2"
                                                       v-text="successCriterion.name"></v-list-item-title>
                                    <v-list-item-subtitle class="overline"
                                                          v-text="successCriterion.description"></v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-action>
                                    <v-list-item-action-text v-if="successCriterion.finishDate !== null">
                                        {{ successCriterion.finishDate | formatDate }}
                                    </v-list-item-action-text>
                                    <v-icon
                                            v-if="!successCriterion.achieved"
                                            color="grey lighten-1"
                                    >
                                        mdi-power-off
                                    </v-icon>

                                    <v-icon
                                            v-else
                                            color="green"
                                    >
                                        mdi-check-circle
                                    </v-icon>
                                </v-list-item-action>
                            </template>
                        </v-list-item>

                        <v-divider
                                v-if="index + 1 < skill.successCriteria.length"
                                :key="index"
                        ></v-divider>
                    </template>
                </v-list-item-group>
            </v-list>
        </v-card>
    </div>
</template>


<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import {ISkill, ISuccessCriterion} from "@/models/Skill";
    import {SuccessCriterionAPI} from "@/api/SuccessCriterionAPI";
    import {SkillApi} from "@/api/SkillAPI";

    @Component({
        components: {
        },
    })
    export default class SkillCard extends Vue {

        @Prop()
        public skill!: ISkill;

        data() {
            return {
                successCriteria: [],
                selectedSuccessCriteria: [],
                status: [
                    {
                        id: 'NOT_MANDATORY',
                        text: 'NOT MANDATORY',
                        color: 'grey',
                        icon: 'mdi-power-off',
                    },
                    {
                        id: 'NEED_TO_KNOW',
                        text: 'NEED TO KNOW',
                        color: 'primary',
                        icon: 'mdi-alert-circle',
                    },
                    {
                        id: 'IN_PROGRESS',
                        text: 'IN PROGRESS',
                        color: 'grey',
                        icon: 'mdi-alert-circle',
                    },
                    {
                        id: 'PENDING',
                        text: 'PENDING',
                        color: 'orange',
                        icon: 'mdi-help-circle',
                    },
                    {
                        id: 'APPROVED',
                        text: 'APPROVED',
                        color: 'green',
                        icon: 'mdi-check-circle',
                    },
                ],

            }
        }

        // get isInProgress() : boolean {
        //
        // }

        // public successCriterionClick(val : ISuccessCriterion) {
        //
        //         val.achieved = !val.achieved;
        //
        //         if (val.achieved === false) {
        //             val.finishDate = null
        //         } else {
        //             val.finishDate =new Date().toISOString().slice(0, 10)
        //         }
        //         SuccessCriterionAPI.update(val);
        // }

        // public completeLearnSkill() {
        //     this.skill.status = 'PENDING';
        //     SkillApi.updateSkill(this.skill)
        //         .then(res => {
        //             this.skill = res;
        //         })
        // }

        // get isCompleted() : boolean {
        //     return this.skill.status === 'APPROVED' || this.skill.status === 'PENDING';
        // }

        // get allSuccessCriteriaCompleted() : boolean {
        //     let i = this.skill.successCriteria.findIndex(sc => !sc.achieved);
        //     return i === -1;
        // }

        get existsInTODOList() : boolean {

            //TODO: add logic
            return false;
        }

        get defaultAvatar() {
            var skillName = this.skill.name
            var uppercaseContent = skillName.replace(/[^A-Z]/g, "")

            if (uppercaseContent.length >= 2) skillName = uppercaseContent;

            if (!skillName.length) {
                return 'S';
            } else if (skillName.length === 1) {
                return skillName.toUpperCase();
            } else if (skillName.length >= 2) {
                return skillName.substring(0, 2).toUpperCase();
            }
        }
    }
</script>