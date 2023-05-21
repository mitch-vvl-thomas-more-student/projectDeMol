import { ErrorService } from './../../services/error.service';
import { GlobalsService } from './../../services/globals.service';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { Component, Input, OnInit } from '@angular/core';
import Hint from 'src/app/types/Hint';
import { Collections } from 'src/app/enums/collections';
import Opmerking from 'src/app/types/Opmerking';
import Rating from 'src/app/types/Rating';
import Gebruiker from 'src/app/types/Gebruiker';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-kandidaat-hint',
  templateUrl: './kandidaat-hint.component.html',
  styleUrls: ['./kandidaat-hint.component.scss'],
})
export class KandidaatHintComponent implements OnInit {
  @Input() hint: Hint;
  profileImageUrl$: string | null;
  gebruiker: Gebruiker;
  background: string;
  colors: string[] = [
    "#2c3e50", // midnight blue
    "#3498db", // blue
    "#8e44ad", // purple
    "#27ae60", // green
    "#e67e22", // orange
    "#f1c40f", // yellow
    "#e74c3c", // red
    "#c0392b", // dark red
    "#1abc9c", // turquoise
    "#16a085", // green blue
    "#2ecc71", // bright green
    "#f39c12", // bright orange
    "#d35400", // dark orange
    "#f44336", // bright red
    "#9b59b6"  // bright purple
  ];
  showCommentInput: boolean = false;
  newComment: string;
  rating: Rating;

  constructor(
    private errService: ErrorService,
    private apiService: BackendApiService,
    private globalService: GlobalsService,
    public authService: AuthService,
    private storageService: StorageService
  ) { }

  async ngOnInit() {
    this.hint.datumString = new Date((this.hint.datum as Timestamp).seconds * 1000 + (this.hint.datum as Timestamp).nanoseconds / 1000000).toLocaleDateString('be-NL');
    this.hint.opmerkingen.forEach(opmerking => {
      opmerking.datumString = new Date((opmerking.datum as Timestamp).seconds * 1000 + (opmerking.datum as Timestamp).nanoseconds / 1000000).toLocaleDateString('be-NL');
    });


    this.gebruiker = await this.apiService.getDocByRef<Gebruiker>(this.hint.plaatser, Collections.gebruikers)
      .catch(err => this.errService.showAlert('Fout', err.message)) as Gebruiker
    const tempBackground = Math.floor(Math.random() * this.colors.length);
    this.background = this.colors[tempBackground];
    this.rating = new Rating(await this.globalService.getGebruiker(), this.hint, this.#showAlert.bind(this), this.#update.bind(this));
    this.profileImageUrl$ = this.storageService.getProfileImageUrl(this.gebruiker);
  }

  async onThumbsUp() {
    const loggedIn = await this.globalService.getGebruiker();
    !loggedIn.email ? this.globalService.notLoggedIn() : this.rating.onThumbsUp();
  }

  async onThumbsDown() {
    const loggedIn = await this.globalService.getGebruiker();
    !loggedIn.email ? this.globalService.notLoggedIn() : this.rating.onThumbsDown();
  }

  async #showAlert(): Promise<void> {
    this.errService.showAlert('Fout', 'Uw stem werd reeds geregistreerd ... ')
  }

  async #update(hint?: Hint, gebruiker?: Gebruiker): Promise<void> {
    if (hint) {
      await this.apiService.updateHint(this.hint)
        .catch(err => this.errService.showAlert('Fout', err.message));

      if (gebruiker) {
        this.globalService.setGebruiker(gebruiker);
        await this.apiService.updateGebruiker(gebruiker)
          .catch(err => this.errService.showAlert('Fout', err.message));
      }
    }
  }

  async onSubmitComment() {
    const newOpmerking: Opmerking = {
      plaatser: { ...this.gebruiker },
      datum:  new Date().getTime() as unknown as Timestamp,
      datumString: new Date().toLocaleDateString('be-NL'),
      tekst: this.newComment
    }
    this.hint.opmerkingen.push(newOpmerking);
    await this.apiService.updateHint(this.hint)
      .catch(err => this.errService.showAlert('Fout', err.message));;
    this.newComment = '';
    this.showCommentInput = false;
  }

  async fnShowCommentInput() {
    const loggedIn = await this.globalService.getGebruiker();
    !loggedIn.email ? this.globalService.notLoggedIn() : this.showCommentInput = true;
  }
}

