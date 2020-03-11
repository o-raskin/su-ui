<template>
      <Main/>
</template>

<script lang="ts">
    import Vue from "vue";
    import Main from "@/views/Main.vue";

    export default Vue.extend({
        name: 'App',
        components: {
            Main,
        },
        data: () => ({

        }),
    });
</script>
