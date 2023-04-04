import Opmerking from "./Opmerking";

export interface IFireStoreHint {
    hint: Hint;
}

export interface IHint {
    id?: string; 
    plaatser?: string;
    kandidaat: string;
    datum: Date;
    hint: string;
    stemmenOmhoog: number;
    stemmenOmlaag: number;
    opmerkingen: Opmerking[];
    gestemdDoor: string[];
}

export default class Hint implements IHint {
    constructor() { }
    id: string; 
    plaatser: string;
    kandidaat: string;
    datum: Date;
    hint: string;
    stemmenOmhoog: number;
    stemmenOmlaag: number;
    opmerkingen: Opmerking[];
    gestemdDoor: string[];

    addComment(comment: Opmerking): void {
        this.opmerkingen.push(comment);
    }

    deleteComment(comment: Opmerking): void {
        const index = this.opmerkingen.indexOf(comment);
        if (index !== -1) {
            this.opmerkingen.splice(index, 1);
        }
    }
}