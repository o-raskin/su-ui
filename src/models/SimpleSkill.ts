
export interface ISimpleSkill {
    id: number;
    name: string;
    description: string;
    previousGradeId: number;
}

export class SimpleSkill implements ISimpleSkill {
    id!: number;
    name!: string;
    description!: string;
    previousGradeId!: number;
}