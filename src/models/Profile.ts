import {ISimpleUser} from "@/models/User";

export interface IProfile {
    id?: number;
    user: ISimpleUser;
    visibility: boolean;
    status: string;
    whitelist: ISimpleUser[];
}

export class Profile implements IProfile {
    id!: number;
    status!: string;
    user!: ISimpleUser;
    visibility!: boolean;
    whitelist!: ISimpleUser[];
}