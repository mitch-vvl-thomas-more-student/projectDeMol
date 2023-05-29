import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GeoCode } from '../interfaces/geoCode';

@Injectable({
  providedIn: 'root'
})
export class GeoCodeService {
  private baseUrl = 'https://geocode.maps.co/reverse';

  constructor(private http: HttpClient) { }

  async getGeoCode(latitude: string, longitude: string): Promise<GeoCode> {
    const url = `${this.baseUrl}?lat=${latitude}&lon=${longitude}`;
    
    try {
      const response = await firstValueFrom(this.http.get<GeoCode>(url));
      return response;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 429) { // every application can request a maximum of 1 request per second
          const retryAfterSeconds = parseInt(error.headers.get('Retry-After') || '1', 10);
          await this.delay(retryAfterSeconds * 1000);
          return this.getGeoCode(latitude, longitude);
        } else if (error.status === 503) { // Handle server unavailable error
          const retryAfterSeconds = parseInt(error.headers.get('Retry-After') || '1', 10);
          await this.delay(retryAfterSeconds * 1000);
          return this.getGeoCode(latitude, longitude);
        } else if (error.status === 403) {

           throw new Error('Blocked client: Please contact the API provider to resolve the issue.');
        }
      }
      
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

