<template>
    <v-container>
        <v-row>
            <v-col>
                <v-treeview
                        v-model="selection"
                        :items="skills"
                        :selection-type="selectionType"
                        selectable
                        activatable
                        hoverable="true"
                        v-on:update:active="setActive"
                />
            </v-col>
            <v-divider vertical></v-divider>
            <v-col class="pa-6" cols="6">
                <template v-if="activeSkill === null">
                    <p class="text--disabled">
                        Choose skill...
                    </p>
                </template>
                <template v-else>
                    <SkillCard :skill="activeSkill"/>
                </template>
            </v-col>
        </v-row>

    </v-container>
</template>


<script>
    import {SkillApi} from "@/api/SkillAPI";
    import SkillCard from './SkillCard';

    export default {
        name: 'Skills',
        components: {
            SkillCard
        },
        data() {
            return {
                activeSkill: null,
                skills: [],
                selection: [],
                selectionType: 'leaf',
            }
        },
        methods: {
            setActive(id) {
                debugger
                if (id.length === 0 || id[0] === null) {
                    this.activeSkill = null
                } else {
                    let flatSkillArray = this.skills.flat(Infinity);
                    debugger
                    for (let skill of flatSkillArray) {
                        if (skill.id === id[0]) {
                            this.activeSkill = skill
                        }
                    }
                }
            }
        },

        async mounted() {
            this.skills = await SkillApi.getAllSkills();
        }

    }
</script>