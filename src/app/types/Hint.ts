import { Timestamp } from "firebase/firestore";
import Opmerking from "./Opmerking";

export interface IFireStoreHint {
    hint: Hint;
}

export interface IHint {
    id?: string; 
    plaatser?: string;
    kandidaat: string;
    datum: Timestamp | Date | string;
    hint: string;
    stemmenOmhoog: number;
    stemmenOmlaag: number;
    opmerkingen: Opmerking[];
    gestemdDoor: string[];
    isPubliek: boolean;
}

export default class Hint implements IHint {
    constructor() { }
    id: string; 
    plaatser: string;
    kandidaat: string;
    datum: Timestamp | Date | string;
    hint: string;
    stemmenOmhoog: number;
    stemmenOmlaag: number;
    opmerkingen: Opmerking[];
    gestemdDoor: string[];
    isPubliek: boolean;
    datumString: string;

    addComment(comment: Opmerking): void {
        this.opmerkingen.push(comment);
    }
    deleteComment(comment: Opmerking): void {
        const index = this.opmerkingen.indexOf(comment);
        if (index !== -1) {
            this.opmerkingen.splice(index, 1);
        }
    }
    addStemOmhoog(userId: string): void {
        this.stemmenOmhoog++;
        this.gestemdDoor.push(userId);
    }
    addStemOmlaag(userId: string): void {
        this.stemmenOmlaag++;
        this.gestemdDoor.push(userId);
    }
}