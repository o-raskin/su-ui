<template>
    <v-container>
        <v-toolbar dense short flat>

            <v-toolbar-title>Skill Board</v-toolbar-title>

            <v-spacer/>

            <v-btn icon>
                <v-icon>mdi-plus</v-icon>
            </v-btn>

            <v-btn icon>
                <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>

            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
        </v-toolbar>

        <v-divider/>

        <v-row>
            <v-col>
                <v-card class="mx-auto" outlined>
                    <v-sheet tile class="pa-4 primary lighten-1">
                        <v-text-field
                                v-model="search"
                                :label="filter_default_value"
                                dark
                                flat
                                solo-inverted
                                hide-details
                                clearable
                                clear-icon="mdi-close-circle-outline"
                        ></v-text-field>
                        <v-checkbox
                                v-model="caseSensitive"
                                dark
                                hide-details
                                label="case sensitive"
                        ></v-checkbox>
                    </v-sheet>
                    <v-treeview
                            v-model="selection"
                            :items="convertToTree(skills)"
                            :search="search"
                            :filter="filter"
                            :selection-type="selectionType"
                            selectable
                            activatable
                            hoverable="true"
                            v-on:update:active="setActive"
                    />
                </v-card>
            </v-col>
            <v-divider vertical/>
            <v-col>
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
    import _ from 'lodash';

    export default {
        name: 'SkillBoard',
        components: {
            SkillCard
        },
        data() {
            return {
                activeSkill: null,
                skills: [],
                selection: [],
                selectionType: 'leaf',

                //  Filter
                search: null,
                caseSensitive: false,

                // Strings
                filter_default_value: 'Start typing to filter...'
            }
        },
        methods: {
            setActive(id) {
                if (id.length === 0 || id[0] === null) {
                    this.activeSkill = null
                } else {
                    for (let skill of this.skills) {
                        if (skill.id === id[0]) {
                            this.activeSkill = skill
                        }
                    }
                }
            },
            convertToTree(arr) {
                var tree = [],
                    mappedArr = {},
                    arrElem,
                    mappedElem;

                // First map the nodes of the array to an object -> create a hash table.
                for (var i = 0, len = arr.length; i < len; i++) {
                    arrElem = arr[i];
                    mappedArr[arrElem.id] = arrElem;
                    mappedArr[arrElem.id]['children'] = [];
                }

                for (var id in mappedArr) {
                    if (mappedArr.hasOwnProperty(id)) {
                        mappedElem = mappedArr[id];
                        // If the element is not at the root level, add it to its parent array of children.
                        if (mappedElem.parentId) {
                            mappedArr[mappedElem['parentId']]['children'].push(mappedElem);
                        }
                        // If the element is at the root level, add it to first level elements array.
                        else {
                            tree.push(mappedElem);
                        }
                    }
                }
                return tree;
            }
        },
        computed: {
            filter () {
                return this.caseSensitive
                    ? (skill, search, name) => skill[name].indexOf(search) > -1
                    : undefined
            },
        },

        async mounted() {
            this.skills = await SkillApi.getAll();
        },


    }
</script>