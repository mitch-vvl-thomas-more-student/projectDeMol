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
    verdachten: string[];
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
    verdachten: string[];
}