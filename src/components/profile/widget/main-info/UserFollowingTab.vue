<template>
    <div class="tab-max-size">
        <div v-if="user.followings.length > 0">
            <v-chip
                    class="ma-2"
                    @click.prevent="goToFollowingProfile(following.id)"
                    outlined
                    :key="index" v-for="(following, index) in user.followings"
            >
                <v-avatar left>
                    <img height="24px" width="24px" :src="following.imageUrl"/>
                </v-avatar>
                {{following.name}}
            </v-chip>
        </div>
        <span class="body-2 text--secondary" v-if="user.followings.length === 0">
            {{no_followings_text}}
        </span>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {IUser} from "@/models/User";
    import {IProfile} from "@/models/Profile";
    import {State} from "vuex-class";

    @Component({
        components: {},
    })
    export default class UserFollowingTab extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        @Prop()
        public readonly user!: IUser;

        @Prop()
        public readonly profile!: IProfile;

        goToFollowingProfile(profileId: number) {
            this.$router.push({
                name: 'UserProfile',
                params:
                    {
                        id: profileId.toString()
                    }
            });
        }

        get no_followings_text() : string {
            let username = this.user.name;
            if (this.currentUser.id === this.user.id) {
                username = 'you are';
            }
            return 'Right now ' + username + ' not following anyone!'
        }

        data() {
            return {

            }
        }
    }
</script>