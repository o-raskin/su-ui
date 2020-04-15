
export interface IUserSkill {

    skillId?: number;
    userId?: number;
    startDate: Date | string | null;
    endDate: Date | string | null;
    status: string;
}

export class UserSkill implements IUserSkill{

    skillId?: number;
    userId?: number;
    startDate!: Date | string | null;
    endDate!: Date | string | null;
    status!: string;

}