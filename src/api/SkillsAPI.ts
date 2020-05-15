import {ISkill} from "@/models/Skill";
import {AxiosClient} from "./AxiosClient";
import {AxiosPromise} from "axios";
import {PatchChange} from "@/models/payload/Patch";
import {ISkillsUser} from "@/models/SkillsUser";
import {IUserSkill} from "@/models/UserSkill";
import {IUserSuccessCriterion} from "@/models/UserSuccessCriteria";
import {IUser} from "@/models/User";

export abstract class SkillsAPI {

    public static prefix: string = '/skills'

    public static getAll(): AxiosPromise<ISkill[]> {
        return AxiosClient.get<ISkill[]>('/skills/skills');
    }

    public static updateSkill(skill: ISkill): AxiosPromise<ISkill> {
        return AxiosClient.put<ISkill>(SkillsAPI.prefix + '/skills/' + skill.id, skill);
    }

    public static getUserById(userId: number): AxiosPromise<ISkillsUser> {
        return AxiosClient.get<ISkillsUser>(SkillsAPI.prefix + "/users/" + userId);
    }

    public static updateSkillsUserData(user: ISkillsUser): AxiosPromise<ISkillsUser> {
        return AxiosClient.put<ISkillsUser>(SkillsAPI.prefix + "/users/" + user.id, user);
    }

    public static getSkillsUsersByIds(ids: number[]): AxiosPromise<ISkillsUser[]> {
        return AxiosClient.post<ISkillsUser[]>(SkillsAPI.prefix + "/users", ids);
    }

    public static getUserSkill(userId: number, skillId: number): AxiosPromise<IUserSkill> {
        return AxiosClient.get<IUserSkill>(SkillsAPI.prefix + "/users/" + userId + '/skills/' + skillId)
    }

    public static getUserSkills(user: IUser): AxiosPromise<IUserSkill[]> {
        return AxiosClient.get<IUserSkill[]>(SkillsAPI.prefix + "/users/" + user.id + '/skills');
    }

    public static updateUserSkill(userSkill: IUserSkill): AxiosPromise<IUserSkill> {
        return AxiosClient.put<IUserSkill>(SkillsAPI.prefix +
            "/users/" + userSkill.userId + '/skills/' + userSkill.skill.id, userSkill);
    }

    public static getUserSkillsForStats(userId: number): AxiosPromise<Map<number, Map<string, IUserSkill>>> {
        return AxiosClient.get<Map<number, Map<string, IUserSkill>>>(SkillsAPI.prefix + "/users/" + userId + '/skills/stats');
    }

    public static getLatestChangedUserSkill(userId: number): AxiosPromise<IUserSkill> {
        return AxiosClient.get<IUserSkill>(SkillsAPI.prefix + "/users/" + userId + '/skills/latest')
    }

}