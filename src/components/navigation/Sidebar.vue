<template>
    <v-navigation-drawer  dark fixed app clipped permanent expand-on-hover>
        <v-list nav dense>
            <v-list-item @click="gotoPath(item.name)" link :key="index" v-for="(item, index) in items">
                <v-list-item-icon>
                    <v-icon>{{item.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                    {{item.title}}
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";

    @Component
    export default class Sidebar extends Vue {

        /*  Routing  */
        items: any[] = [
            {title: 'Home', icon: 'mdi-home', name: 'Home'},
            {title: 'Skill Board', icon: 'mdi-electron-framework', name: 'SkillBoard'},
            {title: 'Grade', icon: 'mdi-medal', name: ''},
            {title: 'Employees', icon: 'mdi-account-supervisor', name: 'ProfilesBoard'},
            {title: 'Management', icon: 'mdi-account-cog', name: ''},
            {title: 'System settings', icon: 'mdi-tune-vertical', name: ''},
        ];

        gotoPath(name: string) {
            this.$router.push({ name: name })
        }

    }
</script>
