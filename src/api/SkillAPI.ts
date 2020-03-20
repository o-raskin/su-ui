import {ISkill} from "@/models/Skill";
import {AxiosClient} from "./AxiosClient";

export abstract class SkillApi {

    static async getAll(): Promise<ISkill[]>{

        const config = {
            headers: {
                accept: 'application/json',
                'Cache-Control': 'no-cache'
            },
            data: {}
        };

        let response = await AxiosClient.get('/employee/skills', config);
        return response.data;
    }

}