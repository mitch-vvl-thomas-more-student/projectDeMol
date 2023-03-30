import { TypeGroep } from '../enums/typeGroep';
import Gebruiker from "./Gebruiker";
import Hint from "./Hint";

export interface IFireStoreGroep{
    groep: Groep;
}

export interface IGroep{
    id: string; 
    naam: string;
    beschrijving: string;
    type: TypeGroep;
    eigenaar: Gebruiker[];
    leden: Gebruiker[];
    hints: Hint[];
}

export default class Groep implements IGroep {
    constructor() { }
    id: string; 
    naam: string;
    beschrijving: string;
    type: TypeGroep;
    eigenaar: Gebruiker[];
    leden: Gebruiker[];
    hints: Hint[];
}