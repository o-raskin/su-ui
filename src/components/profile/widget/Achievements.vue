<template>
    <v-card class="custom-card-border" outlined v-if="user.inCompanySince">
        <v-toolbar height="40px" color="primary" dense short dark elevation="0">
            <v-toolbar-title class="subtitle-2">{{ $t('profile.widget.timeline.title') }}</v-toolbar-title>
        </v-toolbar>

        <v-content class="text-center  pa-1 overflow-y-auto ">

            <v-timeline>
                <v-timeline-item
                        v-for="(history, i) in histories"
                        :key="i"
                >
                    <span class="text--secondary body-2" slot="opposite">{{history.achievedDate | formatDate}}</span>
                    <v-card v-bind:style="[i % 2 ? {right: 0} : {left: 0}]"
                            style="position: absolute"
                            max-width="200px" class="elevation-2 pa-2">
                        <v-card-text class="body-1 text--primary pa-0 timeline-item-text">{{history.grade.name}}
                        </v-card-text>
                    </v-card>
                </v-timeline-item>

                <v-timeline-item color="green" large icon="mdi-flag">
                    <span class="text--secondary body-2" slot="opposite">
                        {{user.inCompanySince | formatDate}}
                    </span>
                </v-timeline-item>
            </v-timeline>

        </v-content>
    </v-card>
</template>

<script lang="ts">

    import {Component, Prop, Vue} from "vue-property-decorator";
    import {SkillsAPI} from "@/api/SkillsAPI";
    import {State} from "vuex-class";
    import {IUser} from "@/models/User";
    import {ISkill} from "@/models/Skill";
    import {ISkillsUser} from "@/models/SkillsUser";
    import {IUserSkill} from "@/models/UserSkill";
    import {IGradeHistory} from "@/models/GradeHistory";
    import {ProfileAPI} from "@/api/ProfileAPI";
    import {SkillsGradeAPI} from "@/api/SkillsGradeAPI";

    @Component({
        components: {},
    })
    export default class Achievements extends Vue {

        @Prop()
        public readonly user!: IUser;

        public histories: IGradeHistory[] = [];

        mounted() {
            if (this.user.id) {
                SkillsGradeAPI.getGradeHistoryByUser(this.user.id)
                    .then((res) => {
                        this.histories = res.data
                            .sort((a, b) => {
                                return -(new Date(a.achievedDate).getTime() - new Date(b.achievedDate).getTime())
                            });
                    })
            }
        }

    }
</script>

<style lang="scss" scoped>
    .achievement-item {
        max-width: 200px;
        word-break: break-word;
    }

    .timeline-item-text {
        max-width: 250px;
    }
</style>