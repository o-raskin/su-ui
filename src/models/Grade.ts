
export interface IGrade {
    id: number;
    name: string;
    description: string;
    positionId: number;
    nextGradeId: number;
}

export class Grade implements IGrade {
    id!: number;
    name!: string;
    description!: string;
    positionId!: number;
    nextGradeId!: number;
}