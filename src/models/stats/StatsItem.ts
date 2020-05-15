
export interface IStatsItem {
    year: number;
    month: string;
    count: number;
}

export class StatsItem implements IStatsItem {
    year: number;
    month: string;
    count: number;

    constructor(year: number, month: string, count: number) {
        this.year = year;
        this.month = month;
        this.count = count;
    }
}