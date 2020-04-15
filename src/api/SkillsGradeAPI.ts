import {AxiosClient} from "@/api/AxiosClient";
import {AxiosPromise} from "axios";
import {ISimpleUser, IUser} from "@/models/User";
import {IPosition} from "@/models/Position";
import {IGrade} from "@/models/Grade";

export abstract class SkillsGradeAPI {

    public static getAll() : AxiosPromise<IGrade[]> {
        return AxiosClient.get<IGrade[]>("/skills/grades");
    }

}