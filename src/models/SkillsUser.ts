import {IGrade} from "@/models/Grade";
import {IUserSkill} from "@/models/UserSkill";

export interface ISkillsUser {
    id: number;
    grade: IGrade | undefined;
    gradeProgress: number;
    skills: IUserSkill[];
}

export class SkillsUser implements ISkillsUser {
    id!: number;
    grade!: IGrade | undefined;
    gradeProgress!: number;
    skills!: IUserSkill[];
}