import {AxiosClient} from "@/api/AxiosClient";
import {AxiosPromise} from "axios";
import {ISimpleUser, IUser} from "@/models/User";
import {IPosition} from "@/models/Position";

export abstract class UserPositionAPI {

    public static getAll() : AxiosPromise<IPosition[]> {
        return AxiosClient.get<IPosition[]>("/positions");
    }

}