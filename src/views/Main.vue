<template>
    <v-container>

        <Header/>

        <Sidebar/>


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
    import Sidebar from "@/components/navigation/Sidebar.vue";

    @Component({
        components: {
            Sidebar,
            Header,
            Footer,
            Skills,
        },
    })
    export default class Main extends Vue {

    };
</script>
