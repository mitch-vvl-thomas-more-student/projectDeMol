import { Video, YoutubeApiResponse } from './../interfaces/youtubeApiResponse';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, retry } from 'rxjs/operators';
import { PageInfo } from '../interfaces/youtubeApiResponse';


@Injectable({
  providedIn: 'root'
})
export class YoutubeApiService {

  constructor(private http: HttpClient) { }

  searchVideos(searchQuery: string, nextPageToken?: string): Observable<YoutubeApiResponse> {
    let params = new HttpParams()
      .set('part', 'snippet')
      .set('type', 'video')
      .set('order', 'relevance')
      .set('maxResults', 6)
      .set('publishedAfter', '2023-01-01T00:00:00Z')
      .set('q', searchQuery)
      .set('key', environment.youTubeApiKey);

    if (nextPageToken) {
      params = params.set('pageToken', nextPageToken);
    }

    return this.http
      .get(`${environment.youTubeBaseUrl}/search`, { params })
      .pipe(
        retry(3),
        catchError(error => {
          console.error('An error occurred while searching for videos: ', error);
          return of(undefined)
        }),
        map((response: any) => {
          console.log(response)
          const videos: Video[] = response['items'];
          const pageInfo: PageInfo = response['pageInfo'];
          const nextPageToken: string = response['nextPageToken'];

          return {
            videos: videos,
            pageInfo: pageInfo,
            nextPageToken: nextPageToken
          };
        }),
      );
  }


}
