
export interface IUser {
    id: number;
    name: string;
    email: string;
    imageUrl: string;
    provider: string;
    position: string;
    grade: string;
    mentorId: number;
    lastPromotionDate: Date;
    futurePromotionDate: Date;
    inCompanySince: Date;
}

export class User implements IUser {
    id!: number;
    name!: string;
    email!: string;
    imageUrl!: string;
    provider!: string;
    position!: string;
    grade!: string;
    mentorId!: number;
    lastPromotionDate!: Date;
    futurePromotionDate!: Date;
    inCompanySince!: Date;
}
