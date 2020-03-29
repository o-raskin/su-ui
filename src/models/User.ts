
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
}

export interface ISimpleUser {
    id: number;
    name: string;
    imageUrl: string;
}

export class SimpleUser implements ISimpleUser {
    id!: number;
    name!: string;
    imageUrl!: string;


    constructor(id: number, name: string, imageUrl: string) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
    }
}