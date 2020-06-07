<template>
    <v-card class="custom-card-border" outlined v-if="skills.length">
        <v-toolbar height="40px" color="primary" dense short dark elevation="0">
            <v-toolbar-title class="subtitle-2">{{ $t('profile.widget.history.title') }}</v-toolbar-title>
        </v-toolbar>

        <v-content class="widget-content-height pa-1 overflow-y-auto">

            <div v-for="(skill, i) in skills"
                 :key="i">

                <v-divider v-if="i !== 0"></v-divider>
                <v-list-item dense>
                    <v-list-item-title>
                        {{skill.skill.name}}
                    </v-list-item-title>
                    <v-spacer/>
                    <span class="caption">
                        {{skill.endDate | formatDate}}
                    </span>
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
    export default class History extends Vue {

        @Prop()
        public readonly user!: IUser;

        @Prop()
        public skillsUser!: ISkillsUser;

        data() {
            return {}
        }

        get skills(): IUserSkill[] {
            let s = this.skillsUser.skills;
            if (s) {
                return s
                    .filter(s => s.status === 'APPROVED')
                    .sort((a, b) => {
                        if (a.endDate && b.endDate) {
                            return -(new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
                        } else if (a.endDate && !b.endDate) {
                            return -1;
                        } else if (b.endDate && !a.endDate) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
            }
            return [];
        }

    }
</script>