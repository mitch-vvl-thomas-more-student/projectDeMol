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


    // stem(typeStem: TypeStem): void {
    //     if (typeStem === TypeStem.omhoog) {
    //         this.plaatser.aantalStemmenOmhoog += 1;
    //         this.stemmenOmhoog += 1;
    //     }
    //     else if (typeStem === TypeStem.omlaag) {
    //         this.plaatser.aantalStemmenOmlaag += 1;
    //         this.stemmenOmlaag += 1;
    //     }
    // }
}