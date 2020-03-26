<template>
    <v-card outlined>

        <div class="d-flex flex-wrap">

            <v-avatar
                    class="ma-3 avatar"
                    rounded
                    size="150"
                    tile
            >
                <v-img class="ma-1" :src="user.imageUrl"></v-img>
            </v-avatar>

        </div>

        <div class="ma-3">
            <v-progress-linear
                    :height="current_grade_progress_height"
                    :value="current_grade_progress"
                    dark
                    rounded
                    class="overline"
            >
                {{current_grade_progress + '%'}}
            </v-progress-linear>
        </div>

        <v-list class="ma-1" nav dense>
            <v-list-item
                    link
                    v-if="this.currentUser.id !== this.user.id"
            >
                <v-list-item-title class="text-uppercase text-center">
                    {{btn_send_message_text}}
                </v-list-item-title>
            </v-list-item>

            <v-list-item
                    link
                    v-if="current_grade_progress === 100 && this.currentUser.id === this.user.mentorId"

            >
                <v-list-item-title class="text-uppercase text-center">
                    {{btn_approve_grade_text}}
                </v-list-item-title>
            </v-list-item>
        </v-list>


    </v-card>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {IProfile} from "@/models/Profile";
    import {IUser} from "@/models/User";
    import {State} from "vuex-class";

    @Component({
        components: {
        },
    })
    export default class Avatar extends Vue {

        @State((state) => state.currentUser)
        public readonly currentUser!: IUser;

        @Prop()
        public readonly user!: IUser;

        @Prop()
        public readonly profile!: IProfile;

        data() {
            return {
                btn_send_message_text: 'Chat',
                btn_approve_grade_text: 'Grade approve',

                current_grade_progress: 100,
                current_grade_progress_height: 20,
            }
        }
    }
</script>

<style lang="scss" scoped>
    .avatar {
        border-radius: 4px;
    }
    .action-btn {
        font-weight: bold;
    }
</style>