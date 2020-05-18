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
                        <div class="text-center">
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
                                    color="red"
                                    class="custom-card-border ma-2"
                                    elevation="0">
                                CANCEL
                            </v-btn>

                            <v-btn
                                    v-if="this.isCreatedPromotion && this.isModified"
                                    @click="updatePromotion()"
                                    dark
                                    color="orange"
                                    class="custom-card-border ma-2"
                                    elevation="0">
                                UPDATE
                            </v-btn>
                        </div>

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

                                            <v-avatar size="88">
                                                <v-img :src="selectedUser.imageUrl"/>
                                            </v-avatar>

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
                                                {{(promotion.members && promotion.members.length > 0 ?
                                                invitedUsers.map(u => u.name) : 'None').toString()}}
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
                                                        @change="updateInvitedUsers"
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
                                                            <v-avatar size="40px" v-if="data.item.imageUrl">
                                                                <v-img :src="data.item.imageUrl"/>
                                                            </v-avatar>
                                                            <v-list-item-content class="ml-2">
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
                                                  :promotion="this.promotion"
                                />
                                <!--                                                  :promotion-end-date="this.promotion.endDate"-->

                                <!--    ACTIONS   -->

                                <div class="ma-4 text-center">
                                    <v-row justify="center">
                                        <v-dialog v-model="approveModal" persistent max-width="290">
                                            <template v-slot:activator="{ on }">
                                                <v-btn
                                                        outlined
                                                        v-if="this.isCreatedPromotion"
                                                        @click="successGradeUp()"
                                                        dark
                                                        color="green"
                                                        class="custom-card-border ma-2"
                                                        elevation="0">
                                                    SUCCESS
                                                </v-btn>
                                            </template>
                                            <v-card>
                                                <v-card-title class="headline">Approve promotion to next grade?</v-card-title>
                                                <v-card-text>You cannot reverse that decision.</v-card-text>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="green darken-1" text @click="approveModal = false">Disagree</v-btn>
                                                    <v-btn color="green darken-1" text @click="approveModal = false">Agree</v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>
                                    </v-row>

<!--                                    <v-btn-->
<!--                                            outlined-->
<!--                                            v-if="this.isCreatedPromotion"-->
<!--                                            @click="successGradeUp()"-->
<!--                                            dark-->
<!--                                            color="green"-->
<!--                                            class="custom-card-border ma-2"-->
<!--                                            elevation="0">-->
<!--                                        SUCCESS-->
<!--                                    </v-btn>-->

                                    <v-btn
                                            outlined
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

                                <div v-for="(prevPromotion, i) in this.previousPromotions"
                                     :key="i">

                                    <v-divider v-if="i !== 0"></v-divider>
                                    <v-list-item>
                                        <span class="body-2">
                                            {{prevPromotion.startDate | formatDate}}
                                        </span>
                                        <span class="body-2 ml-12">
                                            {{getGradeByGradeId(prevPromotion.nextGradeId).name}}
                                        </span>
                                        <v-spacer/>
                                        <v-chip small label class="font-weight-bold">
                                            {{prevPromotion.status}}
                                        </v-chip>
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
    import {Component, Vue, Watch, Ref} from 'vue-property-decorator';
    import {ISimpleUser, IUser, SimpleUser, User} from "@/models/User";
    import {UserAPI} from "@/api/UserAPI";
    import {SkillsAPI} from "@/api/SkillsAPI";
    import {State} from "vuex-class";
    import {ISkillsUser} from "@/models/SkillsUser";
    import {Grade, IGrade} from "@/models/Grade";
    import {SkillsGradeAPI} from "@/api/SkillsGradeAPI";
    import {IPromotion, Promotion} from "@/models/Promotion";
    import PlanningCalendar from "@/components/planning/PlanningCalendar.vue";
    import {PromotionAPI} from "@/api/PromotionAPI";
    import {IEvent} from "@/models/Event";
    import {UserEventsAPI} from "@/api/UserEventsAPI";

    @Component({
        components: {
            PlanningCalendar
        },
    })
    export default class PlanningBoard extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        public approveModal: boolean = false;

        public subordinates: ISimpleUser[] = [];
        public subordinatesSkillsData: ISkillsUser[] = [];

        public selectedUser: ISimpleUser | null = null;
        public originUserGrade: IGrade = new Grade();
        public nextUserGrade: IGrade = new Grade();
        public users: IUser[] = [];

        public promotion: IPromotion = new Promotion();
        public previousPromotions: IPromotion[] = [];

        public invitedUsers: IUser[] = [];

        public isModified: boolean = false;
        public isDatesUpdated: boolean = false;

        public grades: IGrade[] = [];

        public events: IEvent[] = [];

        @Watch("selectedUser")
        public watchSelectedUser(newVal: any, oldVal: any) {
            if (newVal && oldVal && newVal.id !== oldVal.id) {
                this.clearAllPromotionData();
                this.fetchSubordinates();
                this.fetchAllGrades();
                this.promotion.status = 'NOT CREATED';
            }
        }

        public selectUser(subordinate: ISimpleUser) {
            if (this.selectedUser && this.selectedUser.id === subordinate.id) {
                this.selectedUser = null;
                this.clearAllPromotionData();
            } else {
                this.selectedUser = subordinate
                this.fetchUserData(this.selectedUser);
            }
        }

        mounted() {
            this.fetchSubordinates();
            this.fetchAllGrades();
            this.promotion.status = 'NOT CREATED';

            this.$bus.$on('promotionStartDate', (dateTime: string) => {
                if (this.promotion && (this.promotion.startDate !== dateTime)) {
                    this.promotion.startDate = dateTime
                    this.isModified = true;
                    this.isDatesUpdated = true;
                }
            })

            this.$bus.$on('promotionEndDate', (dateTime: string) => {
                if (this.promotion && this.promotion.endDate !== dateTime) {
                    this.promotion.endDate = dateTime
                    this.isModified = true;
                    this.isDatesUpdated = true;
                }
            })
        }

        // PROMOTION ACTIONS

        public successGradeUp() {
            if (this.promotion) {
                PromotionAPI.setPromotionStatus(this.promotion.id, 'SUCCESS');
                this.promotion.status = 'SUCCESS';
                this.previousPromotions.unshift(this.promotion);
                this.clearAllPromotionData();
            }
        }

        public failGradeUp() {
            if (this.promotion) {
                PromotionAPI.setPromotionStatus(this.promotion.id, 'FAILED')
                this.promotion.status = 'FAILED'
                this.previousPromotions.unshift(this.promotion);
                this.clearAllPromotionData();
            }
        }

        public clearAllPromotionData() {
            this.promotion = new Promotion();
            this.promotion.startDate = '';
            this.promotion.endDate = '';
            this.invitedUsers = [];
            this.promotion.status = 'NOT CREATED';
            this.isModified = false;
            this.isDatesUpdated = false;
        }

        public createPromotion() {
            if (this.selectedUser && this.promotion.startDate && this.promotion.endDate) {
                this.promotion.members = this.invitedUsers.map(u => u.id);
                this.promotion.userId = this.selectedUser.id;
                this.promotion.nextGradeId = this.nextUserGrade.id;
                this.promotion.originGradeId = this.getGradeByUserId(this.selectedUser.id).id;
                this.promotion.status = 'CREATED';
                PromotionAPI.createPromotion(this.promotion)
                    .then(r => {
                        this.promotion = r.data;
                        this.isModified = false;
                    })
            }
        }

        public updatePromotion() {
            if (this.selectedUser && this.promotion.startDate && this.promotion.endDate) {
                PromotionAPI.createPromotion(this.promotion)
                    .then(r => {
                        this.promotion = r.data;
                        this.isModified = false;
                    })
            }
        }

        public cancelPromotion() {
            if (this.promotion.id && this.promotion.status === 'CREATED') {
                PromotionAPI.deletePromotionById(this.promotion.id);
                this.clearAllPromotionData();
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

        public getGradeByGradeId(gradeId: number): IGrade {
            let grade = this.grades.find(g => g.id === gradeId)
            if (grade) {
                return grade;
            } else {
                grade = new Grade();
                grade.name = 'N/A';
                return grade;
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

        public fetchMemberPromotions(user : IUser|undefined) {
            if (user && user.id) {
                UserEventsAPI.getUserEvents(user.id)
                    .then(response => {
                        debugger
                        for (let currentUserEvent in response.data) {

                        }
                    })
            }
        }

        public eventHighL(): string {
            return '';
        }

        /**
         * Fetching selected user data
         */
        public fetchUserData(subordinate: ISimpleUser) {

            this.originUserGrade = this.getGradeByUserId(subordinate.id);
            this.promotion.originGradeId = this.originUserGrade.id;

            this.nextUserGrade = this.getGradeByGradeId(this.originUserGrade.nextGradeId);
            this.promotion.nextGradeId = this.nextUserGrade.id;

            PromotionAPI.getAllPromotionsByUserId(subordinate.id)
                .then(r => {
                    let createdPromotion = r.data.filter(p => p.status === 'CREATED')[0];
                    if (createdPromotion) {
                        this.promotion = createdPromotion;
                    }
                    this.previousPromotions = r.data.filter(p => p.status === 'FAILED' || p.status === 'SUCCESS')
                    this.previousPromotions.sort((p1,p2) => {
                        return -(new Date(p1.startDate).getTime() - new Date(p2.startDate).getTime())
                    })

                    this.fetchUsersForInvite();
                })
        }

        public fetchAllGrades() {
            SkillsGradeAPI.getAll()
                .then(r => {
                    this.grades = r.data
                });
        }

        public fetchUsersForInvite() {
            UserAPI.getAllUsers()
                .then((res) => {
                    this.users = res.data
                        .filter(u => u.name !== 'SYSTEM' || u.email !== 'system@skillup.com')
                        .filter(u => u.id !== this.selectedUser!.id)

                    // set entries into invited users array
                    if (this.promotion.members && this.promotion.members.length > 0) {
                        this.invitedUsers = [];
                        for (let i = 0, len = this.promotion.members.length; i < len; i++) {
                            let num = this.promotion.members[i];
                            let invitedUser = this.users.find(u => u.id === num);
                            if (invitedUser) {
                                this.invitedUsers.push(invitedUser);
                            }

                            this.fetchMemberPromotions(invitedUser);
                        }
                    }
                });
        }


        //  CHECK PROMOTION STATUS

        get isNotCreatedPromotion(): boolean {
            return this.isDatesUpdated && this.promotion.status === 'NOT CREATED';
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

        // CHECK INVITED USERS CHANGES
        public updateInvitedUsers() {
            this.isModified = true;
            this.promotion.members = this.invitedUsers.map(u => u.id)
        }

    }
</script>