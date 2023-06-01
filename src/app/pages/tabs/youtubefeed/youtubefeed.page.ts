import { YoutubeApiResponse } from '../../../interfaces/youtubeApiResponse';
import { YoutubeApiService } from '../../../services/youtube-api.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-youtubefeed',
  templateUrl: './youtubefeed.page.html',
  styleUrls: ['./youtubefeed.page.scss'],
})
export class YoutubefeedPage implements OnInit, OnDestroy {
  #youtubeSub: Subscription;
  youtubeResults: YoutubeApiResponse;
  videoUrl: SafeResourceUrl;

  constructor(private youtubeService: YoutubeApiService, public sanitizer: DomSanitizer) {}
  
  ngOnInit() {
    this.searchVideos();
  };

  ngOnDestroy(){
   if (this.#youtubeSub){
    this.#youtubeSub.unsubscribe();
   }
  };

  searchVideos(pageToken?: string) {
   this.#youtubeSub = this.youtubeService.searchVideos('de mol belgie 2023', pageToken).subscribe((res : YoutubeApiResponse ) => { 
      if (this.youtubeResults) {
        this.youtubeResults.videos = this.youtubeResults.videos.concat(res.videos);
      } else {
        this.youtubeResults = res;
      }
    });
  };

  setVideoUrl(videoId: string) {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  };

  loadData(event: any) {
    if (this.youtubeResults.nextPageToken) {
      this.searchVideos(this.youtubeResults.nextPageToken);
      event.target.complete();
    } else {
      event.target.disabled = true;
    }
  };
}