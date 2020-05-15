import {AxiosClient} from "@/api/AxiosClient";
import {AxiosPromise} from "axios";
import {ISimpleUser, IUser} from "@/models/User";
import {IPosition} from "@/models/Position";
import {IGrade} from "@/models/Grade";
import {IGradeHistory} from "@/models/GradeHistory";
import {ISkillsUser} from "@/models/SkillsUser";

export abstract class SkillsGradeAPI {

    public static getAll() : AxiosPromise<IGrade[]> {
        return AxiosClient.get<IGrade[]>("/skills/grades");
    }

    public static getGradeById(gradeId: number) : AxiosPromise<IGrade> {
        return AxiosClient.get<IGrade>("/skills/grades/" + gradeId);
    }

    public static getPreviousUserGrades(user: IUser) : AxiosPromise<IGrade[]> {
        return AxiosClient.get<IGrade[]>("/skills/grades/user/" + user.id);
    }

    public static getGradeHistoryByUser(userId: number) : AxiosPromise<IGradeHistory[]> {
        return AxiosClient.get<IGradeHistory[]>('/skills/grades/history/' + userId);
    }

    public static raiseUserGrade(user: IUser) : AxiosPromise<ISkillsUser> {
        return AxiosClient.post<ISkillsUser>("/skills/users/" + user.id + '/grade');
    }
}