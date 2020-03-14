import Axios from "axios";
import {ISkill} from "@/models/Skill";

export abstract class SkillApi {

    private static axios = Axios.create();

    static async getAll(): Promise<ISkill[]>{

        const config = {
            headers: {
                accept: 'application/json'
            },
            data: {},
        };

        let response = await this.axios.get('http://localhost:8099/employee/skills', config);
        debugger
        return response.data;
    }

}