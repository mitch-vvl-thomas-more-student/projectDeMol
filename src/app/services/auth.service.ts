import Gebruiker from 'src/app/types/Gebruiker';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';
import { Auth, User, signInWithCredential, signOut, updateProfile } from '@angular/fire/auth';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  PhoneAuthProvider,
  UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  Unsubscribe
} from 'firebase/auth';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Router } from '@angular/router';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { ErrorService } from './error.service';
import { GlobalsService } from './globals.service';
import { LoginAttempt } from '../types/LoginAttempt';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import { IpAdress } from '../interfaces/ipAdress';
import { HttpClient } from '@angular/common/http';
import { platform } from 'os';

const actionCodeSettings = {
  url: 'https://www.example.com/?email=user@example.com',
  iOS: {
    bundleId: 'com.example.ios'
  },
  android: {
    packageName: 'com.example.android',
    installApp: true,
    minimumVersion: '12'
  },
  handleCodeInApp: true
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private verificationId: string = '';
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private authStateChangeSubscription: Unsubscribe | undefined;
  currentUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);


  constructor(
    private errorService: ErrorService,
    private auth: Auth,
    private router: Router,
    private fireStore: BackendApiService,
    private globalService: GlobalsService,
    private apiService: BackendApiService,
    private http: HttpClient
  ) {
    this.authStateChangeSubscription = this.auth.onAuthStateChanged((user: User | null) => {
      if (user !== null) {
        this.setCurrentUser(user);
        this.updateLoggedInState(true);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authStateChangeSubscription) {
      this.authStateChangeSubscription();
    }
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

    await this.logLoginAttempt(this.getEmail() || '', credential?.idToken != undefined, 'google'); // Log the login attempt with the 'google' method

    if (!credential) {
      return
    }


    // Sign in on the web layer.
    if (Capacitor.isNativePlatform() && credential?.idToken) {
      const newCredential = GoogleAuthProvider.credential(credential?.idToken);
      await signInWithCredential(this.auth, newCredential);
    }
  }

  async signInWithFacebook(): Promise<void> {
    const result = await FirebaseAuthentication.signInWithFacebook()
    const { credential } = result;

    await this.logLoginAttempt(this.getEmail() || '', credential != undefined, 'Facebook'); // Log the login attempt with the 'google' method

    if (!credential) {
      return;
    }

    if (Capacitor.isNativePlatform()) {
      const { accessToken } = credential;
      if (accessToken) {
        const authCredential = FacebookAuthProvider.credential(accessToken);
        await signInWithCredential(this.auth, authCredential);
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

  async sendEmailVerification(): Promise<void> {
    try {
      await FirebaseAuthentication.sendEmailVerification();
      this.errorService.showAlert('Verzonden', 'Er is een e-mail verzonden naar ' + this.getEmail() + ' om je account te verifiëren.');
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
            userCredentials.user.emailVerified !== true ? this.sendEmailVerification() : null;
            await this.updateUserProfile(displayName, geboortedatum);
            await this.logLoginAttempt(email, true);
          }
        } catch (err) {
          this.errorMessages(err);
        }
      } else {
        const existingUser = res[0];
        try {
          const signinResult: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
          if (signinResult) {
            await this.logLoginAttempt(existingUser.email, true);
            await this.globalService.setGebruiker(existingUser);
          } else {
            await this.logLoginAttempt(existingUser.email, false);
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
            await this.logLoginAttempt(existingUser.email, true);
            await this.globalService.setGebruiker(existingUser);
          } else {
            await this.logLoginAttempt(email, false);
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
        geboortedatum: geboortedatum,
      };
      try {
        await updateProfile(user, profile);
        await this.setCurrentUser(user);
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
              await this.globalService.setGebruiker(gebruiker);
              await this.globalService.navigate(['tabs', 'kandidaten']);
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          if (res[0] !== await this.globalService.getGebruiker()) {
            await this.globalService.setGebruiker(res[0]);
          }
        }
      } catch (error: any) {
        if (user.email)
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
  async logLoginAttempt(email: string, success: boolean = false, method: string = 'email/wachtwoord') {
    if (email) {
      const [gebruiker] = await firstValueFrom(this.fireStore.retrieveGebruikerByEmail(email).pipe(take(1)));

      const attempt: LoginAttempt = {
        userId: gebruiker?.id,
        IPv4: '',
        datetime: new Date(),
        location: {
          latitude: '',
          longitude: '',
        },
        system: {
          model: '',
          platform: '',
          osVersion: '',
          isNative: false,
        },
        method,
        success
      }



      try {
        attempt.IPv4 = await this.getIpAdress();
      } catch (error) {
        console.log(error);
      }


      try {
        const info = await Device.getInfo();

        const systemInfo = {
          model: info.model,
          platform: info.platform,
          osVersion: info.osVersion,
          isNative: (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        };
        attempt.system = systemInfo;
      } catch (error) {
        console.error('Error getting device info:', error);
      }

      try {
        let position = undefined;
        let permissionResult = undefined;

        permissionResult = await Geolocation.checkPermissions();
        attempt.system.platform !== 'web' || permissionResult.location !== 'granted' ? permissionResult = await Geolocation.requestPermissions() :permissionResult = { location: 'granted' };

        if (permissionResult.location === 'granted') {
          position = await Geolocation.getCurrentPosition();
          const { latitude, longitude } = position.coords;
          attempt.location.latitude = latitude.toString();
          attempt.location.longitude = longitude.toString();
        }
      } catch (error) {
        console.error('Error getting geolocation:', error);
      }

      await this.fireStore.addAttemp(attempt);
    }
  }

  async getIpAdress(): Promise<string> {
    const url = "https://geolocation-db.com/json/";
    const response = await firstValueFrom(this.http.get<IpAdress>(url));
    return response.IPv4;
  }
}
