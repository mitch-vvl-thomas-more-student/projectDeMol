import { StorageService } from './../../services/storage.service';
import { AuthService } from './../../services/auth.service';
import { GlobalsService } from './../../services/globals.service';
import { Component } from '@angular/core';
import { BackendApiService } from 'src/app/services/backend-api.service';
import Gebruiker from 'src/app/types/Gebruiker';
import { Observable, from } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, map } from 'rxjs/operators';
import { UploadTaskSnapshot } from '@angular/fire/compat/storage/interfaces';
import { ErrorService } from 'src/app/services/error.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  gebruiker: Gebruiker;
  profileImageUrl$: Observable<string> | null;

  constructor(
    private errService: ErrorService,
    private storageService : StorageService,
    private dataService: BackendApiService,
    private globalsService: GlobalsService,
    public authService: AuthService    ) {
  }
  async ngOnInit() {
    this.gebruiker = await this.globalsService.getGebruiker();
    this.profileImageUrl$ = this.storageService.getProfileImageUrl(this.gebruiker);
  }

  async update() {
    await this.dataService.updateGebruiker(this.gebruiker);
    await this.globalsService.setGebruiker(this.gebruiker);
  }

  async onFileSelected(event: any): Promise<void> {
    const file: File = event.target.files[0];
    if (file) {
      if (file.size <= 3.5 * 1024 * 1024) {
        if (file.type.startsWith('image/')) {
          try {
            this.storageService.deleteImage(this.gebruiker);
            this.storageService.uploadImage(file, this.gebruiker).subscribe(async downloadURL => {
              if (downloadURL) {
                this.gebruiker.avatar = downloadURL.ref.name;
                this.globalsService.setGebruiker(this.gebruiker);
                await this.dataService.updateGebruiker(this.gebruiker);
                this.profileImageUrl$ = this.storageService.getProfileImageUrl(this.gebruiker)
              }
            });;
          } catch (error) {
            this.errService.showAlert('Fout', 'Er is een fout opgetreden tijdens het uploaden van de afbeelding.')
          }
        } else {
          this.errService.showAlert('Fout', 'Alleen afbeeldingsbestanden zijn toegestaan.')
        }
      } else {
        this.errService.showAlert('Fout', 'Het bestand is te groot. Maximaal toegestane grootte is 3.5MB.')
      }
    }
  }

  openFilePicker() {
    document.getElementById('btn_file')?.click();
  }
}
