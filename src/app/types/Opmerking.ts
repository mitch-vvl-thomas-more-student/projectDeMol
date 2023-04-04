import { TypeStem } from "../enums/typeStem";
import Gebruiker from "./Gebruiker";

export interface IFireStoreOpmerking {
    opmerking: Opmerking;
}

export interface IOpmerking {
    id?: string; 
    plaatser: Gebruiker;
    datum: Date;
    tekst: string;
}

export default class Opmerking implements IOpmerking {
    constructor() { }
    id?: string; 
    plaatser: Gebruiker;
    datum: Date;
    tekst: string;

}