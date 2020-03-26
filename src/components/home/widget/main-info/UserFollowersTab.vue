<template>
    <div>
        <v-chip
                class="ma-2"
                dark
                :key="index" v-for="(follower, index) in profile.followersIds"
        >
            <v-avatar>
                <img :src="follower.imageUrl" />
            </v-avatar>
            {{follower.name}}
        </v-chip>
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

        @Prop()
        public readonly profile!: IProfile;

        data() {
            return {

            }
        }
    }
</script>