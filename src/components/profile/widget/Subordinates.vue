<template>
    <v-card class="custom-card-border" outlined v-if="subordinates.length > 0">
        <v-toolbar height="40px" color="primary" dense short dark elevation="0">
            <v-toolbar-title class="subtitle-2">{{ $t('profile.widget.subordinates.title') }}</v-toolbar-title>
        </v-toolbar>
        <v-container class="flex-wrap d-flex pa-1">
            <div :key="index"
                 v-for="(subordinate, index) in this.subordinates">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-card
                                v-on="on"
                                @click="goToUserProfile(subordinate.id)"
                                class="ma-1"
                                max-width="65px"
                                outlined>
                            <v-img dark class="ma-1" height="55px" :src="subordinate.imageUrl">
                                <v-progress-linear :value="getGradeProgressById(subordinate.id)"></v-progress-linear>
                            </v-img>
                        </v-card>
                    </template>
                    <span class="text-lg-center">
                        {{subordinate.name}}
                        <v-divider color="white" dark/>
                        {{ $t('profile.widget.subordinates.grade_progress_tooltip_desc')  + ': ' + getGradeProgressById(subordinate.id) + '%'}}
                    </span>
                </v-tooltip>
            </div>

        </v-container>
    </v-card>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import {ISimpleUser, IUser} from "@/models/User";
    import {UserAPI} from "@/api/UserAPI";
    import {SkillsAPI} from "@/api/SkillsAPI";
    import {SkillsGradeAPI} from "@/api/SkillsGradeAPI";
    import {ISkillsUser} from "@/models/SkillsUser";

    @Component({
        components: {},
    })
    export default class Subordinates extends Vue {

        @Prop()
        public readonly user!: IUser;

        public subordinates: ISimpleUser[] = [];
        public subordinatesSkillsData: ISkillsUser[] = [];

        mounted() {
            this.fetchSubordinates();
        }

        public fetchSubordinates() {
            if (!!this.user.id) {
                UserAPI.getUserSubordinates(this.user.id)
                    .then((res) => {
                        this.subordinates = res.data;
                        this.fetchSubordinatesProgress();
                    });
            }
        }

        public fetchSubordinatesProgress() {
            let ids = this.subordinates.map(u => u.id);
            SkillsAPI.getSkillsUsersByIds(ids)
                .then(r => {
                    this.subordinatesSkillsData = r.data
                    this.subordinates = this.subordinates.sort((a, b) => {
                        let subASkillData = this.subordinatesSkillsData.find(ssd => ssd.id === a.id)
                        let subBSkillData = this.subordinatesSkillsData.find(ssd => ssd.id === b.id)
                        if (!subASkillData && subBSkillData) {
                            return 1;
                        } else if (!subBSkillData && subASkillData) {
                            return -1;
                        } else if (subASkillData && subBSkillData) {
                            if (subASkillData.gradeProgress < subBSkillData.gradeProgress) {
                                return 1;
                            } else if (subASkillData.gradeProgress > subBSkillData.gradeProgress) {
                                return -1;
                            }
                            return 0;
                        }
                        return 0;
                    })
                })
        }

        public getGradeProgressById(userId: number): number {
            if (this.subordinatesSkillsData && this.subordinatesSkillsData.length > 0) {
                let sub = this.subordinatesSkillsData.find(s => s.id === userId)
                if (sub) {
                    return sub.gradeProgress;
                }
            }
            return 0;
        }

        public goToUserProfile(userId: number) {
            this.$router.push({
                name: 'UserProfile',
                params:
                    {
                        id: userId.toString()
                    }
            });
        }
    }
</script>