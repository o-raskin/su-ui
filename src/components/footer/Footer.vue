<template>
    <v-footer app dark>
        <div class="mx-auto">
            <strong>
                <span class="overline font-weight-light">{{owner}} </span>
            </strong>
        </div>
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
