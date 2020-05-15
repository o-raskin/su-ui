import {AxiosClient} from "@/api/AxiosClient";
import {AxiosPromise} from "axios";
import {ISimpleUser, IUser} from "@/models/User";
import {PatchChange} from "@/models/payload/Patch";
import {IGrade} from "@/models/Grade";

export abstract class  UserAPI {

    public static getAllUsers() : AxiosPromise<IUser[]> {
        return AxiosClient.get<IUser[]>("/users/");
    }

    public static async getCurrentUser() {

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
        if (userId === currentUserId) return Promise.reject('You cannot follow yourself!');
        return AxiosClient.post<ISimpleUser>("/users/" + userId + '/follow',
            {'followerId': currentUserId});
    }

    public static unfollowUser(userId: number, currentUserId: number) : AxiosPromise {
        if (userId === currentUserId) return Promise.reject('You cannot unfollow yourself!');
        return AxiosClient.post<ISimpleUser>("/users/" + userId + '/unfollow',
            {'followerId': currentUserId});
    }

    public static getUserSubordinates(id: number) : AxiosPromise<ISimpleUser[]> {
        return AxiosClient.get<ISimpleUser[]>("/users/" + id + "/subordinates");
    }

    public static update(user: IUser) : AxiosPromise<IUser> {
        return AxiosClient.put<IUser>("/users/" + user.id, user);
    }

    // deprecated
    public static updateField(userId: number, fieldName: string, fieldValue: any) : AxiosPromise<IUser> {

        let change = new PatchChange('replace', fieldName, fieldValue);
        return AxiosClient.patch<IUser>("/users/" + userId, [change]);
    }
}