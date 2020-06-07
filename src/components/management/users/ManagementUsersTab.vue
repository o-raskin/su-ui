<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card class="mx-auto" outlined>
                    <v-sheet tile class="pa-4 primary lighten-1">
                        <v-text-field
                                v-model="search"
                                :label="this.filter_default_value"
                                dark
                                flat
                                solo-inverted
                                hide-details
                                clearable
                                clear-icon="mdi-close-circle-outline"
                        >
                            <template v-slot:prepend>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-icon @click="" v-on="on">mdi-plus-circle</v-icon>
                                    </template>
                                    {{'Add new users'}}
                                </v-tooltip>
                            </template>
                        </v-text-field>
                    </v-sheet>
                    <v-treeview
                            :items="preparedUsers"
                            :search="search"
                            :filter="this.filter"
                            selection-type="leaf"
                            activatable
                            hoverable
                            @update:active="this.selectActiveUser"
                    >
                        <template v-slot:prepend="{ item, active }">
                            <v-avatar size="30">
                                <v-img :src="item.imageUrl"></v-img>
                            </v-avatar>
                        </template>
                    </v-treeview>
                </v-card>
            </v-col>

            <v-divider vertical></v-divider>

            <v-col>
                <v-scroll-y-transition mode="out-in">
                    <div
                            v-if="!this.selectedUser"
                            class="title grey--text text--lighten-1 font-weight-light"
                            style="align-self: center;"
                    >
                        Select a User
                    </div>
                    <div v-else>

                        <!--    USER CARD   -->
                        <v-card
                                :key="this.selectedUser.id"
                                outlined
                        >
                            <!-- MAIN CARD INFO -->
                            <v-list-item>
                                <v-list-item-avatar size="75" color="grey">
                                    <v-img
                                            :src="this.selectedUser.imageUrl"
                                    ></v-img>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title class="headline">
                                        {{ this.selectedUser.name }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ this.selectedUser.email }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-divider></v-divider>

                            <v-list>

                                <!-- USER CARD   -    POSITION -->

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

                                <!-- USER CARD   -    GRADE -->

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
                                                        :items="this.gradesForUserPosition"
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

                                <!-- USER CARD   -    ROLE -->

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
                                                        v-on:change="updateRole()"
                                                ></v-select>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list-group>

                                <v-divider inset/>

                                <!-- USER CARD   -    MENTOR -->

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
                                                        :items="this.suggestedMentors"
                                                        chips
                                                        label="Enter/Select for search..."
                                                        full-width
                                                        hide-details
                                                        hide-no-data
                                                        hide-selected
                                                        single-line
                                                        v-on:change="updateMentor()"
                                                >
                                                    <template v-slot:selection="data">
                                                        <v-chip :input-value="data.selected">
                                                            <v-avatar left>
                                                                <v-img :src="data.item.imageUrl"></v-img>
                                                            </v-avatar>
                                                            {{ data.item.name }}
                                                        </v-chip>
                                                    </template>
                                                    <template v-slot:item="data">
                                                        <template v-if="typeof data.item !== 'object'">
                                                            <v-list-item-content v-text="data.item"></v-list-item-content>
                                                        </template>
                                                        <template v-else>
                                                            <v-list-item-avatar>
                                                                <img :src="data.item.imageUrl">
                                                            </v-list-item-avatar>
                                                            <v-list-item-content>
                                                                <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                                                <v-list-item-subtitle v-html="data.item.position.name"></v-list-item-subtitle>
                                                            </v-list-item-content>
                                                        </template>
                                                    </template>

                                                </v-autocomplete>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list-group>

                                <v-divider inset/>

                                <!-- USER CARD   -    LAST PROMOTION -->

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

                                <!-- USER CARD   -    FUTURE PROMOTION -->

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

                                <!-- USER CARD   -    IN COMPANY SINCE -->

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

                                <!-- USER CARD   -    ACTIVE -->

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

                    </div>
                </v-scroll-y-transition>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator";
    import {State} from "vuex-class";
    import {ISimpleUser, IUser, SimpleUser, User} from "@/models/User";
    import {UserAPI} from "@/api/UserAPI";
    import {SkillsAPI} from "@/api/SkillsAPI";
    import {SkillsGradeAPI} from "@/api/SkillsGradeAPI";
    import {UserRoleAPI} from "@/api/UserRoleAPI";
    import {UserPositionAPI} from "@/api/UserPositionAPI";
    import {ISkillsUser} from "@/models/SkillsUser";
    import {IPosition, Position} from "@/models/Position";
    import {IGrade} from "@/models/Grade";

    @Component({
        components: {
        },
    })
    export default class ManagementUsersTab extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        public users: IUser[] = [];
        public selectedUser: IUser | null = null;
        public caseSensitive: boolean = false;
        public search: string = '';

        //  USERCARD
        public skillsUser!: ISkillsUser;
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

        data() {
            return {
                filter_default_value: 'Start typing to filter...',
            }
        }

        mounted() {
            UserAPI.getAllUsers()
                .then((res) => {
                    this.users = res.data;
                });
        }

        @Watch('selectedUser')
        public fetchUserData() {
            if (this.selectedUser) {
                this.fetchUserPositions();
                this.fetchUserRoles();
                this.fetchGrades();
                this.fetchSkillsUserData();
                this.initDefaultValues();
            }
        }

        public initDefaultValues() {
            if (this.selectedUser) {
                this.selectedPositionName = !!this.selectedUser.position ? this.selectedUser.position.name : 'Not assigned';
                this.selectedRole = this.selectedUser.role.replace('ROLE_', '');
                this.selectedMentor = !!this.selectedUser.mentor ? this.selectedUser.mentor :
                    new SimpleUser(-1, 'Not assigned', '', new Position(-1, ''));
                this.selectedMentorId = this.selectedUser.mentor ? this.selectedUser.mentor.id : undefined
                this.selectedLastPromotionDate = this.selectedUser.lastPromotionDate;
                this.selectedFuturePromotionDate = this.selectedUser.futurePromotionDate;
                this.selectedInCompanySinceDate = this.selectedUser.inCompanySince;
                this.selectedActive = this.selectedUser.active;
                this.fetchSkillsUserData()
            }
        }

        public selectActiveUser(selectedItems: number[]) {
            if (selectedItems.length === 0) {
                this.selectedUser = null
            }
            let u = this.users.find(user => user.id === selectedItems[0])
            if (u) {
                this.selectedUser = u;
            }
        }

        get preparedUsers(): IUser[] {
            let systemUserIndex = this.users.findIndex(u => u.name === 'SYSTEM' && u.email === 'system@skillup.com');
            let filtred : IUser[] = this.users.concat();;

            if (systemUserIndex !== -1) {
                filtred.splice(systemUserIndex, 1);
            }

            return filtred;
        }

        get filter() {
            return this.caseSensitive
                ? (skill: any, search: any, name: any) => skill[name].indexOf(search) > -1
                : undefined
        }





        //  USER CARD

        public updatePosition() {
            let selectedPosition = this.positions.find(p => p.name === this.selectedPositionName)
            if (selectedPosition && this.selectedUser) {
                this.selectedUser.position = selectedPosition;
                this.updateUserData();
            }
        }

        public updateGrade() {
            this.skillsUser.grade = this.grades.find(g => g.name === this.selectedGradeName)
            this.updateSkillsUserData()
            this.selectedGradeName = !!this.skillsUser.grade ? this.skillsUser.grade.name : 'Not assigned'
        }

        public updateRole() {
            if (this.selectedUser) {
                this.selectedUser.role = 'ROLE_' + this.selectedRole;
                this.updateUserData();
            }
        }

        public updateMentor() {
            if (!this.selectedUser) return

            let selectedMentorObj = this.preparedUsers.find(u => u.id === this.selectedMentorId)
            let simpleMentorObj;
            if (!!selectedMentorObj) {
                simpleMentorObj = new SimpleUser(selectedMentorObj.id, selectedMentorObj.name,
                    selectedMentorObj.imageUrl, selectedMentorObj.position)
            } else {
                simpleMentorObj = null;
            }
            this.selectedUser.mentor = simpleMentorObj;
            this.updateUserData()
        }

        public updateLastPromotionDate() {
            if (!this.selectedUser) {
                return;
            }
            this.selectedUser.lastPromotionDate = this.selectedLastPromotionDate;
            this.updateUserData();
        }

        public updateFuturePromotionDate() {
            if (!this.selectedUser) {
                return;
            }
            this.selectedUser.futurePromotionDate = this.selectedFuturePromotionDate;
            this.updateUserData();
        }

        public updateInCompanySinceDate() {
            if (!this.selectedUser) {
                return;
            }
            this.selectedUser.inCompanySince = this.selectedInCompanySinceDate;
            this.updateUserData();
        }

        public updateActive() {
            if (!this.selectedUser) {
                return;
            }
            this.selectedUser.active = this.selectedActive;
            this.updateUserData();
        }

        public isNotAMentorOfUser(user: IUser): boolean {
            if (!user.mentor || !this.selectedUser) {
                return true;
            }
            return this.selectedUser.id !== user.mentor.id
        }

        get suggestedMentors(): IUser[] {
            return this.preparedUsers
                .filter(u => this.selectedUser && u.id !== this.selectedUser.id)
                .filter(u => this.isNotAMentorOfUser(u))
        }

        get maxAllowedLastPromotionDate() {
            return new Date().toISOString().slice(0, 10);
        }

        get minAllowedFuturePromotionDate() {
            return new Date().toISOString().slice(0, 10);
        }

        get canChangeRole(): boolean {
            return !!this.selectedUser &&
                this.roles.indexOf(this.currentUser.role) > this.roles.indexOf(this.selectedUser.role)
        }

        get gradesForUserPosition() : string[] {
            return this.grades
                .filter(g => this.selectedUser && g.positionId === this.selectedUser.position.id)
                .map(p => p.name)
        }

        //  API CALLS

        public updateUserData() {
            if (!this.selectedUser) {
                return;
            }
            UserAPI.update(this.selectedUser)
                .then(r => {
                    this.selectedUser = r.data
                    let userIndex = this.preparedUsers.findIndex(u => this.selectedUser && u.id === this.selectedUser.id)
                    this.preparedUsers[userIndex] = this.selectedUser;
                });
        }

        public updateSkillsUserData() {
            SkillsAPI.updateSkillsUserData(this.skillsUser)
                .then(r => {
                    this.skillsUser = r.data
                });
        }

        public fetchSkillsUserData() {
            if (!this.selectedUser) {
                return;
            }
            SkillsAPI.getUserById(this.selectedUser.id)
                .then(r => {
                    this.skillsUser = r.data

                    if (!!this.skillsUser && !!this.skillsUser.grade && !!this.skillsUser.grade.name) {
                        this.selectedGradeName = this.skillsUser.grade.name
                        this.$forceUpdate();
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
