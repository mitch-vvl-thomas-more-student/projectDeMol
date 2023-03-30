import { GlobalsService } from './globals.service';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { Injectable } from '@angular/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Router } from '@angular/router';
import { UserCredential, signInWithCredential, signOut, Unsubscribe, Auth } from '@angular/fire/auth';
import { updateProfile, GoogleAuthProvider, PhoneAuthProvider, FacebookAuthProvider, User } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject } from 'rxjs';
import Gebruiker, { IFireStoreGebruiker } from '../types/Gebruiker';

@Injectable({

  providedIn: 'root'
})
export class AuthService {

  public currentUser: BehaviorSubject<null | User> = new BehaviorSubject<null | User>(null);
  #verificationId: string = '';
  #authUnsubscribe: Unsubscribe;

  constructor(private auth: Auth, private router: Router, private fireStore: BackendApiService, private globalService: GlobalsService) {
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

      await this.router.navigate(['login']);

    } catch (error) {
      console.error(error);
    }
  }


  async signInWithGoogle(): Promise<void> {
    // Sign in on the native layer.
    const result = await FirebaseAuthentication.signInWithGoogle();
    const credential = result.credential;

    if (!credential) {
      // Handle the case where the credential is null.
      return;
    }

    const { idToken } = credential;

    // Sign in on the web layer.
    if (Capacitor.isNativePlatform()) {
      const authCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(this.auth, authCredential);
    }
  }


  async signInWithFacebook(): Promise<void> {
    // Sign in on the native layer.
    const result = await FirebaseAuthentication.signInWithFacebook();
    const credential = result.credential;

    if (!credential) {
      // Handle the case where the credential is null.
      return;
    }

    // Sign in on the web layer.
    if (Capacitor.isNativePlatform()) {
      if (credential.accessToken) {
        const authCredential = FacebookAuthProvider.credential(credential.accessToken);
        await signInWithCredential(this.auth, authCredential);
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

      await this.router.navigate(['tabs', 'home']);
    } else if (!isAuthenticated && currentUrl !== '/login') {
      await this.router.navigate(['login']);
    }
  }

  private async registerCurrentUserAsGebruiker(user: User | null): Promise<void> {
    if (user) {
      this.fireStore.retrieveGebruikerByEmail(user?.email as string)
        .subscribe(async (res) => {
          if (res.length === 0) {
            const gebruiker = new Gebruiker();
            gebruiker.email = user.email || '';
            gebruiker.voornaam = (user.displayName || '').split(' ')[0] || '';
            gebruiker.achternaam = (user.displayName || '').split(' ', 2)[1] || '';
            await this.fireStore.addGebruiker(gebruiker);
            await this.globalService.setGebruiker(gebruiker);
          } else {
            await this.globalService.setGebruiker(res[0])
          }
        })
    }
  }
}