import {ISimpleUser, IUser} from "@/models/User";

export interface IProfile {
    id?: number;
    userId: number;
    visibility: boolean;
    status: string;
    whitelist: ISimpleUser[];
}

export class Profile implements IProfile {
    id!: number;
    status!: string;
    userId!: number;
    visibility!: boolean;
    whitelist!: ISimpleUser[];
}