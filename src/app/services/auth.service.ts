import Gebruiker, { IFireStoreGebruiker } from 'src/app/types/Gebruiker';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { switchMap, take, catchError } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';
import { Auth, User, signInWithCredential, signOut, updateProfile } from '@angular/fire/auth';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  PhoneAuthProvider,
  UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Router } from '@angular/router';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { ErrorService } from './error.service';
import { GlobalsService } from './globals.service';
import { LoginAttempt } from '../types/LoginAttempt';
import { DocumentReference } from 'firebase/firestore';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private verificationId: string = '';
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private errorService: ErrorService,
    private auth: Auth,
    private router: Router,
    private fireStore: BackendApiService,
    private globalService: GlobalsService,
    private apiService: BackendApiService
  ) {
    this.auth.onAuthStateChanged((user: User | null) => {
      if (user !== null) {
        this.setCurrentUser(user);
        this.updateLoggedInState(true);
      }
    });
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  // Update the logged-in state whenever necessary
  // For example, after a successful login or logout
  updateLoggedInState(isLoggedIn: boolean): void {
    this.isLoggedInSubject.next(isLoggedIn);
  }

  getProfilePic(): string {
    const placeholder = '/assets/Portrait_Placeholder.png';
    return this.isLoggedIn() ? this.currentUser?.value?.photoURL ?? placeholder : placeholder;
  }

  getDisplayName(): string | null | undefined {

    return this.isLoggedIn() ? this.currentUser?.value?.displayName : undefined;
  }

  getEmail(): string | null | undefined {
    return this.isLoggedIn() ? this.currentUser?.value?.email : undefined;
  }

  getUserUID(): string | null | undefined {
    return this.isLoggedIn() ? this.currentUser?.value?.uid : undefined;
  }

  async updateDisplayName(displayName: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      await updateProfile(currentUser, { displayName });
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();

      if (Capacitor.isNativePlatform()) {
        await signOut(this.auth);
      }
      this.updateLoggedInState(false);
      await this.globalService.navigate(['login']);
    } catch (error) {
      console.error(error);
    }
  }

  async signInWithGoogle(): Promise<void> {
    // Sign in on the native layer.
    const { credential } = await FirebaseAuthentication.signInWithGoogle();

    // Sign in on the web layer.
    if (Capacitor.isNativePlatform() && credential?.idToken) {
      const newCredential = GoogleAuthProvider
        .credential(credential?.idToken);
      await signInWithCredential(this.auth, newCredential);
    }
  }

  async signInWithFacebook(): Promise<void> {
    const result = await FirebaseAuthentication.signInWithFacebook()
    const { credential } = result;

    if (!credential) {
      return;
    }

    if (Capacitor.isNativePlatform()) {
      const { accessToken } = credential;
      if (accessToken) {
        const authCredential = FacebookAuthProvider.credential(accessToken);
        await signInWithCredential(this.auth, authCredential)
      }
    }
  }

  async signInWithPhoneNumber(verificationCode: string): Promise<void> {
    const credential = PhoneAuthProvider.credential(this.verificationId, verificationCode);
    await signInWithCredential(this.auth, credential);
  }

  async sendPhoneVerificationCode(phoneNumber: string): Promise<void> {
    const result = await FirebaseAuthentication.signInWithPhoneNumber({ phoneNumber });
    const verificationId = result.verificationId;

    if (typeof verificationId === 'undefined') {
      return;
    }

    this.verificationId = verificationId;
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await FirebaseAuthentication.sendPasswordResetEmail({ email });
      this.errorService.showAlert('Verzonden', 'Er is een e-mail verzonden naar ' + email + ' om je wachtwoord te resetten.');
      setTimeout(() => {
        this.router.navigate(['login']);
      }, 5000);
    } catch (error) {
      console.error(error);
    }
  }

  async registreerGebruikerMetEmail(email: string, password: string, voornaam: string, achternaam: string, geboortedatum?: string): Promise<void> {
    if (email && voornaam && achternaam) {
      const res = await firstValueFrom(this.fireStore.retrieveGebruikerByEmail(email).pipe(take(1)));

      if (res.length === 0) {
        try {
          const displayName = `${voornaam} ${achternaam}`; // Construct the display name using the provided voornaam and achternaam.
          const userCredentials = await createUserWithEmailAndPassword(this.auth, email, password);
          if (userCredentials) {
            await this.updateUserProfile(displayName, geboortedatum); // Call a new method to update the user profile.
          }
        } catch (err) {
          this.errorMessages(err);
        }
      } else {
        const existingUser = res[0];
        try {
          const signinResult: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
          if (signinResult) {
            this.logLoginAttempt(existingUser.email, true);
            await this.globalService.setGebruiker(existingUser);
          } else {
            this.errorMessages('Fout paswoord');
          }
        } catch (error) {
          this.errorMessages(error);
        }
      }
    }
  }

  async aanmeldenMetEmail(email: string, password: string) {
    if (email && password) {
      const res = await firstValueFrom(this.fireStore.retrieveGebruikerByEmail(email).pipe(take(1)));
      if (res.length === 0) {
        this.errorMessages('Geen gebruiker gevonden');
      }
      else {
        const existingUser = res[0];
        try {
          const signinResult: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
          if (signinResult) {
            this.logLoginAttempt(existingUser.email, true);
            await this.globalService.setGebruiker(existingUser);
          } else {
            this.logLoginAttempt(email, false);
            this.errorMessages('Fout paswoord');
          }
        }
        catch (error) {
          this.errorMessages(error);
        }
      }
    }
  }

  private async updateUserProfile(displayName: string, geboortedatum?: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      const profile = {
        displayName: displayName,
        // You can include additional profile fields as needed.
        // For example, if you have a field called 'geboortedatum' in the user model, you can set it like this:
        // geboortedatum: geboortedatum,
      };

      try {
        await updateProfile(user, profile);
        await this.setCurrentUser(user); // Call the setCurrentUser method to update the current user information.
      } catch (error) {
        console.log(error);
      }
    }
  }

  private async setCurrentUser(user: User | null): Promise<void> {
    this.currentUser.next(user);
    const isAuthenticated = user !== null;
    const currentUrl = this.router.url;

    if (isAuthenticated) {
      const voornaam = user?.displayName?.split(' ')[0] || ''; // Extract the voornaam from the display name.
      const achternaam = user?.displayName?.split(' ').slice(1).join(' ') || ''; // Extract the achternaam from the display name.

      if (!voornaam || !achternaam) {
        // If voornaam or achternaam is missing, redirect the user to the registration page.
        await this.globalService.navigate(['registration']);
      } else {
        await this.registerCurrentUserAsGebruiker(user);
        await this.globalService.navigate(['tabs', 'kandidaten']);
      }
    } else if (!isAuthenticated && currentUrl !== '/login') {
      await this.globalService.navigate(['login']);
    }
  }

  private async registerCurrentUserAsGebruiker(user: User | null): Promise<void> {
    if (user) {
      try {
        const res = await firstValueFrom(this.fireStore.retrieveGebruikerByEmail(user.email as string).pipe(take(1)));

        if (res.length === 0) {
          const parts = (user.displayName || '').split(' ');
          const gebruiker = new Gebruiker();
          gebruiker.email = user.email || '';
          gebruiker.voornaam = parts[0] || '';
          gebruiker.achternaam = parts.slice(1).join(' ');
          gebruiker.verdachten = [];
          gebruiker.aantalStemmenOmhoog = 0;
          gebruiker.aantalStemmenOmlaag = 0;

          const kandidaten = await firstValueFrom(this.apiService.retrieveKandidaats().pipe(take(1)));

          kandidaten.forEach((kandidaat) => gebruiker.verdachten?.push(kandidaat.id));

          try {
            const addedUser = await this.fireStore.addGebruiker(gebruiker);
            if (addedUser) {
              await this.logLoginAttempt(gebruiker.email, true);
              await this.globalService.setGebruiker(gebruiker);
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          if (res[0] !== await this.globalService.getGebruiker()){
            await this.logLoginAttempt(res[0].email, true);
            await this.globalService.setGebruiker(res[0]);
          }      
        }
      } catch (error: any) {
        if (user.email)
          await this.logLoginAttempt(user.email, false);
        this.errorService.showAlert('Fout', error.message);
        throw error;
      }
    }
  }

  private errorMessages(err: unknown) {
    if (err instanceof Error) {
      const error = err as Error;
      this.errorService.showAlert('Fout', error.message);
    } else {
      this.errorService.showAlert('Fout', 'Onbekende fout');
    }
  }

  // log user login attemps to firestore, keep the users geolocation with capacitor & the users device info with capacitor
  async logLoginAttempt(email: string, succes: boolean = false) {
    if (email) {
      const [gebruiker] = await firstValueFrom(this.fireStore.retrieveGebruikerByEmail(email).pipe(take(1)));

      const attempt: LoginAttempt = {
        userId: gebruiker?.id,
        datetime: new Date(),
        location: {
          latitude: '',
          longitude: '',
        },
        system: {
          model: '',
          platform: '',
          osVersion: ''
        },
        succes
      }

      try {
        const position = await Geolocation.getCurrentPosition();
        const { latitude, longitude } = position.coords;
        attempt.location.latitude = latitude.toString();
        attempt.location.longitude = longitude.toString();
      } catch (error) {
        console.error('Error getting geolocation:', error);
      }


      try {
        const info = await Device.getInfo();
        const systemInfo = {
          model: info.model,
          platform: info.platform,
          osVersion: info.osVersion
        };
        attempt.system = systemInfo;
      } catch (error) {
        console.error('Error getting device info:', error);
      }

      await this.fireStore.addAttemp(attempt);
    }
  }
}
