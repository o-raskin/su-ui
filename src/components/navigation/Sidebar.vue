<template>
    <v-navigation-drawer fixed app clipped permanent expand-on-hover>
        <v-list nav dense>
            <v-list-item @click="gotoPath(item.path)" link :key="index" v-for="(item, index) in items">
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
            {title: 'Home', icon: 'mdi-home', path: '/'},
            {title: 'Skills', icon: 'mdi-electron-framework', path: '/skills'},
        ]

        gotoPath(path: string) {
            this.$router.push({ path: path })
        }
    }
</script>
