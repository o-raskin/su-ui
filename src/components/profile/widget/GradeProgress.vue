<template>
    <v-card class="custom-card-border" outlined v-if="skills.length">
        <v-toolbar height="40px" color="primary" dense short dark elevation="0">
            <v-toolbar-title class="subtitle-2">{{ $t('profile.widget.grade_progress.title') }}</v-toolbar-title>
        </v-toolbar>

        <v-content class="widget-content-height pa-1 overflow-y-auto">

            <div v-for="(skill, i) in skills"
                 :key="`${i}-divider`">

                <v-divider v-if="i !== 0"></v-divider>
                <v-list-item dense>
                    <v-list-item-title>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">

                                <v-avatar size="20" left>
                                    <v-icon small v-on="on" :color="skill.status === 'PENDING' ? 'orange' : 'primary'">
                                        {{skill.status === 'PENDING' ? 'mdi-help-circle' :
                                        'mdi-dots-horizontal-circle'}}
                                    </v-icon>
                                </v-avatar>

                            </template>

                            <span>{{skill.status}}</span>

                        </v-tooltip>
                        {{skill.skill.name}}
                    </v-list-item-title>
                </v-list-item>

            </div>
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

    @Component({
        components: {},
    })
    export default class InProgressList extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        @Prop()
        public readonly user!: IUser;

        @Prop()
        public skillsUser!: ISkillsUser;

        data() {
            return {
                in_progress_list_text: 'in progress',
                status_list: [
                    {
                        id: 'NEED_TO_KNOW',
                        text: 'NEED TO KNOW',
                        color: 'red',
                        icon: 'mdi-alert-circle',
                        tooltipText: 'Need to learn this skill to get the next grade'
                    },
                    {
                        id: 'IN_PROGRESS',
                        text: 'IN PROGRESS',
                        color: 'primary',
                        icon: 'mdi-dots-horizontal-circle',
                        tooltipText: 'Learning skill'
                    },
                    {
                        id: 'PENDING',
                        text: 'PENDING',
                        color: 'orange',
                        icon: 'mdi-help-circle',
                        tooltipText: 'Mentor need to approve grade or skill'
                    }
                ],
            }
        }

        get skills(): IUserSkill[] {
            let s = this.skillsUser.skills;
            if (s) {
                return s
                    .filter(s => s.status === 'IN_PROGRESS' || s.status === 'PENDING')
                    .filter(s => s.skill.previousGradeId === this.skillsUser.grade?.id);
            }
            return [];
        }

    }
</script>