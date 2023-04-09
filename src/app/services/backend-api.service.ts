import { Collections } from './../enums/collections';
import { Injectable } from '@angular/core';
import {
  collection,
  CollectionReference,
  DocumentReference,
  Firestore,
  addDoc,
  collectionData,
  query,
  updateDoc,
  deleteDoc,
  where,
  DocumentData,
} from "@angular/fire/firestore";
import { Observable } from 'rxjs';
import Gebruiker, { IFireStoreGebruiker } from '../types/Gebruiker';
import Opmerking, { IFireStoreOpmerking } from '../types/Opmerking';
import { AuthService } from './auth.service';
import Groep, { IFireStoreGroep } from '../types/Groep';
import Hint, { IFireStoreHint } from '../types/Hint';
import Kandidaat, { IFireStoreKandidaat } from '../types/Kandidaat';

import { doc, getFirestore, DocumentSnapshot, getDoc } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  constructor(private fireStore: Firestore) { }

  #getCollectionRef<T>(collectionName: string): CollectionReference<T> {
    return collection(this.fireStore, collectionName) as CollectionReference<T>;
  }
  #getDocumentRef<T>(collectionName: string, id: string): DocumentReference<T> {
    return doc(this.fireStore, `${collectionName}/${id}`) as DocumentReference<T>;
  }


  // Opmerkingen
  async addOpmerking(opmerking: Opmerking): Promise<DocumentReference<IFireStoreOpmerking>> {
    return await addDoc<IFireStoreOpmerking>(
      this.#getCollectionRef<IFireStoreOpmerking>(Collections.opmerkingen),
      { opmerking }
    );
  }

  async updateOpmerking(opmerking: Opmerking): Promise<void> {
    if (opmerking.id !== undefined){
      const opmerkingDocRef = this.#getDocumentRef<IFireStoreOpmerking>(Collections.opmerkingen, opmerking.id);
      const opmerkingData = this.#parseOpmerkingData(opmerking);
      await updateDoc(opmerkingDocRef, opmerkingData);
    }
  }

  retrieve(): Observable<Opmerking[]> {
    return collectionData<Opmerking>(this.#getCollectionRef(Collections.opmerkingen), { idField: 'id' });
  }

  #parseOpmerkingData(opmerking: Opmerking): any {
    const { plaatser, ...opmerkingData } = opmerking;
    return {
      ...opmerkingData,
      plaatser: { ...plaatser },
      datum: new Date(),
    };
  }


  // Gebruikers
  async addGebruiker(gebruiker: Gebruiker): Promise<DocumentReference<IFireStoreGebruiker>> {
    const fireStoreGebruiker: IFireStoreGebruiker = { ...this.#parseGebruikerData(gebruiker) };
    return await addDoc<IFireStoreGebruiker>(
      this.#getCollectionRef<IFireStoreGebruiker>(Collections.gebruikers),
      fireStoreGebruiker
    );
  }

  async updateGebruiker(gebruiker: Gebruiker): Promise<void> {
    try {
      const gebruikerDocRef = this.#getDocumentRef<IFireStoreGebruiker>(Collections.gebruikers, gebruiker.id);
      const gebruikerData = this.#parseGebruikerData(gebruiker);
      await updateDoc(gebruikerDocRef, gebruikerData);
    } catch (err) {
      console.log(err)
    }
  }

  retrieveGebruikers(): Observable<Gebruiker[]> {
    return collectionData<Gebruiker>(this.#getCollectionRef(Collections.gebruikers), { idField: 'id' });
  }

  retrieveGebruikerByEmail(email: string): Observable<Gebruiker[]> {
    return collectionData<Gebruiker>(
      query<Gebruiker>(
        this.#getCollectionRef(Collections.gebruikers), where('email', '==', email)
      )
      , { idField: 'id' });
  }

  #parseGebruikerData(gebruiker: Gebruiker): any {
    const { geplaatsteHints, groepen, verdachten, ...gebruikerData } = gebruiker;
    return {
      ...gebruikerData,
      geplaatsteHints: geplaatsteHints ? JSON.parse(JSON.stringify(geplaatsteHints)) : JSON.parse(JSON.stringify([])),
      groepen: groepen ? JSON.parse(JSON.stringify(groepen)) : JSON.parse(JSON.stringify([])),
      verdachten: verdachten ? JSON.parse(JSON.stringify(verdachten)) : JSON.parse(JSON.stringify([])),
    };
  }

  // Groepen
  async addGroep(groep: Groep): Promise<DocumentReference<IFireStoreGroep>> {
    const fireStoreGroep: any = { ...this.#parseGroepData(groep) };

    return await addDoc<IFireStoreGroep>(
      this.#getCollectionRef<IFireStoreGroep>(Collections.groepen),
      fireStoreGroep
    );
  }

  async updateGroep(groep: Groep): Promise<void> {
    const groepDocRef = this.#getDocumentRef<IFireStoreGroep>(Collections.groepen, groep.id);
    const groepData = this.#parseGroepData(groep);
    await updateDoc(groepDocRef, groepData);
  }

  retrieveGroeps(): Observable<Groep[]> {
    return collectionData<Groep>(this.#getCollectionRef(Collections.groepen), { idField: 'id' });
  }

  #parseGroepData(groep: Groep): any {
    const {
      eigenaar,
      leden,
      hints, ...groepData } = groep;
    return {
      ...groepData,
      eigenaar: JSON.parse(JSON.stringify(eigenaar)),
      leden: JSON.parse(JSON.stringify(leden)),
      hints: JSON.parse(JSON.stringify(hints)),
    };
  }

  // Hints
  async addHint(hint: Hint): Promise<string> {
    try {
      const fireStoreHint: any = { ...this.#parseHintData(hint) };
      const docRef = await addDoc<IFireStoreHint>(
        this.#getCollectionRef<IFireStoreHint>(Collections.hints),
        fireStoreHint
      );
      return docRef.id;
    } catch (err) {
      return '';
    }

  }


  async updateHint(hint: Hint): Promise<void> {
    try {
      const hintDocRef = this.#getDocumentRef<IFireStoreHint>(Collections.hints, hint.id);
      const hintData = this.#parseHintData(hint);
      await updateDoc(hintDocRef, hintData);
    } catch (err) {
      console.log(err);
    }

  }

  retrieveHints(): Observable<Hint[]> {
    return collectionData<Hint>(this.#getCollectionRef(Collections.hints), { idField: 'id' });
  }

  retrieveHintById(id: string): Observable<Hint[]> {
    return collectionData<Hint>(
      query<Hint>(
        this.#getCollectionRef(Collections.hints), where('id', '==', id)
      )
      , { idField: 'id' });
  }

  retrieveHintByKandidaatId(id: string): Observable<Hint[]> {
    return collectionData<Hint>(
      query<Hint>(
        this.#getCollectionRef(Collections.hints), where('kandidaat', '==', id)
      )
      , { idField: 'id' });
  }

  #parseHintData(hint: Hint): any {
    const { opmerkingen, ...hintData } = hint;
    return {
      ...hintData,
      opmerkingen: JSON.parse(JSON.stringify(opmerkingen))
    };
  }

  // Kandidaten
  async addKandidaat(kandidaat: Kandidaat): Promise<DocumentReference<IFireStoreKandidaat>> {
    const x = this.#parseKandidaatData(kandidaat)
    return await addDoc<IFireStoreKandidaat>(
      this.#getCollectionRef<IFireStoreKandidaat>('kandidaten'),
      x
    );
  }

  async updateKandidaat(kandidaat: Kandidaat): Promise<void> {
    const kandidaatDocRef = this.#getDocumentRef<IFireStoreKandidaat>(Collections.kandidaten, kandidaat.id);
    const kandidaatData = this.#parseKandidaatData(kandidaat);
    await updateDoc(kandidaatDocRef, kandidaatData);
  }

  retrieveKandidaats(): Observable<Kandidaat[]> {
    return collectionData<Kandidaat>(this.#getCollectionRef(Collections.kandidaten), { idField: 'id' });
  }

  retrieveKandidaatById(id: string): Observable<Kandidaat[]> {
    return collectionData<Kandidaat>(
      query<Kandidaat>(
        this.#getCollectionRef(Collections.kandidaten), where('id', '==', id)
      )
      , { idField: 'id' });
  }

  // async getKandidaatById(id: string): Promise<DocumentSnapshot<DocumentData>> {
  //   const kandidaatDoc = doc(this.fireStore, `kandidaten/${id}`);
  //   const docSnapshot = await getDoc(kandidaatDoc);
  //   return docSnapshot;
  // }


  async getKandidaatById(id: string): Promise<Kandidaat | null> {
    return getDoc(doc(this.fireStore, `kandidaten/${id}`)).then((doc: DocumentSnapshot<DocumentData>) => {
      if (doc.exists()) {
        const data = doc.data() as IFireStoreKandidaat;
        const kandidaat = new Kandidaat();
        kandidaat.id = id;
        kandidaat.voornaam = data.voornaam;
        kandidaat.achternaam = data.achternaam;
        kandidaat.geboortePlaats = data.geboortePlaats;
        kandidaat.woonPlaats = data.woonPlaats;
        kandidaat.leeftijd = data.leeftijd;
        kandidaat.beroep = data.beroep;
        kandidaat.extra = data.extra;
        kandidaat.profielFoto = data.profielFoto;
        kandidaat.hints = data.hints || [];
        return kandidaat;
      } else {
        return null;
      }
    }).catch((error) => {
      console.log('Error getting document:', error);
      throw error;
    });
  }


  #parseKandidaatData(kandidaat: Kandidaat): any {
    const {
      hints, ...kandidaatData } = kandidaat;
    return {
      ...kandidaatData,
      hints: JSON.parse(JSON.stringify(hints))
    };
  }

  async delete(id: string, collection: Collections): Promise<void> {
    const docRef = this.#getDocumentRef(collection, id);
    await deleteDoc(docRef);
  }

  async getDocByRef<T>(ref: string, collection: Collections): Promise<T | undefined> {
    const docRef = doc(this.fireStore, collection, ref);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data() as T;
    } else {
      console.log("No such document!");
      return undefined;
    }
  }

}
