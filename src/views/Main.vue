<template>
    <v-container>

        <Header/>

        <v-navigation-drawer fixed app clipped permanent expand-on-hover>
            <v-list nav dense>
                <v-list-item @click="gotoPath(item.path)" link :key="index" v-for="(item, index) in items">
                        <v-list-item-icon>
                            <v-icon>mdi-folder</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            {{item.title}}
                        </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>


        <v-content>
            <router-view/>
        </v-content>

        <Footer/>

    </v-container>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component} from 'vue-property-decorator';
    import Skills from "@/components/skills/Skills.vue";
    import Footer from "@/components/footer/Footer.vue";
    import Header from "@/components/header/Header.vue";

    @Component({
        components: {
            Header,
            Footer,
            Skills,
        },
    })
    export default class Main extends Vue {

        /*  Routing  */
        items: any[] = [
            {title: 'Home', icon: 'dashboard', path: '/'},
            {title: 'Skills', icon: 'question_answer', path: '/skills'},
        ]

        gotoPath(path: string) {
            this.$router.push({ path: path })
        }
    };
</script>
