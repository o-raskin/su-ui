
export interface IGrade {
    id: number;
    name: string;
    description: string;
    positionId: number;
}

export class Grade implements IGrade {
    id: number;
    name: string;
    description: string;
    positionId: number;

    constructor(id: number, name: string, description: string, positionId: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.positionId = positionId;
    }
}