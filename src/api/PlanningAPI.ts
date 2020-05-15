import {AxiosPromise} from "axios";
import {AxiosClient} from "@/api/AxiosClient";
import {IPromotion} from "@/models/Promotion";

export abstract class PlanningAPI {

    public static prefix: string = '/planning'

    public static getAllPromotionsByUserId(userId: number): AxiosPromise<IPromotion[]> {
        return AxiosClient.get<IPromotion[]>(PlanningAPI.prefix + '/promotions?userId=' + userId);
    }

    public static createPromotion(promotion: IPromotion): AxiosPromise<IPromotion> {
        return AxiosClient.post<IPromotion>(PlanningAPI.prefix + '/promotions', promotion);
    }

    public static updatePromotion(promotionId: number, promotion: IPromotion): AxiosPromise<IPromotion> {
        return AxiosClient.put<IPromotion>(PlanningAPI.prefix + '/promotions/' + promotionId, promotion);
    }

    public static deletePromotionById(promotionId: number) {
        AxiosClient.delete(PlanningAPI.prefix + '/promotions/' + promotionId);
    }
}