<template>
    <v-container>
        <v-toolbar dense short flat>


            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn dark @click="goToUserProfile()" icon v-on="on">
                        <v-avatar size="30">
                            <v-img :src="ownerSkillBoard.imageUrl"/>
                        </v-avatar>
                    </v-btn>
                </template>
                <span>
                    {{ $t('go_to_user_page') }}
                </span>
            </v-tooltip>

            <v-toolbar-title class="pl-0">
                {{ $t('skill_board.title', {username: ownerSkillBoard.name}) }}

                <span class="caption text--secondary" v-if="this.latestEditedUserSkill.editorId">
                    {{'(' + $t('skill_board.last_review.title') + ":"}}
                    {{latestEditedUserSkill.lastEditDate | formatDate}}
                    {{ $t('skill_board.last_review.by_user', {username: latestEditor.name}) + ')' }}
                </span>
            </v-toolbar-title>

            <v-spacer/>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click="goToUserSkillsTable()">
                        <v-icon>mdi-file-table-box</v-icon>
                    </v-btn>
                </template>
                <span>
                    {{ $t('skill_board.table_view') }}
                </span>
            </v-tooltip>

        </v-toolbar>

        <v-divider/>

        <v-row>
            <v-col>
                <v-card class="mx-auto" outlined>
                    <v-sheet tile class="pa-4 primary lighten-1">
                        <v-text-field
                                v-model="search"
                                :label=" $t('skill_board.filter.filter_placeholder') "
                                dark
                                flat
                                solo-inverted
                                hide-details
                                clearable
                                clear-icon="mdi-close-circle-outline"
                        ></v-text-field>
                        <v-container class="d-flex pa-0 ma-0">
                            <div style="width: 75%">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-checkbox
                                                v-on="on"
                                                v-model="caseSensitive"
                                                dark
                                                hide-details
                                                :label=" $t('skill_board.filter.case_sensitive_filter.title') "
                                        ></v-checkbox>
                                    </template>
                                    <span>
                                        {{ $t('skill_board.filter.case_sensitive_filter.tooltip') }}
                                    </span>
                                </v-tooltip>
                            </div>
                            <div>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-checkbox
                                                v-on="on"
                                                v-model="needForGrade"
                                                dark
                                                hide-details
                                                :label=" $t('skill_board.filter.next_grade_filter.title') "
                                        ></v-checkbox>
                                    </template>
                                    <span>
                                        {{ $t('skill_board.filter.next_grade_filter.tooltip') }}
                                    </span>
                                </v-tooltip>
                                <v-spacer/>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-checkbox
                                                v-on="on"
                                                v-model="relearn"
                                                dark
                                                hide-details
                                                :label=" $t('skill_board.filter.relearn_filter.title') "
                                        ></v-checkbox>
                                    </template>
                                    <span>
                                        {{ $t('skill_board.filter.relearn_filter.tooltip') }}
                                    </span>
                                </v-tooltip>
                            </div>
                        </v-container>


                    </v-sheet>
                    <v-treeview
                            v-model="selection"
                            :items="displayedSkills"
                            :search="search"
                            :filter="filter"
                            selection-type="leaf"
                            activatable
                            hoverable
                            v-on:update:active="setActive"
                    />
                </v-card>
            </v-col>
            <v-divider vertical/>
            <v-col>
                <template v-if="this.activeSkill === null">
                    <p class="title grey--text text--lighten-1 font-weight-light">
                        {{ $t('skill_board.choose_skill_placeholder') }}
                    </p>
                </template>
                <template v-else>
                    <SkillCard
                            :skill="activeSkill"
                            :requiredForGrade="requiredForNextGrade(activeSkill)"
                            :grades="grades"
                            :user="ownerSkillBoard"
                    />
                </template>
            </v-col>
        </v-row>

    </v-container>
</template>


<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import {SkillsAPI} from "@/api/SkillsAPI";
    import SkillCard from "@/components/skills/SkillCard.vue";
    import {ISkillsUser, SkillsUser} from "@/models/SkillsUser";
    import {ISkill} from "@/models/Skill";
    import {State} from "vuex-class";
    import {IUser, User} from "@/models/User";
    import {IGrade} from "@/models/Grade";
    import {SkillsGradeAPI} from "@/api/SkillsGradeAPI";
    import {UserAPI} from "@/api/UserAPI";
    import {IUserSkill, UserSkill} from "@/models/UserSkill";

    @Component({
        components: {
            SkillCard
        },
    })
    export default class SkillBoard extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        public user: IUser = new User();

        public grades: IGrade[] = [];
        public allUserGrades: IGrade[] = [];
        public skillsUser: ISkillsUser = new SkillsUser();
        public activeSkill: ISkill | null | undefined = null;

        public latestEditedUserSkill: IUserSkill = new UserSkill();
        public latestEditor: IUser = new User();

        public userSkillsData: IUserSkill[] = [];
        public skills: ISkill[] = [];
        public selection: number[] = [];

        public search: string = '';
        public caseSensitive: boolean = false;
        public needForGrade: boolean = false;
        public relearn: boolean = false;

        data() {
            return {
                filter_default_value: 'Start typing to filter...'
            }
        }

        @Watch("needForGrade")
        public watchNeedForGradeState() {
            if (this.needForGrade && this.relearn) {
                this.relearn = false;
            }
        }

        @Watch("relearn")
        public watchRelearnState(newState: boolean, oldState: boolean) {
            if (newState && this.needForGrade) {
                this.needForGrade = false;
            }
        }

        public setActive(idsList: number[]) {
            if (idsList.length === 0 || !idsList[0]) {
                this.activeSkill = null
            } else {
                this.activeSkill = this.skills.find(s => s.id === idsList[0]);
            }
        }

        public convertToTree(skills: ISkill[]) {
            let tree = [];
            let mappedArr = [];
            let arrElem: any;
            let mappedElem;

            // First map the nodes of the array to an object -> create a hash table.
            for (let i = 0, len = skills.length; i < len; i++) {
                arrElem = skills[i];
                mappedArr[arrElem.id] = arrElem;
                mappedArr[arrElem.id]['children'] = [];
            }

            for (let id in mappedArr) {
                if (mappedArr.hasOwnProperty(id)) {
                    mappedElem = mappedArr[id];
                    // If the element is not at the root level, add it to its parent array of children.
                    if (mappedElem.parentId) {
                        mappedArr[mappedElem['parentId']]['children'].push(mappedElem);
                    }
                    // If the element is at the root level, add it to first level elements array.
                    else {
                        tree.push(mappedElem);
                    }
                }
            }
            return tree;
        }

        /**
         *  under our grade: -1 and below
         *  our grade: 0
         *  for next grade: 1
         *  higher grades: 2 and higher
         */
        public requiredForNextGrade(skill: ISkill): boolean {
            if (!!this.skillsUser.grade) {
                return skill.previousGradeId === this.skillsUser.grade.id
            }
            return false;
        }

        public isRelearnedSkill(skill: ISkill): boolean {
            // debugger
            let us = this.userSkillsData.find(us => us.skill.id === skill.id);
            if (us) {
                return us.status === 'RELEARNING';
                // return us.status !== 'APPROVED' && (this.allUserGrades.map(g => g.id).indexOf(skill.gradeId) !== -1);
            }
            return false;
        }

        @Watch("ownerSkillBoardId")
        public updateDataForUser() {
            this.fetchAllSkillsUserData()
        }

        public goToUserProfile() {
            this.$router.push({name: 'UserProfile'})
        }

        public goToUserSkillsTable() {
            this.$router.push(
                {
                    name: 'UserSkillTable',
                    params: {
                        id: this.ownerSkillBoardId.toString()
                    }
                })
        }

        get skillBoardUser() : IUser {
            return this.user ? this.user : this.currentUser
        }

        public fetchAllSkillsUserData() {
            SkillsAPI.getAll()
                .then(r => this.skills = r.data)

            // debugger
            SkillsAPI.getUserSkills(this.ownerSkillBoard)
                .then(r => this.userSkillsData = r.data);

            SkillsAPI.getUserById(this.ownerSkillBoardId)
                .then(r => this.skillsUser = r.data);

            SkillsGradeAPI.getAll()
                .then(r => this.grades = r.data);

            SkillsGradeAPI.getPreviousUserGrades(this.ownerSkillBoard)
                .then(r => {
                    this.allUserGrades = r.data
                });

            SkillsAPI.getLatestChangedUserSkill(this.ownerSkillBoardId)
                .then(r => {
                    this.latestEditedUserSkill = r.data

                    if (r.data.userId) {
                        UserAPI.getUserById(r.data.userId)
                            .then(r => this.latestEditor = r.data);
                    }
                })
        }

        get displayedSkills(): ISkill[] {
            let displayedSkills = this.skills;

            if (this.needForGrade) {
                displayedSkills = this.skills.filter(s => this.requiredForNextGrade(s))
            }

            if (this.relearn) {
                displayedSkills = this.skills.filter(s => this.isRelearnedSkill(s))
            }

            return this.convertToTree(displayedSkills)
        }

        get filter() {
            return this.caseSensitive
                ? (skill: any, search: any, name: any) => skill[name].indexOf(search) > -1
                : undefined
        }

        get isAuthorizedUserProfile(): boolean {
            return !this.$route.params.id || +this.$route.params.id === this.currentUser.id;
        }

        get ownerSkillBoardId(): number {
            return !!this.$route.params.id ? +this.$route.params.id : this.currentUser.id
        }

        get ownerSkillBoard(): IUser {
            return !this.isAuthorizedUserProfile ? this.user : this.currentUser
        }

        mounted() {

            if (!this.isAuthorizedUserProfile) {

                UserAPI.getUserById(this.ownerSkillBoardId)
                    .then(r => {
                        this.user = r.data
                        // check that user allowed to be on page
                        if (!this.user.mentor || !this.user.mentor.id || this.user.mentor.id !== this.currentUser.id) {
                            this.$router.push({name: 'Forbidden'})
                        } else {
                            this.fetchAllSkillsUserData()
                        }
                    })
            } else {
                this.fetchAllSkillsUserData()
            }
        }


    }
</script>