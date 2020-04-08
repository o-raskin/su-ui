
export interface IUserSuccessCriterion {

    successCriterionId?: number;
    userId?: number;
    finishDate: Date | string | null;
    achieved: boolean;
}

export class UserSuccessCriterion implements IUserSuccessCriterion{

    successCriterionId?: number;
    userId?: number;
    finishDate: Date | string | null;
    achieved: boolean;

    constructor(successCriterionId: number, userId: number, finishDate: Date | string | null, achieved: boolean) {
        this.successCriterionId = successCriterionId;
        this.userId = userId;
        this.finishDate = finishDate;
        this.achieved = achieved;
    }
}