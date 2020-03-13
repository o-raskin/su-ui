<template>
    <v-footer app>
        <v-col class="text-center overline" padless cols="12">
            <strong>
                <span class="font-weight-light">{{owner}} </span>
            </strong>
        </v-col>
    </v-footer>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";

    @Component
    export default class Footer extends Vue {
        owner: string = 'Raskin O.D.';
    }
</script>
