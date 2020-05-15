<template>
    <v-container>
        <v-toolbar dense short flat>
            <v-toolbar-title class="pl-0">
                Planning board
            </v-toolbar-title>
        </v-toolbar>

        <v-divider/>

        <v-row
                class="pa-4"
                justify="space-between"
        >
            <v-col cols="4" class="pt-0">

                <v-list dense class="pt-0">
                    <v-subheader>
                        <span class="body-2 text--secondary">
                            {{'Subordinates:'}}
                        </span>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small>mdi-help-circle</v-icon>
                            </template>
                            <span>Subordinates whose reached 100% progress</span>
                        </v-tooltip>
                    </v-subheader>

                    <v-list-item-group color="primary">
                        <div :key="index"
                             v-for="(subordinate, index) in this.subordinates">
                            <v-list-item @click="selectUser(subordinate)">
                                <v-list-item-icon>
                                    <v-avatar size="40">
                                        <v-img :src="subordinate.imageUrl"></v-img>
                                    </v-avatar>
                                </v-list-item-icon>
                                <v-list-item-content class="body-2">
                            <span>
                                {{subordinate.name}}
                            </span>
                                    <span class="caption text--secondary">
                                    {{getGradeByUserId(subordinate.id).name}}
                                </span>
                                </v-list-item-content>
                            </v-list-item>

                            <v-divider/>
                        </div>
                    </v-list-item-group>
                </v-list>

            </v-col>

            <v-divider vertical></v-divider>

            <v-col
                    class="d-flex pt-0"
            >
                <v-scroll-y-transition mode="out-in">
                    <div
                            v-if="!selectedUser"
                            class="title grey--text text--lighten-1 font-weight-light"
                            style="align-self: center;"
                    >
                        Select subordinate...
                    </div>
                    <v-card
                            v-else
                            :key="selectedUser.id"
                            flat
                            style="width: 100%"
                    >

                        <v-card class="ma-4 custom-card-border" outlined>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-chip v-on="on" small label class="ml-4 mt-2 font-weight-bold">
                                        {{promotion.status}}
                                    </v-chip>
                                </template>
                                <span>{{'Promotion status'}}</span>
                            </v-tooltip>

                            <v-card-text>
                                <div class="text-center">
                                    <div>
                                        <div>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-avatar v-on="on" @click="goToUserProfile()" size="88">
                                                        <v-img :src="selectedUser.imageUrl"/>
                                                    </v-avatar>
                                                </template>
                                                <span>Go to user profile</span>
                                            </v-tooltip>

                                            <div @click="goToUserProfile()" class="headline mb-2">
                                                <a class="link" @click="goToUserProfile()">
                                                    {{ selectedUser.name }}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <span class="text--primary">
                                    {{this.originUserGrade.name + ' ⟶ ' + this.nextUserGrade.name}}
                                </span>
                                </div>

                                <v-list-group
                                        prepend-icon="mdi-account-supervisor"
                                        no-action
                                >
                                    <template v-slot:activator>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                {{'Invited: '}}
                                            </v-list-item-title>
                                            <v-list-item-subtitle>
                                                {{(promotion.members && promotion.members.length > 0 ? invitedUsers.map(u => u.name) : 'None').toString()}}
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </template>

                                    <!-- Members -->

                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <v-autocomplete
                                                        v-model="invitedUsers"
                                                        item-text="name"
                                                        return-object
                                                        :items="users"
                                                        chips
                                                        label="Enter/Select for search..."
                                                        full-width
                                                        hide-details
                                                        hide-no-data
                                                        hide-selected
                                                        single-line
                                                        multiple
                                                        v-on:change="inviteUsersToPromotion()"
                                                >
                                                    <template v-slot:prepend>
                                                        <v-chip class="mb-5" :input-value="selectedUser">
                                                            <v-avatar v-if="selectedUser.imageUrl" left>
                                                                <v-img :src="selectedUser.imageUrl"></v-img>
                                                            </v-avatar>
                                                            {{ selectedUser.name }}
                                                        </v-chip>
                                                    </template>

                                                    <template v-slot:selection="data">
                                                        <v-chip :input-value="data.selected">
                                                            <v-avatar v-if="data.item.imageUrl" left>
                                                                <v-img :src="data.item.imageUrl"></v-img>
                                                            </v-avatar>
                                                            {{ data.item.name }}
                                                        </v-chip>
                                                    </template>

                                                    <template v-slot:item="data">
                                                        <template v-if="typeof data.item !== 'object'">
                                                            <v-list-item-content
                                                                    v-text="data.item"></v-list-item-content>
                                                        </template>
                                                        <template v-else>
                                                            <v-list-item-avatar
                                                                    v-if="data.item.imageUrl">
                                                                <img :src="data.item.imageUrl">
                                                            </v-list-item-avatar>
                                                            <v-list-item-content>
                                                                <v-list-item-title
                                                                        v-html="data.item.name"></v-list-item-title>
                                                                <v-list-item-subtitle
                                                                        v-if="data.item.position"
                                                                        v-html="data.item.position.name"></v-list-item-subtitle>
                                                            </v-list-item-content>
                                                        </template>
                                                    </template>

                                                </v-autocomplete>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list-group>

                                <!-- Promotion date -->

                                <PlanningCalendar :subordinate="this.selectedUser"
                                                  :promotion-start-date="this.promotion.startDate"
                                                  :promotion-end-date="this.promotion.endDate"
                                />

                                <!--    ACTIONS   -->

                                <div class="ma-4 text-center">
                                    <v-btn
                                            v-if="this.isNotCreatedPromotion"
                                            @click="createPromotion()"
                                            dark
                                            color="green"
                                            class="custom-card-border ma-2"
                                            elevation="0">
                                        CREATE
                                    </v-btn>

                                    <v-btn
                                            v-if="this.isCreatedPromotion"
                                            @click="cancelPromotion()"
                                            dark
                                            color="green"
                                            class="custom-card-border ma-2"
                                            elevation="0">
                                        CANCEL
                                    </v-btn>

                                    <v-btn
                                            v-if="this.isCreatedPromotion"
                                            @click="approveGradeUp()"
                                            dark
                                            color="green"
                                            class="custom-card-border ma-2"
                                            elevation="0">
                                        SUCCESS
                                    </v-btn>

                                    <v-btn
                                            v-if="this.isCreatedPromotion"
                                            @click="failGradeUp()"
                                            dark
                                            color="red"
                                            class="custom-card-border ma-2"
                                            elevation="0">
                                        FAILED
                                    </v-btn>
                                </div>
                            </v-card-text>

                        </v-card>

                        <!-- PREVIOUS PROMOTIONS -->

                        <v-card class="ma-4 custom-card-border" outlined v-if="this.previousPromotions.length > 0">
                            <v-toolbar height="40px" color="primary" dense short dark elevation="0">
                                <v-toolbar-title class="subtitle-2">Previous promotions</v-toolbar-title>
                            </v-toolbar>

                            <v-content class="widget-content-height pa-5 overflow-y-auto">

                                <div v-for="(promotion, i) in this.previousPromotions"
                                     :key="i">

                                    <v-divider v-if="i !== 0"></v-divider>
                                    <v-list-item dense>
                                        <v-list-item-title>
                                            {{promotion.startDate | formatDate}}
                                        </v-list-item-title>
                                        <v-spacer/>
                                        <span class="caption">
                                            {{promotion.originGradeId}}
                                            ->
                                            {{promotion.nextGradeId}}
                                        </span>
                                        <v-spacer/>
                                        <span>
                                            {{promotion.status}}
                                        </span>
                                    </v-list-item>

                                </div>
                            </v-content>
                        </v-card>
                    </v-card>


                </v-scroll-y-transition>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {ISimpleUser, IUser, SimpleUser, User} from "@/models/User";
    import {UserAPI} from "@/api/UserAPI";
    import {SkillsAPI} from "@/api/SkillsAPI";
    import {State} from "vuex-class";
    import {ISkillsUser} from "@/models/SkillsUser";
    import {Grade, IGrade} from "@/models/Grade";
    import {SkillsGradeAPI} from "@/api/SkillsGradeAPI";
    import {IPromotion, Promotion} from "@/models/Promotion";
    import PlanningCalendar from "@/components/planning/PlanningCalendar.vue";
    import {PlanningAPI} from "@/api/PlanningAPI";

    @Component({
        components: {
            PlanningCalendar
        },
    })
    export default class PlanningBoard extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        public subordinates: ISimpleUser[] = [];
        public subordinatesSkillsData: ISkillsUser[] = [];

        public selectedUser: ISimpleUser | null = null;
        public originUserGrade: IGrade = new Grade();
        public nextUserGrade: IGrade = new Grade();
        public users: IUser[] = [];

        public promotion: IPromotion = new Promotion();
        public previousPromotions: IPromotion[] = [];

        public invitedUsers: IUser[] = [];

        mounted() {
            this.fetchSubordinates();

            this.promotion.status = 'NOT CREATED';

            this.$bus.$on('promotionStartDate', (dateTime: string) => {
                if (this.promotion) {
                    this.promotion.startDate = dateTime
                    debugger
                }
            })

            this.$bus.$on('promotionEndDate', (dateTime: string) => {
                if (this.promotion) {
                    this.promotion.endDate = dateTime
                    debugger
                }
            })
        }

        public clearPromotionData() {
            this.promotion = new Promotion();
            this.invitedUsers = [];
            this.previousPromotions = [];
            this.promotion.status = 'NOT CREATED'
        }

        public createPromotion() {
            debugger
            if (this.selectedUser && this.promotion.startDate && this.promotion.endDate) {
                this.promotion.members = this.invitedUsers.map(u => u.id);
                this.promotion.userId = this.selectedUser.id;
                this.promotion.nextGradeId = this.nextUserGrade.id;
                this.promotion.originGradeId = this.getGradeByUserId(this.selectedUser.id).id;
                this.promotion.status = 'CREATED';
                debugger
                PlanningAPI.createPromotion(this.promotion)
                    .then(r => {
                        this.promotion = r.data;
                    })
            }
        }

        public cancelPromotion() {
            if (this.promotion.id && this.promotion.status === 'CREATED') {
                debugger
                PlanningAPI.deletePromotionById(this.promotion.id);
                this.clearPromotionData();
            }
        }

        public fetchSubordinates() {
            if (!!this.currentUser.id) {
                UserAPI.getUserSubordinates(this.currentUser.id).then((res) => {
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
                    this.subordinates = this.subordinates.filter(sub => {
                        let subSkillData = this.subordinatesSkillsData.find(ssd => ssd.id === sub.id)
                        return subSkillData && subSkillData.gradeProgress === 100
                    })
                })
        }

        public getGradeByUserId(userId: number): IGrade {
            if (this.subordinatesSkillsData && this.subordinatesSkillsData.length > 0) {
                let sub = this.subordinatesSkillsData.find(s => s.id === userId)
                if (sub && sub.grade) {
                    return sub.grade;
                }
            }
            let grade = new Grade();
            grade.name = 'N/A';
            return grade;
        }

        public selectUser(subordinate: ISimpleUser) {
            if (this.selectedUser === subordinate) {
                this.selectedUser = null;
            } else {
                this.selectedUser = subordinate
                this.fetchUserData(this.selectedUser);
            }
        }

        public goToUserProfile() {
            if (this.selectedUser) {
                this.$router.push({
                    name: 'UserProfile',
                    params:
                        {
                            id: this.selectedUser.id.toString()
                        }
                })
            }
        }

        public inviteUsersToPromotion() {

            // let selectedUserIndex = this.invitedUsers.findIndex(u => u.id === this.selectedUser!.id);
            // if (selectedUserIndex && selectedUserIndex === -1 && this.selectedUser) {
            //     let u: IUser = new User();
            //     u.id = this.selectedUser.id;
            //     u.name = this.selectedUser.name
            //     u.imageUrl = this.selectedUser.imageUrl
            //     u.position = this.selectedUser.position
            //     this.invitedUsers.push(u)
            //     debugger
            // }

            //....
        }

        public getEvents(date: Date) {
            // const [,, day] = date.split('-')
            // if ([12, 17, 28].includes(parseInt(day, 10))) return true
            // if ([1, 19, 22].includes(parseInt(day, 10))) return ['red', '#00f']
            return false
        }

        public eventHighL(): string {
            return '';
        }

        /**
         * Fetching selected user data
         */
        public fetchUserData(subordinate: ISimpleUser) {
            let currentGrade: IGrade = this.getGradeByUserId(subordinate.id);
            this.promotion.originGradeId = currentGrade.id;

            this.fetchNextGradeById(currentGrade.nextGradeId);
            this.fetchUsersForInvite();

            this.originUserGrade = this.getGradeByUserId(subordinate.id);
            PlanningAPI.getAllPromotionsByUserId(subordinate.id)
                .then(r => {
                    debugger
                    let createdPromotion = r.data.filter(p => p.status === 'CREATED')[0];
                    if (createdPromotion) {
                        this.promotion = createdPromotion;
                    }
                    this.previousPromotions = r.data.filter(p => p.status === 'FAILED' || p.status === 'SUCCESS')
                })
        }

        public fetchNextGradeById(gradeId: number) {
            SkillsGradeAPI.getGradeById(gradeId)
                .then(r => this.nextUserGrade = r.data);
        }

        public fetchUsersForInvite() {
            UserAPI.getAllUsers()
                .then((res) => {
                    this.users = res.data
                        .filter(u => u.name !== 'SYSTEM' || u.email !== 'system@skillup.com')
                        .filter(u => u.id !== this.selectedUser!.id)

                    if (this.promotion.members && this.promotion.members.length > 0) {
                        // set entries into invited users
                        for (let i = 0, len = this.promotion.members.length; i < len; i++) {
                            let num = this.promotion.members[i];
                            let invitedUser = this.users.find(u => u.id === num);
                            debugger
                            if (invitedUser) {
                                this.invitedUsers = [];
                                this.invitedUsers.push(invitedUser);
                            }
                        }
                    }
                });
        }

        public fetchCurrentUserEvents() {
            // for using 'Date events'

        }

        //  CHECK PROMOTION STATUS

        get isNotCreatedPromotion(): boolean {
            return this.promotion.status === 'NOT CREATED'
        }

        get isCreatedPromotion(): boolean {
            return this.promotion.status === 'CREATED'
        }

        get isSuccessPromotion(): boolean {
            return this.promotion.status === 'SUCCESS'
        }

        get isFailedPromotion(): boolean {
            return this.promotion.status === 'FAILED'
        }

    }
</script>