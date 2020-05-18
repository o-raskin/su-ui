
export interface IEvent {
    id: number;
    name: string;
    start: string;
    end: number;
    color: number;
}

export class Event implements IEvent {
    id!: number;
    name!: string;
    start!: string;
    end!: number;
    color!: number;
}