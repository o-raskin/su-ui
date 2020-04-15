
export interface IPatchChange {
    op: 'replace' | 'add' | 'move' | 'remove' | 'copy' | 'test';
    path: string;
    value: string;
}

export class PatchChange implements IPatchChange{
    op: 'replace' | 'add' | 'move' | 'remove' | 'copy' | 'test';
    path: string;
    value: string;

    constructor(op: 'replace' | 'add' | 'move' | 'remove' | 'copy' | 'test',
                path: string,
                value: string) {
        this.op = op;
        this.path = '/' + path;
        this.value = value;
    }
}