export interface ISkill {
    id?: number;
    name: string;
    description: string;
    status: string;
    start_date: Date;
    end_date: Date;
    parent: ISkill;
    children: ISkill[];
}

export class SkillDTO implements ISkill{
    description: string = '';
    end_date: Date = new Date();
    name: string = '';
    start_date: Date = new Date();
    status: string = '';
    parent: any;
    children: ISkill[] = [];
}