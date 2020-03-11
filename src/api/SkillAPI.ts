import Axios from "axios";
import {SkillDTO} from "@/models/Skill";

export abstract class SkillApi {

    private static axios = Axios.create();

    static async getAllSkills(): Promise<SkillDTO[]>{

        const config = {
            headers: {
                accept: 'application/json'
            },
            data: {},
        };

        let response = await this.axios.get('http://localhost:8099/employee/skills', config);
        return response.data;
    }
}