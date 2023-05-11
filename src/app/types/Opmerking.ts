import Gebruiker from "./Gebruiker";
import { Timestamp } from "firebase/firestore";

export interface IFireStoreOpmerking {
    opmerking: Opmerking;
}

export interface IOpmerking {
    id?: string; 
    plaatser: Gebruiker;
    datum: Timestamp | Date | string;
    tekst: string;
}

export default class Opmerking implements IOpmerking  {
    constructor() { }
    id?: string; 
    plaatser: Gebruiker;
    datum: Timestamp | Date | string;
    tekst: string;
}