
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
    startDate: Date | string | null;
    endDate: Date | string | null;
    status: string;

    constructor(skillId: number, userId: number, startDate: Date | string | null, endDate: Date | string | null, status: string) {
        this.skillId = skillId;
        this.userId = userId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }
}