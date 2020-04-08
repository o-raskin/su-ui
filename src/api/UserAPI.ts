import {AxiosClient} from "@/api/AxiosClient";
import {AxiosPromise} from "axios";
import {ISimpleUser, IUser} from "@/models/User";

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

    public static followUser(userId: number, currentUserId: number) : AxiosPromise<ISimpleUser> {
        if (userId === currentUserId) return Promise.reject('You cannot follow yourself');
        return AxiosClient.post<ISimpleUser>("/users/" + userId + '/follow',
            {'followerId': currentUserId});
    }

    public static unfollowUser(userId: number, currentUserId: number) : AxiosPromise {
        if (userId === currentUserId) return Promise.reject('You cannot follow yourself');
        return AxiosClient.post<ISimpleUser>("/users/" + userId + '/unfollow',
            {'followerId': currentUserId});
    }

    public static getUserSubordinates(id: number) : AxiosPromise<ISimpleUser[]> {
        return AxiosClient.get<ISimpleUser[]>("/users/" + id + "/subordinates");
    }
}