
export interface IPromotion {
    id: number;
    userId: number;
    originGradeId: number;
    nextGradeId: number;
    members: number[];
    startDate: Date | string;
    endDate: Date | string;
    status: string;
}

export class Promotion implements IPromotion {
    id!: number;
    userId!: number;
    originGradeId!: number;
    nextGradeId!: number;
    members!: number[];
    startDate!: Date | string;
    endDate!: Date | string;
    status!: string;
}