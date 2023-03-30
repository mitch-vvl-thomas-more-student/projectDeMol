import Groep from "./Groep";
import Hint from "./Hint";
import Kandidaat from "./Kandidaat";


export interface IFireStoreGebruiker {
    gebruiker: Gebruiker;
}

export interface IGebruiker {
    id: string; 
    voornaam: string;
    achternaam: string;
    email: string;
    geboortedatum: Date | undefined;
    geplaatsteHints: string[];
    groepen: string[];
    aantalStemmenOmhoog: number;
    aantalStemmenOmlaag: number;
    verdachten: Kandidaat[];
}

export default class Gebruiker implements IGebruiker {
    constructor() { }
    id: string; 
    voornaam: string;
    achternaam: string;
    email: string;
    geboortedatum: Date | undefined;
    geplaatsteHints: string[];
    groepen: string[];
    aantalStemmenOmhoog: number;
    aantalStemmenOmlaag: number;
    verdachten: Kandidaat[];
}