<template>
    <v-card class="mx-auto" outlined>
        <v-list-item>
            <v-list-item-content>
                <div>
                    <v-chip
                            v-if="skill.status === not_approved"
                            color="grey"
                            text-color="white"
                            label
                            small
                    >
                        {{not_approved_value}}
                    </v-chip>
                    <v-chip
                            v-if="skill.status === approved"
                            color="green"
                            text-color="white"
                            label
                            small
                    >
                        {{approved_value}}
                    </v-chip>
                </div>

                <v-list-item-title class="headline mb-1">{{skill.name}}</v-list-item-title>
                <v-list-item-subtitle>{{skill.description}}</v-list-item-subtitle>
            </v-list-item-content>

            <v-avatar tile color="red">
                <span class="white--text headline">
                    {{ default_avatar_value }}
                </span>
            </v-avatar>
        </v-list-item>

        <v-divider class="mx-4"></v-divider>

        <v-list-item>
            <v-list-item-icon>
                <v-icon>mdi-cloud-download</v-icon>
            </v-list-item-icon>
            <!--                    v-if="skill.materials.length !== 0"-->
            <template
            >
                <v-list-item-subtitle>Materials</v-list-item-subtitle>
            </template>
        </v-list-item>

        <v-divider class="mx-4"></v-divider>

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
                not_approved: 'NOT_APPROVED',
                approved: 'APPROVED',

                //  Avatar
                default_avatar_value: '...',

                //  Strings
                not_approved_value: 'NOT APPROVED',
                approved_value: 'APPROVED',
            }
        },
        props: {
            skill: SkillDTO
        },
        methods: {},
        watch: {
            skill: function (val) {
                alert(val)
                var skillName = val.name
                var contentLength = skillName.length
                var uppercaseContent = skillName.replace(/[^A-Z]/g, "")

                if (uppercaseContent.length >= 2) skillName = uppercaseContent;

                if (contentLength < 0) {
                    this.default_avatar_value = 'S';
                } else if (contentLength === 1) {
                    this.default_avatar_value = skillName.substring(0, 1).toUpperCase;
                } else if (contentLength > 2) {
                    this.default_avatar_value = skillName.substring(0, 2).toUpperCase;
                }
                alert(this.default_avatar_value)
            },
        }
    }
</script>