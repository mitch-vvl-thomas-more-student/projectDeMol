import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { ErrorService } from './error.service';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  #permissionGranted = {camera: 'prompt', photos: 'prompt'};

  constructor(private errorService: ErrorService) { }


  async #requestPermissions(): Promise<void> {
    try {
      this.#permissionGranted = await Camera.requestPermissions({permissions: ['photos', 'camera']});
    } catch (error) {
      console.error(`Permissions aren't available on this device: ${Capacitor.getPlatform()} platform.`);
    }
  }

  async #retrievePermissions(): Promise<void> {
    try {
      this.#permissionGranted = await Camera.checkPermissions();
    } catch (error) {
      console.error(`Permissions aren't available on this device: ${Capacitor.getPlatform()} platform.`);
    }
  }

  #haveCameraPermission(): boolean {
    return this.#permissionGranted.camera === 'granted';
  }

  #havePhotosPermission(): boolean {
    return this.#permissionGranted.photos === 'granted';
  }

  #determinePhotoSource(): CameraSource {
    if (this.#havePhotosPermission() && this.#haveCameraPermission()) {
        return CameraSource.Prompt;
    } else {
        return this.#havePhotosPermission() ?
            CameraSource.Photos : CameraSource.Camera;
    }
}

  async takePhoto(): Promise<string> {
    // check for camera permissions
    await this.#retrievePermissions();
    if (this.#permissionGranted.camera === 'denied') {
      this.#requestPermissions();
    }
    if (this.#permissionGranted.camera === 'granted') {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri
      });

      return Capacitor.convertFileSrc(image.webPath as string);
    }
    else {
      this.errorService.showAlert('Fout', 'Camera permissie niet toegekend. Dit is nodig om een foto te kunnen maken.');
      await this.#requestPermissions();
      if (this.#permissionGranted.camera === 'granted') {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Uri
        });

        return Capacitor.convertFileSrc(image.webPath as string);
      }
    }
    return '';
  }
}
