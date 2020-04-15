import {ISkill} from "@/models/Skill";
import {AxiosClient} from "./AxiosClient";
import {AxiosPromise} from "axios";
import {PatchChange} from "@/models/payload/Patch";
import {ISkillsUser} from "@/models/SkillsUser";
import {IUserSkill} from "@/models/UserSkill";

export abstract class SkillsAPI {

    public static prefix: string = '/skills'

    static async getAll(): Promise<ISkill[]>{
        let response = await AxiosClient.get('/skills/skills');
        return response.data;
    }

    static async updateSkill(skill: ISkill): Promise<ISkill>{
        let response = await AxiosClient.put(SkillsAPI.prefix + '/skills/' + skill.id, skill);
        return response.data;
    }

    public static getUserSkill(userId: number, skillId: number ) : AxiosPromise<IUserSkill> {
        return AxiosClient.get<IUserSkill>(SkillsAPI.prefix + "/users/" + userId + '/skill/' + skillId)
    }

    public static getUserById(userId: number) : AxiosPromise<ISkillsUser> {
        return AxiosClient.get<ISkillsUser>(SkillsAPI.prefix + "/users/" + userId);
    }

    public static updateUserSkillsData(userId: number, fieldName: string, fieldValue: any) : AxiosPromise<ISkillsUser> {
        let change = new PatchChange('replace', fieldName, fieldValue);
        return AxiosClient.patch<ISkillsUser>(SkillsAPI.prefix + "/users/" + userId, [change]);
    }

}