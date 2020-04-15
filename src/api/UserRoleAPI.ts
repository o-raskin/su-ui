import {AxiosClient} from "@/api/AxiosClient";
import {AxiosPromise} from "axios";
import {ISimpleUser, IUser} from "@/models/User";
import {IPosition} from "@/models/Position";

export abstract class UserRoleAPI {

    public static getAll() : AxiosPromise<string[]> {
        return AxiosClient.get<string[]>("/roles");
    }

}