import Hint from "./Hint";

export interface IFireStoreKandidaat extends IKandidaat {}


export interface IKandidaat {
    id: string; 
    voornaam: string;
    achternaam: string;
    geboortePlaats: string;
    woonPlaats: string;
    leeftijd: number;
    beroep: string;
    extra: string;
    profielFoto: string;
    hints: string[];
}

export default class Kandidaat implements IKandidaat {
    constructor() { }
    id: string; 
    voornaam: string;
    achternaam: string;
    geboortePlaats: string;
    woonPlaats: string;
    leeftijd: number;
    beroep: string;
    extra: string;
    profielFoto: string;
    hints: string[];

    getVolledigeNaam(): string {
        return `${this.voornaam} ${this.achternaam}`;
    }
}