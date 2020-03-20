<template>
    <div class="container container-table">
        <!-- login Button -->
        <a id="signin-button" @click.prevent="login">
            <i class="fa fa-google-plus-official fa-3x"></i>
            Sign in with Google
        </a>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {BACKEND_URL, FRONTEND_URL} from "@/api/AxiosClient";

    export default {
        name: 'Login',
        data() {
            return {
                timer: 0
            }
        },
        computed: {
            token() {
                return this.$route.query.token
            },
            currentUser() {
                return this.$store.state.currentUser;
            }
        },
        created() {
            if (this.token) {
                localStorage.setItem('ACCESS_TOKEN', this.token)
                this.$store.dispatch('auth')
            }
            this.timer = setInterval(() => {
                if (this.currentUser.id) {
                    this.$router.push({path: '/'});
                }
            }, 500);
        },
        beforeDestroy () {
            clearInterval(this.timer)
        },
        methods: {
            getCurrentUser() {
                return this.$store.state.currentUser;
            },
            login() {
                window.location.href = BACKEND_URL + '/oauth2/authorize/google?redirect_uri=' + FRONTEND_URL + '/login';
            },
        }
    }
</script>