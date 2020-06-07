<template>
    <div class="tab-max-size">

        <v-card-text>
            <span v-if="!!this.user.mentor" class="text--secondary">
                {{ $t('profile.widget.main_info.profile_tab.mentor_field') + ': '}}
                <a class="link" @click="goToMentorProfile">
                    {{this.user.mentor.name}}
                </a>
                <br/>
            </span>

            <span v-if="!!this.promotionDate && this.promotionDate !== ''" class="text--secondary">
                {{ $t('profile.widget.main_info.profile_tab.promotion_field') + ': ' }}
                <span class="text--primary">
                    {{ this.promotionDate | formatDateTime }}
                </span>
                <br/>
            </span>

            <span v-if="!!this.lastPromotionDate && this.lastPromotionDate !== ''" class="text--secondary">
                {{ $t('profile.widget.main_info.profile_tab.last_promotion_field') + ': '}}
                <span class="text--primary">
                    {{ this.lastPromotionDate | formatDateTime }}
                </span>
                <br/>
            </span>

            <span v-if="!!this.user.inCompanySince" class="text--secondary">
                {{ $t('profile.widget.main_info.profile_tab.in_company_since_field') + ': '}}
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
    import {PromotionAPI} from "@/api/PromotionAPI";

    @Component({
        components: {},
    })
    export default class UserProfileTab extends Vue {

        @Prop()
        public readonly user!: IUser;

        @Prop()
        public readonly profile!: IProfile;

        public promotionDate: Date | string = '';
        public lastPromotionDate: Date | string = '';

        public goToMentorProfile() {
            this.$router.push({
                name: 'UserProfile',
                params:
                    {
                        id: this.user.mentor!.id.toString()
                    }
            });
        }

        mounted() {
            this.fetchPromotionData();
        }

        public fetchPromotionData() {
            PromotionAPI.getAllPromotionsByUserId(this.user.id)
                .then(r => {
                    let promotion = r.data.filter(p => p.status === 'CREATED')[0];
                    if (promotion && promotion.startDate) {
                        this.promotionDate = promotion.startDate
                    }

                    let prevPromotions = r.data
                        .filter(p => p.status !== 'CREATED')
                        .sort((p1, p2) => {
                            return -(new Date(p1.startDate).getTime() - new Date(p2.startDate).getTime())
                        });
                    this.lastPromotionDate = prevPromotions[0].startDate
                    debugger
                });
        }
    }
</script>