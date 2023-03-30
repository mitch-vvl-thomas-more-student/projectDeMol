import { TypeStem } from "../enums/typeStem";
import Gebruiker from "./Gebruiker";

export interface IFireStoreOpmerking {
    opmerking: Opmerking;
}

export interface IOpmerking {
    id: string; 
    stemmenOmhoog: number;
    stemmenOmlaag: number;
    plaatser: Gebruiker;
    datum: Date;
}

export default class Opmerking implements IOpmerking {
    constructor() { }
    id: string; 
    stemmenOmhoog: number;
    stemmenOmlaag: number;
    plaatser: Gebruiker;
    datum: Date;

    stem(typeStem: TypeStem): void {
        if (typeStem === TypeStem.omhoog) {
            this.plaatser.aantalStemmenOmhoog += 1;
            this.stemmenOmhoog += 1;
        }
        else if (typeStem === TypeStem.omlaag) {
            this.plaatser.aantalStemmenOmlaag += 1;
            this.stemmenOmlaag += 1;
        }
    }

}