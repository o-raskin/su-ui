import {IGrade} from "@/models/Grade";

export interface IGradeHistory {
    grade: IGrade;
    userId: number;
    achievedDate: Date;
}

export class GradeHistory implements IGradeHistory {
    grade!: IGrade;
    userId!: number;
    achievedDate!: Date;
}