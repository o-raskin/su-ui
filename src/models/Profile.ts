import {IUser} from "@/models/User";

export interface IProfile {
    id?: number;
    userId: number;
    visibility: boolean;
    status: string;
    followersIds: number[];
    whitelist: IUser[];
}

export class Profile implements IProfile {
    followersIds!: number[];
    id!: number;
    status!: string;
    userId!: number;
    visibility!: boolean;
    whitelist!: IUser[];
}