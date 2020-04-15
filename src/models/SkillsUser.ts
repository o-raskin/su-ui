import {IGrade} from "@/models/Grade";

export interface ISkillsUser {
    id: number;
    grade: IGrade | undefined;
    gradeProgress: number;
}

export class SkillsUser implements ISkillsUser {
    id: number;
    grade: IGrade | undefined;
    gradeProgress: number;

    constructor(id: number, grade: IGrade, gradeProgress: number) {
        this.id = id;
        this.grade = grade;
        this.gradeProgress = gradeProgress;
    }
}