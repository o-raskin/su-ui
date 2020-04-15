<template>
    <v-card
            :key="user.id"
            outlined
    >
        <v-list-item>
            <v-list-item-avatar size="75" color="grey">
                <v-img

                        :src="user.imageUrl"
                ></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
                <v-list-item-title class="headline">
                    {{ user.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                    {{ user.email }}
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list>
            <v-list-group
                    prepend-icon="mdi-account"
                    no-action>

                <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{'Position'}}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{(!!selectedPositionName ? selectedPositionName : 'Not assigned')}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </template>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            <v-select
                                    v-model="selectedPositionName"
                                    :items="positions.map(p => p.name)"
                                    flat
                                    dense
                                    single-line
                                    v-on:change="updatePosition()"
                            ></v-select>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-group>

            <v-divider inset/>

            <v-list-group
                    prepend-icon="mdi-account"
                    no-action>

                <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{'Grade'}}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{(!!selectedGradeName ? selectedGradeName : 'Not assigned')}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </template>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            <v-select
                                    v-model="selectedGradeName"
                                    :items="grades.filter(g => g.positionId === this.user.position.id).map(p => p.name)"
                                    flat
                                    dense
                                    single-line
                                    v-on:change="updateGrade()"
                            ></v-select>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-group>

            <v-divider inset/>

            <v-list-group
                    :disabled="!canChangeRole"
                    prepend-icon="mdi-account-group"
                    no-action>

                <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{'Role'}}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{selectedRole}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </template>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            <v-select
                                    v-model="selectedRole"
                                    :items="roles.map(r => r.replace('ROLE_',''))"
                                    flat
                                    dense
                                    single-line
                                    :readonly="!canChangeRole"
                                    v-on:change="updateRole()"
                            ></v-select>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-group>

            <v-divider inset/>

            <v-list-group
                    prepend-icon="mdi-account-supervisor"
                    no-action
            >

                <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{'Mentor'}}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{(!!selectedMentor ? selectedMentor.name : 'Not assigned')}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </template>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            <v-autocomplete
                                    v-model="selectedMentorId"
                                    item-text="name"
                                    item-value="id"
                                    :items="suggestedMentors"
                                    chips
                                    label="Enter name..."
                                    full-width
                                    hide-details
                                    hide-no-data
                                    hide-selected
                                    single-line
                                    v-on:change="updateMentor()"
                            ></v-autocomplete>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-group>

            <v-divider inset/>

            <v-list-group
                    prepend-icon="mdi-calendar-multiple-check"
                    no-action
            >

                <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{'Last promotion'}}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{selectedLastPromotionDate | formatDate}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </template>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            <v-date-picker
                                    :max="maxAllowedLastPromotionDate"
                                    v-model="selectedLastPromotionDate"
                                    no-title
                                    v-on:change="updateLastPromotionDate()"
                                    scrollable>
                            </v-date-picker>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-group>

            <v-divider inset/>

            <v-list-group
                    prepend-icon="mdi-calendar-multiple"
                    no-action
            >

                <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{'Future promotion'}}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{(!!selectedFuturePromotionDate ? selectedFuturePromotionDate : 'Not assigned')}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </template>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            <v-date-picker
                                    :min="minAllowedFuturePromotionDate"
                                    v-model="selectedFuturePromotionDate"
                                    no-title
                                    v-on:change="updateFuturePromotionDate()"
                                    scrollable>
                            </v-date-picker>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-group>

            <v-divider inset/>

            <v-list-group
                    prepend-icon="mdi-badge-account"
                    no-action
            >

                <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{'In company since'}}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{selectedInCompanySinceDate | formatDate}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </template>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            <v-date-picker
                                    :max="maxAllowedLastPromotionDate"
                                    v-model="selectedInCompanySinceDate"
                                    no-title
                                    v-on:change="updateInCompanySinceDate()"
                                    scrollable>
                            </v-date-picker>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-group>

            <v-divider inset/>

            <v-list-item>
                <v-list-item-icon>
                    <v-icon>
                        mdi-power
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                    {{'Active'}}
                </v-list-item-title>
                <v-list-item-action class="mr-3">

                    <v-switch
                            v-model="selectedActive"
                            class="ma-1"
                            v-on:change="updateActive()"
                    ></v-switch>
                </v-list-item-action>
            </v-list-item>
        </v-list>

    </v-card>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
    import {ISimpleUser, IUser, SimpleUser} from "@/models/User";
    import {IPosition, Position} from "@/models/Position";
    import {UserPositionAPI} from "@/api/UserPositionAPI";
    import {UserAPI} from "@/api/UserAPI";
    import {UserRoleAPI} from "@/api/UserRoleAPI";
    import {State} from "vuex-class";
    import {SkillsGradeAPI} from "@/api/SkillsGradeAPI";
    import {Grade, IGrade} from "@/models/Grade";
    import {SkillsAPI} from "@/api/SkillsAPI";
    import {ISkillsUser} from "@/models/SkillsUser";

    @Component({
        components: {},
    })
    export default class UserCard extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        @Prop()
        public user!: IUser;

        public skillsUser!: ISkillsUser;

        @Prop()
        public users!: IUser[];

        public positions: IPosition[] = [];
        public roles: string[] = [];
        public grades: IGrade[] = [];

        public selectedPositionName!: string;
        public selectedGradeName!: string;
        public selectedRole!: string;
        public selectedMentor!: ISimpleUser;
        public selectedMentorId!: number | undefined;
        public selectedLastPromotionDate: any;
        public selectedFuturePromotionDate: any;
        public selectedInCompanySinceDate: any;
        public selectedActive!: boolean;

        public updatePosition() {
            let selectedPosition = this.positions.find(p => p.name === this.selectedPositionName)
            this.updateUserData('position', selectedPosition);
        }

        public updateGrade() {
            let selectedGradeObj = this.grades.find(g => g.name === this.selectedGradeName)
            SkillsAPI.updateUserSkillsData(this.user.id, 'grade', selectedGradeObj)
                .then(r => {
                    debugger
                    this.selectedGradeName = !!r.data.grade ? r.data.grade.name : 'Not assigned'
                });
        }

        public updateRole() {
            let userRole = 'ROLE_' + this.selectedRole;
            this.updateUserData('role', userRole);
        }

        public updateMentor() {
            let selectedMentorObj = this.users.find(u => u.id === this.selectedMentorId)
            if (selectedMentorObj === undefined) {
                this.updateUserData('mentor', null);
            }
            this.updateUserData('mentor', selectedMentorObj);
        }

        public updateLastPromotionDate() {
            this.updateUserData('lastPromotionDate', this.selectedLastPromotionDate);
        }

        public updateFuturePromotionDate() {
            this.updateUserData('futurePromotionDate', this.selectedFuturePromotionDate);
        }

        public updateInCompanySinceDate() {
            this.updateUserData('inCompanySince', this.selectedInCompanySinceDate);
        }

        public updateActive() {
            this.updateUserData('active', this.selectedActive);
        }

        @Watch('user')
        public initUserFields() {
            this.selectedPositionName = !!this.user.position ? this.user.position.name : 'Not assigned';
            this.selectedRole = this.user.role.replace('ROLE_', '');
            this.selectedMentor = !!this.user.mentor ? this.user.mentor :
                new SimpleUser(-1, 'Not assigned', '', new Position(-1, ''));
            this.selectedMentorId = this.user.mentor ? this.user.mentor.id : undefined
            this.selectedLastPromotionDate = this.user.lastPromotionDate;
            this.selectedFuturePromotionDate = this.user.futurePromotionDate;
            this.selectedInCompanySinceDate = this.user.inCompanySince;
            this.selectedActive = this.user.active;
            this.fetchSkillsUserData()
        }

        public isNotAMentorOfUser(user: IUser): boolean {
            if (!user.mentor) {
                return true;
            }
            return this.user.id !== user.mentor.id
        }

        get suggestedMentors(): ISimpleUser[] {
            return this.users
                .filter(u => u.id !== this.user.id)
                .filter(u => this.isNotAMentorOfUser(u))
        }

        get maxAllowedLastPromotionDate() {
            return new Date().toISOString().slice(0, 10);
        }

        get minAllowedFuturePromotionDate() {
            return new Date().toISOString().slice(0, 10);
        }

        get canChangeRole(): boolean {
            return this.roles.indexOf(this.currentUser.role) > this.roles.indexOf(this.user.role)
        }

        mounted() {
            this.initUserFields()
            this.fetchUserPositions();
            this.fetchUserRoles();
            this.fetchGrades();

            this.fetchSkillsUserData()
        }

        data() {
            return {
                // Strings
                filter_default_value: 'Start typing to filter...',
            }
        }

        //  API CALLS

        public updateUserData(fieldName: string, value: any) {
            UserAPI.updateField(this.user.id, fieldName, value)
                .then(r => {
                    this.user = r.data
                    let oldUserIndex = this.users.findIndex(u => u.id === this.user.id)
                    this.users.splice(oldUserIndex, 1, this.user);
                });
        }

        public fetchSkillsUserData() {
            SkillsAPI.getUserById(this.user.id)
                .then(r => {
                    debugger
                    this.skillsUser = r.data

                    if (!!this.skillsUser && !!this.skillsUser.grade && !!this.skillsUser.grade.name) {
                        this.selectedGradeName = this.skillsUser.grade.name
                    }
                });
        }

        public fetchGrades() {
            SkillsGradeAPI.getAll()
                .then(r => {
                    this.grades = r.data
                });
        }

        public fetchUserRoles() {
            UserRoleAPI.getAll()
                .then(r => {
                    this.roles = r.data;
                })
        }

        public fetchUserPositions() {
            UserPositionAPI.getAll()
                .then(r => {
                    this.positions = r.data;
                })
        }
    }
</script>