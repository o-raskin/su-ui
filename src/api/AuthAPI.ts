import {AxiosClient} from "@/api/AxiosClient";

export abstract class AuthAPI {

    static async getCurrentUser() {

        if (!localStorage.getItem('ACCESS_TOKEN')) {
            return Promise.reject("No access token set.");
        }

        const config = {
            headers: {
                accept: 'application/json'
            },
            data: {},
            withCredentials: true
        };

        let response = await AxiosClient.get("/users/current", config)
        return response.data
    }

}