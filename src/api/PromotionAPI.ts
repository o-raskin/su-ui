import {AxiosPromise} from "axios";
import {AxiosClient} from "@/api/AxiosClient";
import {IPromotion} from "@/models/Promotion";

export abstract class PromotionAPI {

    public static prefix: string = '/planning'

    public static getAllPromotionsByUserId(userId: number): AxiosPromise<IPromotion[]> {
        return AxiosClient.get<IPromotion[]>(PromotionAPI.prefix + '/promotions?userId=' + userId);
    }

    public static createPromotion(promotion: IPromotion): AxiosPromise<IPromotion> {
        return AxiosClient.post<IPromotion>(PromotionAPI.prefix + '/promotions', promotion);
    }

    public static updatePromotion(promotionId: number, promotion: IPromotion): AxiosPromise<IPromotion> {
        return AxiosClient.put<IPromotion>(PromotionAPI.prefix + '/promotions/' + promotionId, promotion);
    }

    public static deletePromotionById(promotionId: number) {
        AxiosClient.delete(PromotionAPI.prefix + '/promotions/' + promotionId);
    }

    public static setPromotionStatus(promotionId: number, status: string) {
        return AxiosClient.post<IPromotion>(PromotionAPI.prefix + '/promotions/' + promotionId + "?status=" + status);
    }
}