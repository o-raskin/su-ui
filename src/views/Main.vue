<template>
    <v-container>

        <Header/>

        <Sidebar v-if="isAuthenticated"/>

        <v-content>
            <router-view/>
        </v-content>

        <Footer/>

    </v-container>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component} from 'vue-property-decorator';
    import Footer from "@/components/footer/Footer.vue";
    import Header from "@/components/header/Header.vue";
    import Sidebar from "@/components/navigation/Sidebar.vue";

    @Component({
        components: {
            Sidebar,
            Header,
            Footer,
        },
    })
    export default class Main extends Vue {

        get isAuthenticated() {
            return this.$store.state.currentUser.id;
        }
    };
</script>
