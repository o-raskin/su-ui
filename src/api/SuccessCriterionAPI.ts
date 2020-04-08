import {ISuccessCriterion} from "@/models/Skill";
import {AxiosClient} from "@/api/AxiosClient";


export abstract class SuccessCriterionAPI {

    static async update(val: any): Promise<ISuccessCriterion> {

        let jsonValue = JSON.stringify(val);
        const config = {
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
            },
        };
        let id = val.id;
        let response = await AxiosClient.put('/skills/sc/ '+ id, jsonValue, config);
        return response.data;
    }
}