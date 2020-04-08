import {AxiosClient} from "./AxiosClient";
import {AxiosPromise} from "axios";
import {IProfile} from "@/models/Profile";

export abstract class ProfileAPI {

    public static getUserProfile(id: number): AxiosPromise<IProfile> {
        return AxiosClient.get<IProfile>('/profiles/' + id);
    }

    public static getAllActiveProfiles(): AxiosPromise<IProfile[]> {
        return AxiosClient.get<IProfile[]>('/profiles');
    }

    public static updateProfile(profile: IProfile): AxiosPromise<IProfile> {
        let jsonValue = JSON.stringify(profile);
        return AxiosClient.put<IProfile>('/profiles', jsonValue);
    }

}