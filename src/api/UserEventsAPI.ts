import {AxiosPromise} from "axios";
import {AxiosClient} from "@/api/AxiosClient";
import {IEvent} from "../models/Event";

export abstract class UserEventsAPI {

    public static prefix: string = '/planning/user-events'

    public static getUserEvents(userId: number): AxiosPromise<IEvent[]> {
        return AxiosClient.get<IEvent[]>(UserEventsAPI.prefix + '?userId=' + userId);
    }
}