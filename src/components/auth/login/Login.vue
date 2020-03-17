<template>
    <div class="container container-table">
        <!-- Errors -->
        <div v-if=response class="text-red"><p>{{response}}</p></div>

        <!-- login Button -->
        <a id="signin-button" href="http://localhost:8099/oauth2/authorize/google?redirect_uri=http://localhost:4040/oauth2/redirect">
            <i class="fa fa-google-plus-official fa-3x"></i>
            Sign in with Google
        </a>
    </div>
</template>

<script>
    import Vue from 'vue'
    import AxiosClient from "@/api/AxiosClient";

    export default {
        name: 'Login',
        data() {
            return {}
        },
        methods: {
            signIn() {
                this.$gAuth.getAuthCode()
                    .then(authCode => {
                        //on success
                        console.log('AUTH_CODE: ' + authCode)
                        let redirectUri = ''
                        return AxiosClient.get('' + '' + redirectUri,
                            { code: authCode, redirect_uri: redirectUri })
                    })
                    .then(response => {
                        //after ajax
                    })
                    .catch(error => {
                        //on fail do something
                    })
            }
        }
    }
</script>