
export interface ISuccessCriterion {
    id?: number;
    name: string;
    description: string;
}

export interface ISkill {
    id?: number;
    name: string;
    description: string;
    parent: ISkill;
    children: ISkill[];
    successCriteria: ISuccessCriterion[];
}