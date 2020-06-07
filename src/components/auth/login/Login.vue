<template>
    <div class="welcome-container">
        <v-card
                class="mx-auto mt-10"
                max-width="344"
                outlined
                elevation="3"
        >
            <v-list-item three-line>
                <v-list-item-content class="text-center">

                    <div class="text-center mb-5">
                        <v-chip large
                                class="ma-2"
                                color="primary"
                        >
                            <div class="logo-color headline text-uppercase">
                                <span class="font-weight-light">{{main_title[0]}} </span> -
                                <span class="font-weight-bold">{{main_title[1]}} </span>
                                <span class="overline">{{main_title[2]}}</span>
                            </div>
                        </v-chip>
                    </div>

                    <v-list-item-title class="mb-1">
                        <div class="headline">
                            {{ $t('auth.welcome_message') }}
                        </div>
                    </v-list-item-title>

                    <v-list-item-subtitle>
                        {{ $t('auth.login_message') }}
                    </v-list-item-subtitle>

                    <v-divider class="ma-3"/>

                    <div class="text-center"
                         v-if="login_type === 'google'">
                        <v-chip
                                @click.prevent="login"
                                class="ma-2"
                                outlined
                        >
                            <v-avatar left>
                                <v-img src="picture/google-favicon.svg"/>
                            </v-avatar>
                            Google
                        </v-chip>
                    </div>
                    <v-form
                            ref="form"
                            v-model="valid"
                            v-if="login_type === 'inner'"
                    >
                        <v-text-field
                                v-model="email"
                                :rules="emailRules"
                                :label="email_field_text"
                                required
                                outlined
                        ></v-text-field>

                        <v-text-field
                                v-model="password"
                                :rules="passwordRules"
                                :label="password_field_text"
                                required
                                outlined
                        ></v-text-field>

                        <v-btn
                                :disabled="!valid"
                                @click.prevent="loginWithForm"
                                color="primary"
                        >
                            {{ $t('auth.login_btn') }}
                        </v-btn>
                    </v-form>
                </v-list-item-content>


            </v-list-item>

        </v-card>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {BACKEND_URL, FRONTEND_URL} from "@/api/AxiosClient";

    export default {
        name: 'Login',
        data() {
            return {
                //  LOGIN FORM TYPE
                login_type: 'google',
                main_title: ['Skill', 'Up', 'sys.'],

                timer: 0,
                welcome: 'Welcome!',
                login_request: 'Please, login to the system',
                login_btn_text: 'LOGIN',

                email_field_text: 'E-mail',
                email_valid_text: ['E-mail is required', 'E-mail must be valid'],
                password_field_text: 'Password',
                password_valid_text: ['Password is required', 'Password must be less than 6 characters'],

                // FORM
                email: '',
                emailRules: [
                    v => !!v || this.email_valid_text[0],
                    v => /.+@.+\..+/.test(v) || this.email_valid_text[1],
                ],
                password: '',
                passwordRules: [
                    v => !!v || this.password_valid_text[0],
                    v => (v && v.length >= 6) || this.password_valid_text[1],
                ],
                valid: false,
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
                this.$store.dispatch('updateCurrentUserData')
            }
            this.timer = setInterval(() => {
                if (this.currentUser.id) {
                    this.$router.push({path: '/'});
                }
            }, 500);
        },
        beforeDestroy() {
            clearInterval(this.timer)
        },
        methods: {
            getCurrentUser() {
                return this.$store.state.currentUser;
            },
            login() {
                window.location.href = BACKEND_URL + '/oauth2/authorize/google?redirect_uri=' + FRONTEND_URL + '/login';
            },
            loginWithForm() {
                //  Login form trigger request to backend
            },
        }
    }
</script>

<style lang="scss">
    .welcome-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .logo-color {
        color: white;
    }
</style>