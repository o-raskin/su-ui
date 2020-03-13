<template>
    <v-card
            class="mx-auto"
            outlined
    >
        <v-list-item three-line>
            <v-list-item-content>
                <div class="overline mb-4">{{skill.status}}</div>
                <v-list-item-title class="headline mb-1">{{skill.name}}</v-list-item-title>
                <v-list-item-subtitle>{{skill.description}}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar
                    tile
                    size="80"
                    color="grey"
            ></v-list-item-avatar>
        </v-list-item>

        <v-card-actions>
            <v-btn text>Button</v-btn>
            <v-btn text>Button</v-btn>
        </v-card-actions>
    </v-card>
</template>


<script>

    import {SkillDTO} from "@/models/Skill";

    export default {
        name: 'SkillCard',
        components: {},
        data() {
            return {

            }
        },
        props: {
            skill: SkillDTO
        },
        methods: {

        },

    }
</script>