import {IPosition} from "@/models/Position";

export interface IUser {
    id: number;
    name: string;
    email: string;
    imageUrl: string;
    provider: string;
    position: IPosition;
    grade: string;
    role: string;
    mentor: ISimpleUser;
    lastPromotionDate: Date;
    futurePromotionDate: Date;
    inCompanySince: Date;
    followers: ISimpleUser[];
    followings: ISimpleUser[];
    gradeProgress: number;
    active:boolean;
}

export class User implements IUser {
    id!: number;
    name!: string;
    email!: string;
    imageUrl!: string;
    provider!: string;
    position!: IPosition;
    grade!: string;
    role!: string;
    mentor!: ISimpleUser;
    lastPromotionDate!: Date;
    futurePromotionDate!: Date;
    inCompanySince!: Date;
    followers!: ISimpleUser[];
    followings!: ISimpleUser[];
    gradeProgress!: number;
    active!:boolean;
}

export interface ISimpleUser {
    id: number;
    name: string;
    imageUrl: string;
    position: IPosition;
    gradeProgress: number;
}

export class SimpleUser implements ISimpleUser {
    id!: number;
    name!: string;
    imageUrl!: string;
    position!: IPosition;
    gradeProgress!: number;

    constructor(id: number, name: string, imageUrl: string, position: IPosition) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.position = position;
    }
}