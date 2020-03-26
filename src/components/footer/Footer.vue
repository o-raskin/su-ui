<template>
    <v-footer app dark>
        <div class="mx-auto">
            <strong>
                <span class="overline font-weight-light">{{content}} </span>
            </strong>
        </div>
    </v-footer>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";

    @Component
    export default class Footer extends Vue {
        content: string = '2020';
    }
</script>
