<template>
    <v-tabs grow>
        <v-tabs-slider></v-tabs-slider>

        <v-tab>
            {{ $t('management.common_tab.title') }}
        </v-tab>
        <v-tab>
            {{ $t('management.users_tab.title') }}
        </v-tab>
        <v-tab>
            {{ $t('management.skills_tab.title') }}
        </v-tab>
        <v-tab-item>
            Common info
        </v-tab-item>

        <v-tab-item>
            <ManagementUsersTab />
        </v-tab-item>

        <v-tab-item>
            Skills settings
        </v-tab-item>

    </v-tabs>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {State} from 'vuex-class'
    import {IUser, User} from "@/models/User";
    import ManagementUsersTab from "@/components/management/users/ManagementUsersTab.vue";

    @Component({
        components: {
            ManagementUsersTab
        },
    })
    export default class Management extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

    }
</script>

<style lang="scss">
    .custom-nav-button {
        position: absolute;
        top: 35px;
        left: -50px;
    }
</style>