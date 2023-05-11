import { Observable, of } from "rxjs";

export interface IFireStoreGebruiker {
    gebruiker: IGebruiker;
}

export interface IGebruiker {
    id: string;
    avatar: string;
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
    avatar: string;
    voornaam: string;
    achternaam: string;
    email: string;
    geboortedatum: Date | undefined;
    geplaatsteHints: string[];
    groepen: string[];
    aantalStemmenOmhoog: number;
    aantalStemmenOmlaag: number;
    verdachten: string[];

    // getProfileImageUrl(): Observable<string | null> {
    //     return of(this.avatar);
    // }

    // getFullName(): string {
    //     return `${this.voornaam} ${this.achternaam}`;
    // }

}
