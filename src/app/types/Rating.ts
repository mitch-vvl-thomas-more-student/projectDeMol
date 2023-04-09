import Gebruiker from "./Gebruiker";
import Hint from "./Hint";

export default class Rating {
    hint: Hint;
    gebruiker: Gebruiker;
    showAlert: () => void;
    update: (hint?: Hint, gebruiker?: Gebruiker) => Promise<void>
    constructor(hint: Hint, gebruiker: Gebruiker, showAlert: () => void, update: (hint?: Hint, gebruiker?: Gebruiker) => Promise<void>) {
      this.hint = hint;
      this.gebruiker = gebruiker;
      this.showAlert = showAlert;
      this.update = update;
    }
  
    async onThumbsUp() {
      if (!this.hint.gestemdDoor.find(x => x === this.gebruiker.id)) {
        this.hint.gestemdDoor.push(this.gebruiker.id);
        this.hint.stemmenOmhoog = Number(this.hint.stemmenOmhoog + 1);
        this.gebruiker.aantalStemmenOmhoog = Number(this.gebruiker.aantalStemmenOmhoog + 1);
        this.update(this.hint, this.gebruiker);
      }
      else {
        this.showAlert();
      }
    }
  
    async onThumbsDown() {
      if (!this.hint.gestemdDoor.find(x => x === this.gebruiker.id)) {
        this.hint.gestemdDoor.push(this.gebruiker.id);
        this.hint.stemmenOmlaag = Number(this.hint.stemmenOmlaag + 1);
        this.gebruiker.aantalStemmenOmlaag = Number(this.gebruiker.aantalStemmenOmlaag + 1);
        this.update(this.hint, this.gebruiker);
      }
      else {
        this.showAlert();
      }
    }
  }
  