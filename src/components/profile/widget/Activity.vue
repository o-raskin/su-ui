<template>
    <v-card
            class="flex-grow-1 custom-card-border"
            outlined
            v-if="values.length > 1"
    >
        <v-toolbar height="40px" color="primary" dense short dark elevation="0">
            <v-toolbar-title class="subtitle-2">
                {{ $t('profile.widget.activity.title') }}
            </v-toolbar-title>
        </v-toolbar>
        <v-sheet
                class="v-sheet--offset mx-auto mt-2 mb-2 pr-2"
                color="primary"
                elevation="7"
                max-width="calc(100% - 32px)"
                v-if="values.length > 1"
        >
            <v-sparkline
                    dark
                    :labels="this.sortedValues.map(e => e.month + '(' + e.count + ')')"
                    show-labels
                    :gradient="sparkline_gradient"
                    :value="this.sortedValues.map(e => e.count)"
                    color="white"
                    auto-line-width
                    auto-draw
                    smooth="15"
                    padding="15"
            >
                <template v-slot:label="item">
                    {{ item.value }}
                </template>
            </v-sparkline>
        </v-sheet>

        <v-card-text class="pt-0">
            <div class="text-center mb-2"
                 v-if="values.length > 1">
                <span class="title font-weight-light">
                    {{ $t('profile.widget.activity.graph_desc') }}
                </span>
                <span>
                    {{'(' + $t('profile.widget.activity.graph_units') + ')'}}
                </span>
                <v-divider class="my-2"></v-divider>
            </div>
            <div>
                <span v-if="lastApprovedSkillDate">
                    <v-icon
                            color="green"
                            class="mr-2"
                            small
                    >
                        mdi-clock
                    </v-icon>
                    <span class="caption font-weight-bold green--text">
                        {{ $t('profile.widget.activity.last_approve_date') + ": " }}
                    </span>
                    <span>
                        {{lastApprovedSkillDate | formatDate}}
                    </span>
                </span>

                <span class="float-md-right" v-if="lastPendingSkillDate">
                    <v-icon
                            color="orange"
                            class="mr-2"
                            small
                    >
                        mdi-clock
                    </v-icon>
                    <span class="caption orange--text font-weight-bold">
                        {{ $t('profile.widget.activity.last_pending_date') + ': '}}
                    </span>
                    <span>
                        {{lastPendingSkillDate | formatDate}}
                    </span>
                </span>
            </div>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import {IUser} from "@/models/User";
    import {ISkillsUser} from "@/models/SkillsUser";
    import {SkillsAPI} from "@/api/SkillsAPI";
    import {IStatsItem, StatsItem} from "@/models/stats/StatsItem";
    import {IUserSkill} from "@/models/UserSkill";

    @Component({
        components: {},
    })
    export default class UserActivity extends Vue {

        @Prop()
        public readonly user!: IUser;

        @Prop()
        public skillsUser!: ISkillsUser;

        public values: IStatsItem[] = [];

        public monthsNames: string[] = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];

        data() {
            return {
                title_text: 'Stats for 6 month',
                activity_description_text: 'Skills achieved by user in 12 months',
                units: 'skill/month',
                last_approved_text: 'Last approved: ',
                last_pending_text: 'Last pending: ',
                sparkline_gradient: ['#f72047', '#ffd200', '#1feaea'],
            }
        }

        mounted() {
            this.fetchStatisticsData();
        }

        public fetchStatisticsData() {
            if (!!this.user.id) {
                SkillsAPI.getUserSkillsForStats(this.user.id)
                    .then(res => {
                        let statsMap = new Map(Object.entries(res.data));
                        for (let year of statsMap.keys()) {
                            let monthsMap = new Map<string, IUserSkill[]>(Object.entries(statsMap.get(year)));
                            for (let month of monthsMap.keys()) {
                                let userSkills = monthsMap.get(month);
                                if (userSkills) {
                                    let item = new StatsItem(+year, month, userSkills.length)
                                    this.values.push(item);
                                }
                            }
                        }
                    });
            }
        }

        get sortedValues() : IStatsItem[] {
            let r = this.values.sort((i1, i2) => {
                if (i1.year > i2.year) {
                    return 1;
                } else if (i1.year < i2.year) {
                    return -1;
                } else {
                    return this.monthsNames.indexOf(i1.month) - this.monthsNames.indexOf(i2.month)
                }
            })
            return r;
        }

        get lastApprovedSkillDate(): Date | string | null | undefined {
            let skills = this.skillsUser.skills;
            if (skills) {
                let sortedSkills = skills
                    .filter(s => s.status === 'APPROVED')
                    .sort((a, b) => {
                        if (a.endDate && b.endDate) {
                            return new Date(a.endDate).getDate() - new Date(b.endDate).getDate();
                        } else if (a.endDate && !b.endDate) {
                            return -1;
                        } else if (b.endDate && !a.endDate) {
                            return 1;
                        } else {
                            return 0;
                        }
                    })
                let skill = sortedSkills.pop()
                if (skill) {
                    return skill.endDate;
                }
            }
            return undefined;
        }

        get lastPendingSkillDate(): Date | string | null | undefined {
            let skills = this.skillsUser.skills;
            if (skills) {
                let sortedSkills = skills
                    .filter(s => s.status === 'PENDING')
                    .sort((a, b) => {
                        if (a.endDate && b.endDate) {
                            return new Date(a.endDate).getDate() - new Date(b.endDate).getDate();
                        } else if (a.endDate && !b.endDate) {
                            return -1;
                        } else if (b.endDate && !a.endDate) {
                            return 1;
                        } else {
                            return 0;
                        }
                    })
                let skill = sortedSkills.pop()
                if (skill) {
                    return skill.endDate;
                }
            }
            return undefined;
        }

    }
</script>