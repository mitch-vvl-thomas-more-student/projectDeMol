import { GlobalsService } from './../../services/globals.service';
import Gebruiker from 'src/app/types/Gebruiker';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { Component, Input, OnInit } from '@angular/core';
import Hint from 'src/app/types/Hint';
import { Collections } from 'src/app/enums/collections';
import Opmerking from 'src/app/types/Opmerking';
import Rating from 'src/app/types/Rating';

@Component({
  selector: 'app-kandidaat-hint',
  templateUrl: './kandidaat-hint.component.html',
  styleUrls: ['./kandidaat-hint.component.scss'],
})
export class KandidaatHintComponent implements OnInit {
  @Input() hintid: any;
  hint: Hint;
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

  constructor(private apiService: BackendApiService, private globalService: GlobalsService) {
  }

  async ngOnInit() {
    const temp = await this.apiService.getDocByRef<Hint>(this.hintid, Collections.hints) as Hint
    if (temp) {
      temp.plaatser = JSON.parse(temp.plaatser)
      temp.kandidaat = JSON.parse(temp.kandidaat)
      const x = temp.datum as any;
      const date = new Date(x.seconds * 1000);
      temp.datum = date;
    }
    this.hint = temp;
    this.gebruiker = await this.apiService.getDocByRef<Gebruiker>(this.hint.plaatser, Collections.gebruikers) as Gebruiker
    const tempBackground = Math.floor(Math.random() * this.colors.length);
    this.background = this.colors[tempBackground];
    this.rating = new Rating(this.hint, this.gebruiker, this.#showAlert.bind(this), this.#update.bind(this));
  }

  async onThumbsUp() {
    this.rating.onThumbsUp();
  }

  async onThumbsDown() {
    this.rating.onThumbsDown();
  }

  #showAlert() {
    alert('Uw stem werd reeds geregistreerd ... ');
  }

  async #update(hint?: Hint, gebruiker?: Gebruiker): Promise<void> {
    if (hint) {
      this.hint.id = this.hintid;
      await this.apiService.updateHint(this.hint);

      if (gebruiker) {
        this.globalService.setGebruiker(this.gebruiker);
        await this.apiService.updateGebruiker(this.gebruiker)
      }
    }
  }

  onSubmitComment() {
    const newOpmerking: Opmerking = {
      plaatser: { ...this.gebruiker },
      datum: new Date(),
      tekst: this.newComment
    }
    this.hint.opmerkingen.push(newOpmerking);
    this.newComment = '';
    this.showCommentInput = false;
  }
}

