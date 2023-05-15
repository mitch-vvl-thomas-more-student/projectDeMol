import { GlobalsService } from './globals.service';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { Injectable } from '@angular/core';
import { FirebaseAuthentication, User as CUser } from '@capacitor-firebase/authentication';
import { Router } from '@angular/router';
import { signInWithCredential, signOut, Unsubscribe, Auth } from '@angular/fire/auth';
import { updateProfile, GoogleAuthProvider, PhoneAuthProvider, FacebookAuthProvider, User } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject, catchError, switchMap, take } from 'rxjs';
import Gebruiker, { IFireStoreGebruiker } from '../types/Gebruiker';
import { ErrorService } from './error.service';

@Injectable({

  providedIn: 'root'
})
export class AuthService {

  public currentUser: BehaviorSubject<null | User> = new BehaviorSubject<null | User>(null);
  #verificationId: string = '';
  #authUnsubscribe: Unsubscribe;

  constructor(
    private errService: ErrorService,
    private auth: Auth,
    private router: Router,
    private fireStore: BackendApiService,
    private globalService: GlobalsService,
    private apiService: BackendApiService) {
    this.#authUnsubscribe = this.auth.onAuthStateChanged((user: User | null) => {
      if (user !== null) {
        this.setCurrentUser(user);
      }
    });
  }
  isLoggedIn(): boolean {
    return this.currentUser.value !== null && this.currentUser.value !== undefined;
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
  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();

      if (Capacitor.isNativePlatform()) {
        await signOut(this.auth);
      }
      await this.globalService.navigate(['login']);

    } catch (error) {
      console.error(error);
    }
  }
  async signInWithGoogle(): Promise<void> {
    // Sign in on the native layer.
    let credential: any = null;
    const result = await FirebaseAuthentication.signInWithGoogle()
      .then((result) => credential = result.credential)
      .catch((error) => this.errorMessages(error));

    if (!credential) {
      // Handle the case where the credential is null.
      return;
    }

    const { idToken } = credential;

    // Sign in on the web layer.
    if (Capacitor.isNativePlatform()) {
      const authCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(this.auth, authCredential)
        .catch((error) => this.errorMessages(error));
    }
  }
  async signInWithFacebook(): Promise<void> {
    // Sign in on the native layer.
    let credential: any = null;
    const result = await FirebaseAuthentication.signInWithFacebook()
      .then((result) => credential = result.credential)
      .catch((error) => this.errorMessages(error));

    if (!credential) {
      // Handle the case where the credential is null.
      return;
    }

    // Sign in on the web layer.
    if (Capacitor.isNativePlatform()) {
      if (credential.accessToken) {
        const authCredential = FacebookAuthProvider.credential(credential.accessToken);
        await signInWithCredential(this.auth, authCredential)
          .catch((error) => this.errorMessages(error));
      }
    }
  }
  async sendPhoneVerificationCode(phoneNumber: string): Promise<void> {
    const result = await FirebaseAuthentication.signInWithPhoneNumber({ phoneNumber });
    const verificationId = result.verificationId;

    if (typeof verificationId === 'undefined') {
      // Handle the case where verificationId is undefined.
      return;
    }

    this.#verificationId = verificationId;
  }
  async signInWithPhoneNumber(verificationCode: string): Promise<void> {
    const credential =
      PhoneAuthProvider.credential(this.#verificationId, verificationCode);
    await signInWithCredential(this.auth, credential);
  }
  async updateDisplayName(displayName: string): Promise<void> {
    if (this.auth.currentUser) {
      await updateProfile(this.auth.currentUser, { displayName });
    }
  }
  // password reset 
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await FirebaseAuthentication.sendPasswordResetEmail({ email });
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * Save the new user as an instance variable, and perform any necessary reroutes.
   *
   * @param user The new user.
   * @private
   */
  private async setCurrentUser(user: User | null): Promise<void> {
    this.currentUser.next(user);
    const isAuthenticated = user !== null;
    const currentUrl = this.router.url;

    this.registerCurrentUserAsGebruiker(user)

    if (isAuthenticated && currentUrl === '/login') {

      await this.globalService.navigate(['tabs', 'kandidaten']);
    } else if (!isAuthenticated && currentUrl !== '/login') {
      await this.globalService.navigate(['login']);
    }
  }
  async registreerGebruikerMetEmail(email: string, password: string): Promise<string | undefined> {
    if (email) {
      this.fireStore.retrieveGebruikerByEmail(email)
        .subscribe(async (res) => {
          if (res.length == 0) {
            await this.nieuweGebruikerMetEmail(email, password);
          } else {
            const existingUser = res[0];
            const signinResult = await FirebaseAuthentication.signInWithEmailAndPassword({ email, password })
              .catch((error) => this.errorMessages(error));
            if (signinResult) {
              await this.globalService.setGebruiker(existingUser);
            } else {
              this.errorMessages('Fout paswoord')
            }
          }
        });
    }
    return undefined;
  }
  private async nieuweGebruikerMetEmail(email: string, password: string): Promise<void> {
    try {

      const result = await FirebaseAuthentication.createUserWithEmailAndPassword({ email: email, password: password });
      const user = result.user;
      if (user) {
        await this.registerCurrentUserAsGebruiker(user);
      }
    } catch (error) {
      console.error(error);
    }
  }
  private async registerCurrentUserAsGebruiker(user: User | CUser | null): Promise<void> {
    if (user) {
      this.fireStore.retrieveGebruikerByEmail(user.email as string)
        .pipe(
          take(1),
          switchMap((res) => {
            if (res.length == 0) {
              const parts = (user.displayName || '').split(' ');
              const gebruiker = new Gebruiker();
              gebruiker.email = user.email || '';
              gebruiker.voornaam = parts[0] || '';
              gebruiker.achternaam = parts.slice(1).join(' ');
              gebruiker.verdachten = [];
              gebruiker.aantalStemmenOmhoog = 0;
              gebruiker.aantalStemmenOmlaag = 0;
              return this.apiService.retrieveKandidaats().pipe(
                take(1),
                switchMap((kandidaten) => {
                  kandidaten.map(kandidaat => gebruiker.verdachten?.push(kandidaat.id));
                  return this.fireStore.addGebruiker(gebruiker).then(() => this.globalService.setGebruiker(gebruiker));
                })
              );
            } else {
              return this.globalService.setGebruiker(res[0]);
            }
          }),
          catchError((error) => {
            this.errService.showAlert('Fout', error.message)
            throw error;
          })
        )
        .subscribe();
    }
  }
  private errorMessages(error: any) {
    if (error === 'Fout paswoord') {
      this.errService.showAlert('Fout', 'Foutief paswoord!');
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      this.errService.showAlert('Fout', 'Dit e-mailadres is al gekoppeld aan een ander account. Probeer in te loggen met dat account.');
    } else {
      this.errService.showAlert('Fout', 'Er is een fout opgetreden bij het aanmelden.');
    }
  }
}
