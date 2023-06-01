import { Injectable } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  #permissionGranted = { camera: 'prompt', photos: 'prompt' };

  constructor() { }

  async #requestPermissions(): Promise<void> {
    try {
      this.#permissionGranted = await Camera.requestPermissions({ permissions: ['photos', 'camera'] });
    } catch (error) {
      console.error(`Permissions aren't available on this device: ${Capacitor.getPlatform()} platform.`);
    }
  };

  async #retrievePermissions(): Promise<void> {
    try {
      this.#permissionGranted = await Camera.checkPermissions();
    } catch (error) {
      console.error(`Permissions aren't available on this device: ${Capacitor.getPlatform()} platform.`);
    }
  };

  async #requestPermissionsforWeb(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      this.#permissionGranted.camera = 'granted';
      this.#permissionGranted.photos = 'granted';
    } catch (error) {
      console.error(`Permissions aren't available on this device: ${Capacitor.getPlatform()} platform.`);
    }
  };

  async #retrievePermissionsforWeb(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      this.#permissionGranted.camera = 'granted';
      this.#permissionGranted.photos = 'granted';
    } catch (error) {
      console.error(`Permissions aren't available on this device: ${Capacitor.getPlatform()} platform.`);
    }
  };

  async takePhoto(): Promise<string> {
    Capacitor.isNativePlatform() ? await this.#retrievePermissions() : await this.#retrievePermissionsforWeb();
    if (this.#permissionGranted.camera === 'denied') {
      Capacitor.isNativePlatform() ? this.#requestPermissions() : this.#requestPermissionsforWeb();
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
      Capacitor.isNativePlatform() ? this.#requestPermissions() : this.#requestPermissionsforWeb();
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
  };
}
