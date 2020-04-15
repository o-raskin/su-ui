
export interface IPosition {
    id: number;
    name: string;
}

export class Position implements IPosition {
    id!: number;
    name!: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}