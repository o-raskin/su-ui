export interface ISuccessCriterion {
    id?: number;
    name: string;
    description: string;
    finishDate: Date;
    achieved: boolean;
}

export interface ISkill {
    id?: number;
    name: string;
    description: string;
    status: string;
    start_date: Date;
    end_date: Date;
    parent: ISkill;
    children: ISkill[];
    successCriteria: ISuccessCriterion[];
}