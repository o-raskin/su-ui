<template>
    <v-container fluid align="center" justify="center" ml-0 mr-0>
        <v-layout text-center wrap>
            <v-flex>

                <!--    Core    -->
                <v-list>
                    <v-list-item :key="index" v-for="(skill, index) in skills">
                        <v-list-item-title>
                            {{skill.name}}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>

            </v-flex>
        </v-layout>
    </v-container>
</template>


<script lang="ts">
    import Component from "vue-class-component";
    import {SkillApi} from "@/api/SkillAPI";
    import Vue from "vue";
    import {SkillDTO} from "@/models/Skill";

    @Component
    export default class Skills extends Vue {

        private skills: SkillDTO[] = [];

        async mounted(): Promise<void> {
            this.skills = await SkillApi.getAllSkills();
        }
    }
</script>