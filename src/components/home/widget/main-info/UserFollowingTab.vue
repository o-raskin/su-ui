<template>
    <div>
        {{'Following here!'}}
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {IUser} from "@/models/User";
    import {IProfile} from "@/models/Profile";

    @Component({
        components: {},
    })
    export default class UserFollowingTab extends Vue {

        @Prop()
        public readonly user!: IUser;

        @Prop()
        public readonly profile!: IProfile;

        data() {
            return {}
        }
    }
</script>