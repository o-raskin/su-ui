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
                        <span>Go to user profile</span>
                    </v-tooltip>

                    <v-toolbar-title>
                        {{ownerSkillBoard.name + '\'s'}}
                        Skill Table
                    </v-toolbar-title>

                    <v-spacer/>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" icon @click="printPage()">
                                <v-icon>mdi-printer</v-icon>
                            </v-btn>
                        </template>
                        <span>Print page</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" icon @click="goToUserSkills()">
                                <v-icon>mdi-card-bulleted</v-icon>
                            </v-btn>
                        </template>
                        <span>Board view</span>
                    </v-tooltip>

                </v-toolbar>

                <v-divider/>

        <v-row>
            <v-data-table
                    :headers="headers"
                    :items="this.skillsUser.skills"
                    :items-per-page="13"
                    class="elevation-1 ma-auto mt-3"
            ></v-data-table>
        </v-row>

    </v-container>
</template>


<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import {SkillsAPI} from "@/api/SkillsAPI";
    import {ISkillsUser, SkillsUser} from "@/models/SkillsUser";
    import {ISkill} from "@/models/Skill";
    import {State} from "vuex-class";
    import {IUser, User} from "@/models/User";
    import {IGrade} from "@/models/Grade";
    import {SkillsGradeAPI} from "@/api/SkillsGradeAPI";
    import {UserAPI} from "@/api/UserAPI";
    import {IUserSkill} from "@/models/UserSkill";

    @Component({
        components: {
        },
    })
    export default class SkillTable extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        public user: IUser = new User();

        public grades: IGrade[] = [];
        public skillsUser: ISkillsUser = new SkillsUser();
        public skills: ISkill[] = [];
        public headers: any[] = [
            {
                text: 'Name',
                value: 'skill.name',
            },
            {text: 'Status', value: 'status'},
            {text: 'Completion', value: 'skill.success'},
            {text: 'Start date', value: 'startDate'},
            {text: 'End date', value: 'endDate'},
            {text: 'Next grade', value: 'this.requiredForNextGrade(skill)'}
        ]

        // get displayedSkills() {
        //     let arr = this.skillsUser.skills;
        //     return arr.map(s => {
        //         if (s.skill.name === 'test') {
        //             s.required = true
        //             return s;
        //         }
        //         return false;
        //     })
        // }

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

        @Watch("ownerSkillBoardId")
        public updateDataForUser() {
            this.fetchAllSkillsUserData()
        }

        public goToUserSkills() {
            this.$router.push({name: 'UserSkillBoard', params: {
                    id: this.ownerSkillBoardId.toString()
                }})
        }

        public printPage() {
            window.print();
        }

        public goToUserProfile() {
            this.$router.push({name: 'UserProfile'})
        }

        public fetchAllSkillsUserData() {
            SkillsAPI.getAll()
                .then(r => this.skills = r.data)

            debugger
            SkillsAPI.getUserById(this.ownerSkillBoardId)
                .then(r => {
                    debugger
                    this.skillsUser = r.data
                });

            SkillsGradeAPI.getAll()
                .then(r => {
                    this.grades = r.data
                });
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
                        if (!this.user.mentor || !this.user.mentor.id || this.user.mentor.id !== this.currentUser.id) {
                            this.$router.push({
                                name: 'Forbidden'
                            })
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