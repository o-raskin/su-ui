<template>
    <div class="tab-max-size">

        <v-card-text>
            <span v-if="!!this.user.mentor" class="text--secondary">
                {{mentor_text + ': '}}
                <a class="link" @click="goToMentorProfile">
                    {{this.user.mentor.name}}
                </a>
                <br/>
            </span>

            <span v-if="!!this.user.futurePromotionDate" class="text--secondary">
                {{user_future_promotion_text + ': ' }}
                <span class="text--primary">
                    {{ this.user.futurePromotionDate | formatDate }}
                </span>
                <br/>
            </span>

            <span v-if="!!this.user.lastPromotionDate" class="text--secondary">
                {{user_last_promotion_text + ': '}}
                <span class="text--primary">
                    {{ this.user.lastPromotionDate | formatDate }}
                </span>
                <br/>
            </span>

            <span v-if="!!this.user.inCompanySince" class="text--secondary">
                {{user_in_company_text + ': '}}
                <span class="text--primary">
                    {{this.user.inCompanySince | formatDate }}
                </span>
                <br/>
            </span>
        </v-card-text>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {IUser} from "@/models/User";
    import {IProfile} from "@/models/Profile";

    @Component({
        components: {},
    })
    export default class UserProfileTab extends Vue {

        @Prop()
        public readonly user!: IUser;

        @Prop()
        public readonly profile!: IProfile;

        public goToMentorProfile() {
            this.$router.push({
                name: 'UserProfile',
                params:
                    {
                        id: this.user.mentor!.id.toString()
                    }
            });
        }

        data() {
            return {
                mentor_text: 'Mentor',
                user_future_promotion_text: 'Promotion',
                user_last_promotion_text: 'Last promotion',
                user_in_company_text: 'In company since',
            }
        }
    }
</script>