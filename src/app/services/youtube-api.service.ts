import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class YoutubeApiService {

  constructor(private http: HttpClient) {}


  searchVideos(searchQuery: string, nextPageToken?: string): Observable<any> {
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
      .get( `${environment.youTubeBaseUrl}/search`, { params })
      .pipe(
        map((response: { [x: string]: any; }) => {
          const videos = response['items'];
          const pageInfo = response['pageInfo'];
          const nextPageToken = response['nextPageToken'];

          return {
            videos: videos,
            pageInfo: pageInfo,
            nextPageToken: nextPageToken
          };
        })
      );
  }

}
