
export interface IEvent {
    id: number;
    userId: number;
    start: string;
    end: number;
    color: number;
}

export class Event implements IEvent {
    id!: number;
    userId!: number;
    start!: string;
    end!: number;
    color!: number;
}