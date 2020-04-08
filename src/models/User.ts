
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
    followers: ISimpleUser[];
    followings: ISimpleUser[];
    gradeProgress: number;
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
    followers!: ISimpleUser[];
    followings!: ISimpleUser[];
    gradeProgress!: number;
}

export interface ISimpleUser {
    id: number;
    name: string;
    imageUrl: string;
    position: string;
    gradeProgress: number;
}

export class SimpleUser implements ISimpleUser {
    id!: number;
    name!: string;
    imageUrl!: string;
    position!: string;
    gradeProgress!: number;

    constructor(id: number, name: string, imageUrl: string, position: string) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.position = position;
    }
}