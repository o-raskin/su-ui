import {ISkill} from "@/models/Skill";
import {AxiosClient} from "./AxiosClient";

export abstract class SkillApi {

    static async getAll(): Promise<ISkill[]>{
        let response = await AxiosClient.get('/skills/skills');
        return response.data;
    }

    static async getUserGrade(): Promise<ISkill[]>{
        let response = await AxiosClient.get('/skills/skills');
        return response.data;
    }

    static async updateSkill(skill: ISkill): Promise<ISkill>{
        debugger
        let response = await AxiosClient.put('/skills/skills/' + skill.id, skill);
        return response.data;
    }

}