import { ErrorService } from './../../services/error.service';
import { GlobalsService } from './../../services/globals.service';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { Component, Input, OnInit } from '@angular/core';
import Hint from 'src/app/types/Hint';
import { Collections } from 'src/app/enums/collections';
import Opmerking from 'src/app/types/Opmerking';
import Rating from 'src/app/types/Rating';
import Gebruiker from 'src/app/types/Gebruiker';
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
    private errorService: ErrorService,
    private backendApiService: BackendApiService,
    private globalsService: GlobalsService,
    public authService: AuthService,
    private storageService: StorageService
  ) { }

  async ngOnInit() {
    this.#formatHintDate();
    this.#formatOpmerkingDates();
    this.gebruiker = await this.backendApiService.getDocByRef<Gebruiker>(this.hint.plaatser, Collections.gebruikers)
      .catch(err => this.errorService.showAlert('Fout', err.message)) as Gebruiker
    this.#selectRandomBackground();
    this.rating = new Rating(await this.globalsService.getGebruiker(), this.hint, this.#showAlert.bind(this), this.#update.bind(this));
    this.profileImageUrl$ = this.storageService.getProfileImageUrl(this.gebruiker);
  }

  #formatHintDate() {
    this.hint.datumString = new Date((this.hint.datum as Timestamp).seconds * 1000 + (this.hint.datum as Timestamp).nanoseconds / 1000000).toLocaleDateString('be-NL');
  }

  #formatOpmerkingDates() {
    this.hint.opmerkingen.forEach(opmerking => {
      opmerking.datumString = new Date((opmerking.datum as Timestamp).seconds * 1000 + (opmerking.datum as Timestamp).nanoseconds / 1000000).toLocaleDateString('be-NL');
    });
  }

  #selectRandomBackground() {
    const tempBackground = Math.floor(Math.random() * this.colors.length);
    this.background = this.colors[tempBackground];
  }

  async onThumbsUp() {
    const loggedIn = await this.globalsService.getGebruiker();
    !loggedIn.email ? this.globalsService.notLoggedIn() : this.rating.onThumbsUp();
  }

  async onThumbsDown() {
    const loggedIn = await this.globalsService.getGebruiker();
    !loggedIn.email ? this.globalsService.notLoggedIn() : this.rating.onThumbsDown();
  }

  async #showAlert(): Promise<void> {
    this.errorService.showAlert('Fout', 'Uw stem werd reeds geregistreerd ... ')
  }

  async #update(hint?: Hint, gebruiker?: Gebruiker): Promise<void> {
    if (hint) {
      await this.backendApiService.updateHint(this.hint)
        .catch(err => this.errorService.showAlert('Fout', err.message));

      if (gebruiker) {
        this.globalsService.setGebruiker(gebruiker);
        await this.backendApiService.updateGebruiker(gebruiker)
          .catch(err => this.errorService.showAlert('Fout', err.message));
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
    await this.backendApiService.updateHint(this.hint)
      .catch(err => this.errorService.showAlert('Fout', err.message));;
    this.newComment = '';
    this.showCommentInput = false;
  }

  async fnShowCommentInput() {
    const loggedIn = await this.globalsService.getGebruiker();
    !loggedIn.email ? this.globalsService.notLoggedIn() : this.showCommentInput = true;
  }
}

