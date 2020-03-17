import {ISkill} from "@/models/Skill";
import AxiosClient from "@/api/AxiosClient";

export abstract class SkillApi {

    static async getAll(): Promise<ISkill[]>{

        const config = {
            headers: {
                accept: 'application/json'
            },
            data: {},
        };

        let response = await AxiosClient.get('http://localhost:8099/employee/skills', config);
        return response.data;
    }

}