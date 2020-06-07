<template>
    <v-navigation-drawer dark fixed app clipped permanent expand-on-hover>
        <v-list nav dense>
            <template v-for="(item, index) in items" >
                <v-list-item :key="index"
                             @click="gotoPath(item.name)"
                             link
                             :disabled="item.disabled"
                             v-if="item.condition"
                >
                    <v-list-item-icon>
                        <v-icon>{{item.icon}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                        {{item.title}}
                    </v-list-item-title>
                </v-list-item>
            </template>
            <v-list-item @click="gotoPath('Management')"
                         link
                         v-if="this.currentUser.id === 951"
            >
                <v-list-item-icon>
                    <v-icon>mdi-account-cog</v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                    {{this.getLocalizedMessage('sidebar.point.management')}}
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import {State} from "vuex-class";
    import {IUser} from "@/models/User";
    import {UserAPI} from "@/api/UserAPI";

    @Component
    export default class Sidebar extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        public subordinatesCount: number = 0;

        /**
         *  Routing
         */
        public items: any[] = [
            {title: this.getLocalizedMessage('sidebar.point.home'), icon: 'mdi-home', name: 'Home', condition: true},
            {title: this.getLocalizedMessage('sidebar.point.skill_board'), icon: 'mdi-electron-framework', name: 'SkillBoard', condition: true},
            {
                title: this.getLocalizedMessage('sidebar.point.planning'),
                icon: 'mdi-calendar-multiselect',
                name: 'PlanningBoard',
                condition: false
            },
            {title: this.getLocalizedMessage('sidebar.point.employees'), icon: 'mdi-account-supervisor', name: 'ProfilesBoard', condition: true},
        ];
            // {title: this.getLocalizedMessage('sidebar.point.management'), icon: 'mdi-account-cog', name: 'Management', condition: true},
            // {title: this.getLocalizedMessage('sidebar.point.settings'), icon: 'mdi-tune-vertical', name: '', disabled: true, condition: true},

        public getLocalizedMessage(key : string) {
            return this.$t(key)
        }

        mounted() {
            this.fetchSubordinatesCount();
        }

        public fetchSubordinatesCount() {
            UserAPI.getUserSubordinates(this.currentUser.id)
                .then((res) => {
                    if (res.data.length > 0) {
                        let item = this.items.find(i => i.name === 'PlanningBoard');
                        item.condition = true
                    }
                });
        }

        gotoPath(name: string) {
            this.$router.push({name: name})
        }

    }
</script>
