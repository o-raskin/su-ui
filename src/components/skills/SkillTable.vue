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

                    <v-toolbar-title>
                        {{ $t('skill_table.title', {username: ownerSkillBoard.name}) }}
                    </v-toolbar-title>

                    <v-spacer/>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" icon @click="printPage()">
                                <v-icon>mdi-printer</v-icon>
                            </v-btn>
                        </template>
                        <span>
                            {{ $t('skill_table.print') }}
                        </span>
                    </v-tooltip>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" icon @click="goToUserSkills()">
                                <v-icon>mdi-card-bulleted</v-icon>
                            </v-btn>
                        </template>
                        <span>
                            {{ $t('skill_table.board_view') }}
                        </span>
                    </v-tooltip>

                </v-toolbar>

                <v-divider/>

        <v-row>
            <v-data-table
                    :locale="this.currentLocale"
                    :headers="headers"
                    :items="this.displayData"
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
                text: this.getLocalizedMessage('skill.name'),
                value: 'skill.name',
            },
            {text: this.getLocalizedMessage('skill.status'), value: 'status'},
            {text: this.getLocalizedMessage('skill.start_date'), value: 'startDate'},
            {text: this.getLocalizedMessage('skill.end_date'), value: 'endDate'},
            {text: this.getLocalizedMessage('skill.grade'), value: 'grade'}
        ]

        get displayData() : any[] {
            if (!this.skillsUser || !this.skillsUser.skills) {
                return []
            }

            // ТУТ ПОДГОТОВКА ДАННЫХ
            for (let i = 0; i < this.skillsUser.skills.length; i++) {

                //@ts-ignore
                this.skillsUser.skills[i].completion = 44;

                let s = this.skills.find(s => s.id === this.skillsUser.skills[i].skill.id);
                if (s && s.gradeId) {
                    let grade = this.grades.find(g => s && g.id === s.gradeId);
                    //@ts-ignore
                    this.skillsUser.skills[i].grade = grade.name;
                }

                this.skillsUser.skills[i].status = this.getLocalizedStatus(this.skillsUser.skills[i].status).toString()
            }

            return this.skillsUser.skills;
        }

        public getLocalizedMessage(key : string) {
            return this.$t(key)
        }

        public getLocalizedStatus(status : string) {
            return this.$t('skill_card.status.' + status.toLowerCase())
        }

        get currentLocale() : string {
            switch (this.$i18n.locale) {
                case 'ru':
                    return 'ru-RU';
                case 'en':
                    return 'en-US';
                default:
                    return 'en-US';
            }
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

            SkillsAPI.getUserById(this.ownerSkillBoardId)
                .then(r => {
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