<template>
    <v-card>
        <v-snackbar
                v-model="snackbar"
                :multi-line="multiline"
                :timeout="timeout"
                :color="color"
                @input="snackbarHide"
        >
            {{ text }}
            <v-btn color="white" text fab @click="snackbarHide">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>
    </v-card>
</template>

<script>
    export default {
        name: 'StatusReport',
        components: {

        },
        data() {
            return {
                multiline: true,
                timeout: 6000,
            }
        },
        props: {
            snackbar: Boolean,
            text: String,
            color: String,
        },
        methods: {
            snackbarHide() {
                this.$emit("input", false)
            }
        }

    }
</script>