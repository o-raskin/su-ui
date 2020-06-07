<template>
    <v-dialog v-model="this.dialog" width="600px">
        <template v-slot:activator="{ on }">
            <v-list-item v-on="on">
                <v-list-item-avatar>
                    <v-icon>
                        mdi-tune
                    </v-icon>
                </v-list-item-avatar>
                <v-list-item-title>
                    {{ $t('profile.settings.title') }}
                </v-list-item-title>
            </v-list-item>
        </template>
        <v-card>
            <v-card-title class="text-center">
                <span>{{ $t('profile.settings.title') }}</span>
            </v-card-title>
            <v-card-text>

                <!--    LANGUAGE    -->

                <div>
                    <span class="body-1 text--primary">{{ $t('profile.settings.language.title') }}</span>
                    <v-radio-group
                            @change="switchLocale"
                            class="ml-5"
                            v-model="userLocale"

                            :mandatory="false">
                        <v-radio label="English" value="en"></v-radio>
                        <v-radio label="Русский" value="ru"></v-radio>
                    </v-radio-group>
                </div>

                <!--    PROFILE VISIBILITY  -->

                <div>
                    <span class="body-1 text--primary">{{ $t('profile.settings.privacy.title') }}</span>
                    <v-list>
                        <v-list-item>
                            <v-list-item-action>
                                <v-switch
                                        v-model="currentUserProfile.visibility"
                                        v-on:change="updateCurrentUserProfile()"
                                        color="primary"
                                >
                                </v-switch>
                            </v-list-item-action>
                            <v-list-item-title v-if="currentUserProfile.visibility">
                                {{ $t('profile.settings.privacy.visibility.on') }}
                            </v-list-item-title>
                            <v-list-item-title v-if="!currentUserProfile.visibility" >
                                {{ $t('profile.settings.privacy.visibility.off') }}
                                <span class="caption text-break desc-work-breaker" v-if="!currentUserProfile.visibility">
                                    <br/>
                                    {{ $t('profile.settings.privacy.visibility.off_description') }}
                                </span>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>

                    <!--    WHITELIST   -->

                    <v-list v-if="this.currentUserProfile.visibility === false">

                        <template v-for="(person, index) in currentUserProfile.whitelist">
                            <v-subheader>
                                {{ $t('profile.settings.privacy.visibility.whitelist.title') }}
                            </v-subheader>

                            <v-divider/>

                            <v-list-item
                                    :key="person.id"
                                    @click="goToUserProfile(person.id)"
                            >
                                <v-list-item-avatar>
                                    <v-img :src="person.imageUrl"></v-img>
                                </v-list-item-avatar>

                                <v-list-item-content>
                                    <v-list-item-title>{{person.name}}</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-btn icon @click="removeWhitelistUser(person)">
                                        <v-icon>
                                            mdi-close-box
                                        </v-icon>
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>
                        </template>
                    </v-list>
                </div>

            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {State} from "vuex-class";
    import profileModule from "../../../store/profile-store";
    import {IProfile} from "@/models/Profile";
    import {ISimpleUser, SimpleUser} from "@/models/User";

    @Component
    export default class ProfileSettings extends Vue {

        @State((state) => profileModule.state.currentUserProfile)
        public currentUserProfile!: IProfile;

        public dialog: boolean = false;

        public userLocale: string = this.$store.state.userLocale;

        public switchLocale() {
            if (this.$i18n.locale !== this.userLocale) {
                this.$i18n.locale = this.userLocale;
                this.$store.dispatch('updateUserLocale', this.userLocale)
                window.location.reload()
            }
        }

        public updateCurrentUserProfile() {
            this.$store.dispatch('updateProfile', this.currentUserProfile)
        }

        public removeWhitelistUser(user: ISimpleUser) {
            this.currentUserProfile.whitelist.splice(this.currentUserProfile.whitelist.indexOf(user), 1);
            this.$store.dispatch('updateProfile', this.currentUserProfile)
        }

        public goToUserProfile(userId: number) {
            this.$router.push({
                name: 'UserProfile',
                params:
                    {
                        id: userId.toString()
                    }
            });
        }

        data() {
            return {
                profileSettingsTitle_text: 'Profile settings',
                privacy_title_text: 'Privacy',
                whitelist_title_text: 'Whitelist users',
                visible_profile_text: 'Visible profile',
                invisible_profile_text: 'Invisible profile',
                invisible_profile_subtitle_text: 'Only important and users from whitelist can see your profile',
            }
        }
    }
</script>

<style lang="scss" scoped>
    .desc-work-breaker {
        white-space: normal;
    }
</style>