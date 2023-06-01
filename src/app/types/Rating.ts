import Gebruiker from "./Gebruiker";
import Hint from "./Hint";

export default class Rating {
  hint: Hint;
  showAlert: () => void;
  update: (hint?: Hint, gebruiker?: Gebruiker) => Promise<void>
  constructor(
    private currentUser: Gebruiker,
    hint: Hint,
    showAlert: () => void,
    update: (hint?: Hint, gebruiker?: Gebruiker) => Promise<void>,
  ) {
    this.hint = hint;
    this.showAlert = showAlert;
    this.update = update;
  }

  async onThumbsUp() {
    if (!this.hint.gestemdDoor.find(x => x === this.currentUser.id)) {
      this.hint.gestemdDoor.push(this.currentUser.id);
      this.hint.stemmenOmhoog = Number(this.hint.stemmenOmhoog + 1);
      this.currentUser.aantalStemmenOmhoog = Number(this.currentUser.aantalStemmenOmhoog + 1);
      this.update(this.hint, this.currentUser);
    }
    else {
      this.showAlert();
    }
  }

  async onThumbsDown() {
    if (!this.hint.gestemdDoor.find(x => x === this.currentUser.id)) {
      this.hint.gestemdDoor.push(this.currentUser.id);
      this.hint.stemmenOmlaag = Number(this.hint.stemmenOmlaag + 1);
      this.currentUser.aantalStemmenOmlaag = Number(this.currentUser.aantalStemmenOmlaag + 1);
      this.update(this.hint, this.currentUser);
    }
    else {
      this.showAlert();
    }
  }
}
