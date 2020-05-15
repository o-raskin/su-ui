import {ISuccessCriterion} from "@/models/Skill";
import {AxiosClient} from "@/api/AxiosClient";
import {AxiosPromise} from "axios";
import {IUserSuccessCriterion} from "@/models/UserSuccessCriteria";
import {SkillsAPI} from "@/api/SkillsAPI";


export abstract class SuccessCriterionAPI {

    public static update(val: any): AxiosPromise<ISuccessCriterion> {
        return AxiosClient.put<ISuccessCriterion>('/skills/sc/ '+ val.id, val);
    }

    public static getAllSuccessCriterionByUserAndSkill(userId: number, skillId: number) : AxiosPromise<IUserSuccessCriterion[]> {
        return AxiosClient.get<IUserSuccessCriterion[]>("/skills/users/" + userId + "/skills/" + skillId +
            '/sc');
    }

    public static updateUserSuccessCriterion(userSuccessCriterion: IUserSuccessCriterion) : AxiosPromise<IUserSuccessCriterion> {
        return AxiosClient.put<IUserSuccessCriterion>(SkillsAPI.prefix + "/users/" + userSuccessCriterion.userId +
            '/sc/' + userSuccessCriterion.successCriterionId, userSuccessCriterion);
    }
}