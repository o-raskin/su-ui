import {ISkill} from "@/models/Skill";
import {AxiosClient} from "./AxiosClient";

export abstract class SkillApi {

    static async getAll(): Promise<ISkill[]>{
        let response = await AxiosClient.get('/skills/skills');
        return response.data;
    }

}