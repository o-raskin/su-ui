import {ISuccessCriterion} from "@/models/Skill";
import Axios from "axios";


export abstract class SuccessCriterionAPI {

    private static axios = Axios.create();

    static async update(val: any): Promise<ISuccessCriterion> {

        let jsonValue = JSON.stringify(val);
        const config = {
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
            },
        };
        let id = val.id
        // debugger
        let response = await this.axios.put('http://localhost:8099/employee/sc/ '+ id, jsonValue, config);
        return response.data;
    }
}