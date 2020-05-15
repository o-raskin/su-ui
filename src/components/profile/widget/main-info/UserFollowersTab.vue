<template>
    <div class="tab-max-size">
        <div v-if="user.followers.length > 0">
            <v-chip
                    class="ma-2"
                    @click.prevent="goToFollowerProfile(follower.id)"
                    outlined
                    :key="index" v-for="(follower, index) in user.followers"
            >
                <v-avatar left>
                    <img :src="follower.imageUrl"/>
                </v-avatar>
                {{follower.name}}
            </v-chip>
        </div>
        <span class="body-2 text--secondary" v-if="user.followers.length === 0">
            {{no_followers_text}}
        </span>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {IUser, User} from "@/models/User";
    import {IProfile, Profile} from "@/models/Profile";

    @Component({
        components: {},
    })
    export default class UserFollowersTab extends Vue {

        @Prop()
        public readonly user!: IUser;

        goToFollowerProfile(profileId: number) {
            this.$router.push({
                name: 'UserProfile',
                params:
                    {
                        id: profileId.toString()
                    }
            });
        }

        data() {
            return {
                no_followers_text: 'Right now here no one follower!'
            }
        }
    }
</script>