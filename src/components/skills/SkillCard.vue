<template>
    <div>
        <v-card class="mx-auto" outlined>
            <v-list-item>
                <!--    Status  -->

                <div :key="index"

                     v-for="(s, index) in this.status_list"
                     v-if="userSkillData.status === s.id">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-chip v-on="on"
                                    :color="s.color"
                                    :text-color="!isMandatory ? 'white' : 'black'"
                                    label
                                    small
                                    :value="s.text"
                                    :outlined="isMandatory"
                            >
                                <v-avatar  left>
                                    <v-icon small>{{s.icon}}</v-icon>
                                </v-avatar>
                                {{s.text}}
                            </v-chip>
                        </template>
                        <span>{{s.tooltipText}}</span>
                    </v-tooltip>
                </div>

                <!--    GRADE NAME   -->
                <v-chip v-if="!!skillGradeName"
                        color="primary"
                        text-color="white"
                        label
                        small
                        class="ml-1"
                >
                    {{skillGradeName}}
                </v-chip>
            </v-list-item>

            <v-divider class="mx-4"></v-divider>

            <v-list-item class="my-2">
                <v-list-item-content>

                    <!--    Name    -->
                    <v-list-item-title style="white-space: normal" class="headline mb-1">
                        {{skill.name}}
                    </v-list-item-title>
                    <!--    Description -->
                    <v-list-item-subtitle style="white-space: normal">
                        {{skill.description}}
                    </v-list-item-subtitle>
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
<!--            <v-list-item>-->
<!--                <v-list-item-icon>-->
<!--                    <v-icon>mdi-cloud-download</v-icon>-->
<!--                </v-list-item-icon>-->
<!--                &lt;!&ndash;                    v-if="skill.materials.length !== 0"&ndash;&gt;-->
<!--                <template-->
<!--                >-->
<!--                    <v-list-item-title>-->
<!--                        {{ $t('skill_card.materials') }}-->
<!--                    </v-list-item-title>-->
<!--                </template>-->
<!--            </v-list-item>-->

<!--            <v-divider class="mx-4"></v-divider>-->

            <!--    Actions -->
            <v-card-actions class="mx-2 my-1">

                <!--    USER ACTIONS    -->

                <v-btn
                        v-if="!isWard && isReadyToComplete"
                        @click="completeLearnSkill()"
                        dark
                        color="green"
                        class="custom-card-border"
                        elevation="0">
                    {{ $t('skill_card.action.complete') }}
                </v-btn>

                <v-btn
                        v-if="!isWard && canBeLearned"
                        @click="startLearning()"
                        class="custom-card-border"
                        color="primary"
                        dark
                        elevation="0">
                    {{ $t('skill_card.action.learn') }}
                </v-btn>

                <v-btn
                        v-if="!isWard && isEnableToStop"
                        @click="cancelLearnSkill()"
                        class="custom-card-border"
                        dark
                        color="red"
                        elevation="0">
                    {{ $t('skill_card.action.stop_learning') }}
                </v-btn>

                <!--    MENTOR ACTIONS    -->

                <v-btn
                        v-if="isWard && isPending"
                        @click="rejectSkill()"
                        dark
                        color="red"
                        class="custom-card-border"
                        elevation="0">
                    {{ $t('skill_card.action.reject') }}
                </v-btn>

                <v-btn
                        v-if="isWard && (isPending || isRelearning)"
                        @click="approveSkill()"
                        dark
                        color="green"
                        class="custom-card-border"
                        elevation="0">
                    {{ $t('skill_card.action.approve') }}
                </v-btn>

                <v-btn
                        v-if="isWard && isApproved"
                        @click="relearnSkill()"
                        dark
                        color="red"
                        class="custom-card-border"
                        elevation="0">
                    {{ $t('skill_card.action.relearn') }}
                </v-btn>


            </v-card-actions>

        </v-card>

        <v-card outlined class="my-3" v-if="skill.successCriteria !== null && skill.successCriteria.length !== 0">
            <v-toolbar color="primary" dense short dark elevation="0">
                <v-toolbar-title class="subtitle-2">
                    {{ $t('skill_board.success_criterion.title') }}
                </v-toolbar-title>
            </v-toolbar>

            <v-list outlined dense>
                <v-list-item-group v-model="selectedSuccessCriteria" multiple>
                    <template v-for="(successCriterion, index) in this.skill.successCriteria">
                        <v-list-item :key="successCriterion.name"
                                     v-on:click="successCriterionClick(successCriterion)"
                                     inactive
                                     :disabled="!canChangeSuccessCriterion"
                        >
                            <template>
                                <v-list-item-content>
                                    <v-list-item-title style="white-space: normal" class="subtitle-2"
                                                       v-text="successCriterion.name"></v-list-item-title>
                                    <v-list-item-subtitle style="white-space: normal" class="overline"
                                                          v-text="successCriterion.description"></v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-action>
                                    <v-list-item-action-text
                                            v-if="userSuccessCriterionById(successCriterion.id).finishDate">
                                        {{ userSuccessCriterionById(successCriterion.id).finishDate | formatDate }}
                                    </v-list-item-action-text>
                                    <v-icon
                                            v-if="!userSuccessCriterionById(successCriterion.id).achieved"
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
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import {ISkill, ISuccessCriterion} from "@/models/Skill";
    import {SuccessCriterionAPI} from "@/api/SuccessCriterionAPI";
    import {SkillsAPI} from "@/api/SkillsAPI";
    import {IUserSkill, UserSkill} from "@/models/UserSkill";
    import {State} from "vuex-class";
    import {IUser} from "@/models/User";
    import {IUserSuccessCriterion, UserSuccessCriterion} from "@/models/UserSuccessCriteria";
    import {IGrade} from "@/models/Grade";

    @Component({
        components: {},
    })
    export default class SkillCard extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        @Prop()
        public user!: IUser;

        @Prop()
        public skill!: ISkill;

        @Prop()
        public requiredForGrade!: boolean;

        @Prop()
        public grades!: IGrade[];

        public userSkillData: IUserSkill = new UserSkill();

        public userSuccessCriteriaData: IUserSuccessCriterion[] = [];

        public selectedSuccessCriteria: number[] = [];

        data() {
            return {
                successCriteria: [],
                status_list: [
                    {
                        id: 'NOT_MANDATORY',
                        text: this.getLocalizedMessage('skill_card.status.not_mandatory'),
                        color: 'black',
                        icon: 'mdi-power-off',
                        tooltipText: this.getLocalizedMessage('skill_card.status.not_mandatory_desc')
                    },
                    {
                        id: 'NEED_TO_KNOW',
                        text: this.getLocalizedMessage('skill_card.status.need_to_know'),
                        color: 'red',
                        icon: 'mdi-alert-circle',
                        tooltipText: this.getLocalizedMessage('skill_card.status.need_to_know_desc')
                    },
                    {
                        id: 'IN_PROGRESS',
                        text: this.getLocalizedMessage('skill_card.status.in_progress'),
                        color: 'primary',
                        icon: 'mdi-dots-horizontal-circle',
                        tooltipText: this.getLocalizedMessage('skill_card.status.in_progress_desc')
                    },
                    {
                        id: 'PENDING',
                        text: this.getLocalizedMessage('skill_card.status.pending'),
                        color: 'orange',
                        icon: 'mdi-help-circle',
                        tooltipText: this.getLocalizedMessage('skill_card.status.pending_desc')
                    },
                    {
                        id: 'APPROVED',
                        text: this.getLocalizedMessage('skill_card.status.approved'),
                        color: 'green',
                        icon: 'mdi-check-circle',
                        tooltipText: this.getLocalizedMessage('skill_card.status.approved_desc')
                    },
                    {
                        id: 'RELEARNING',
                        text: this.getLocalizedMessage('skill_card.status.relearning'),
                        color: 'red',
                        icon: 'mdi-cached',
                        tooltipText: this.getLocalizedMessage('skill_card.status.relearning_desc')
                    }
                ],

            }
        }

        public getLocalizedMessage(key : string) {
            return this.$t(key)
        }

        @Watch("user")
        public watchingForUserChange() {
            this.fetchUserSkillData()
            this.fetchUserSuccessCriteriaData()
        }

        @Watch("skill")
        public updateSkillData() {
            this.fetchUserSkillData()
            this.fetchUserSuccessCriteriaData()
        }

        mounted() {
            this.fetchUserSkillData()
            this.fetchUserSuccessCriteriaData()
        }

        public userSuccessCriterionById(successCriterionId: number): IUserSuccessCriterion | undefined {
            return this.userSuccessCriteriaData
                .find(usc => usc.successCriterionId === successCriterionId)
        }

        //  ACTIONS

        //  MENTOR
        public rejectSkill() {
            this.userSkillData.status = 'IN_PROGRESS';
            this.userSkillData.endDate = null;
            this.userSkillData.editorId = this.currentUser.id;
            this.userSkillData.lastEditDate = new Date().toISOString().slice(0, 10);
            this.updateSkill()
        }

        public approveSkill() {
            this.userSkillData.status = 'APPROVED';
            this.userSkillData.endDate = new Date().toISOString().slice(0, 10);
            this.userSkillData.editorId = this.currentUser.id;
            this.userSkillData.lastEditDate = new Date().toISOString().slice(0, 10);
            this.updateSkill()
        }

        public relearnSkill() {
            this.userSkillData.status = 'RELEARNING';
            this.userSkillData.endDate = null;
            this.userSkillData.editorId = this.currentUser.id;
            this.userSkillData.lastEditDate = new Date().toISOString().slice(0, 10);
            this.updateSkill()
        }

        //  USER

        public startLearning() {
            this.userSkillData.status = 'IN_PROGRESS';
            this.userSkillData.startDate = new Date().toISOString().slice(0, 10);
            this.updateSkill()
        }

        public cancelLearnSkill() {
            if (this.requiredForGrade) {
                this.userSkillData.status = 'NEED_TO_KNOW'
            } else {
                this.userSkillData.status = 'NOT_MANDATORY'
            }
            this.userSkillData.startDate = null
            this.updateSkill()
        }


        public completeLearnSkill() {
            this.userSkillData.status = 'PENDING';
            this.userSkillData.endDate = new Date().toISOString().slice(0, 10);
            this.updateSkill()
        }

        //  API

        public updateSkill() {
            SkillsAPI.updateUserSkill(this.userSkillData)
                .then(r => this.userSkillData = r.data)
        }

        public fetchUserSkillData() {
            SkillsAPI.getUserSkill(this.user.id, this.skill.id)
                .then(r => {
                    this.userSkillData = r.data;
                })
        }

        public fetchUserSuccessCriteriaData() {
            SuccessCriterionAPI.getAllSuccessCriterionByUserAndSkill(this.user.id, this.skill.id)
                .then(r => {
                    this.userSuccessCriteriaData = r.data;
                })
        }

        public successCriterionClick(skillSuccessCriterion: ISuccessCriterion) {

            let userSuccessCriterion = this.userSuccessCriteriaData
                .find(usc => usc.successCriterionId === skillSuccessCriterion.id);

            if (!userSuccessCriterion) {

                userSuccessCriterion =
                    new UserSuccessCriterion(skillSuccessCriterion.id, this.user.id,
                        new Date().toISOString().slice(0, 10), true);
            } else {
                userSuccessCriterion.achieved = !userSuccessCriterion.achieved;
                if (!userSuccessCriterion.achieved) {
                    userSuccessCriterion.finishDate = null
                } else {
                    userSuccessCriterion.finishDate = new Date().toISOString().slice(0, 10)
                }
            }

            SuccessCriterionAPI.updateUserSuccessCriterion(userSuccessCriterion)
                .then(r => {
                    let oldSCIndex = this.userSuccessCriteriaData
                        .findIndex(usc => usc.successCriterionId === r.data.successCriterionId)
                    this.userSuccessCriteriaData.splice(oldSCIndex, 1, r.data);
                });
        }

        //  STATUS HANDLING

        get isMandatory(): boolean {
            return this.userSkillData.status === 'NOT_MANDATORY';
        }

        get isNeedToKnow(): boolean {
            return this.userSkillData.status === 'NEED_TO_KNOW';
        }

        get isInProgress(): boolean {
            return this.userSkillData.status === 'IN_PROGRESS';
        }

        get isPending(): boolean {
            return this.userSkillData.status === 'PENDING';
        }

        get isApproved(): boolean {
            return this.userSkillData.status === 'APPROVED';
        }

        get isRelearning(): boolean {
            return this.userSkillData.status === 'RELEARNING';
        }

        //  CHECKS

        get isWard(): boolean {
            return !!this.user.mentor && this.currentUser.id === this.user.mentor.id;
        }

        get canChangeSuccessCriterion(): boolean {
            return !this.isPending && !this.isApproved;
        }

        get canBeLearned(): boolean {
            return !this.isPending && !this.isApproved && !this.isInProgress && !this.isRelearning;
        }

        get isReadyToComplete(): boolean {
            return this.allSuccessCriteriaCompleted && this.isInProgress;
        }

        get isEnableToStop(): boolean {
            return !this.requiredForGrade && this.isInProgress;
        }

        get allSuccessCriteriaCompleted(): boolean {
            if (this.userSuccessCriteriaData.length !== this.skill.successCriteria.length) {
                return false;
            }
            let i = this.userSuccessCriteriaData.findIndex(sc => !sc.achieved);
            return i === -1;
        }

        //  OTHER

        get skillGradeName() {
            let skillGrade = this.grades.find(g => g.id === this.skill.gradeId);
            if (!!skillGrade) {
                return skillGrade.name.toUpperCase();
            }
            return undefined;
        }

        get defaultAvatar() {
            let skillName = this.skill.name
            let uppercaseContent = skillName.replace(/[^A-Z]/g, "")

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