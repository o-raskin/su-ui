import {AxiosClient} from "@/api/AxiosClient";
import {AxiosPromise} from "axios";
import {IUser} from "@/models/User";

export abstract class UserAPI {

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

    public static getUserById(id: number) : AxiosPromise<IUser> {
        return AxiosClient.get<IUser>("/users/" + id);
    }

}