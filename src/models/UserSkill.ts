import {ISimpleSkill} from "@/models/SimpleSkill";

export interface IUserSkill {

    userId?: number;
    skill: ISimpleSkill;
    startDate: Date | string | null;
    endDate: Date | string | null;
    status: string;
    editorId: number | undefined;
    lastEditDate: Date | string | null;
}

export class UserSkill implements IUserSkill{

    userId?: number;
    skill!: ISimpleSkill;
    startDate!: Date | string | null;
    endDate!: Date | string | null;
    status!: string;
    editorId: number | undefined;
    lastEditDate!: Date | string | null;
}