import { YoutubeApiService } from './../../services/youtube-api.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-youtubefeed',
  templateUrl: './youtubefeed.page.html',
  styleUrls: ['./youtubefeed.page.scss'],
})
export class YoutubefeedPage implements OnInit {

  youtubeResults: any;
  videoUrl: SafeResourceUrl;

  constructor(public authService: AuthService, private youtubeService: YoutubeApiService, private sanitizer: DomSanitizer) {

    this.authService.currentUser.subscribe((user) => {
      console.log(user);
    });

  }

  // ngOnInit() {
  //   this.youtubeService.searchVideos('de mol belgie 2023', 'CAoQAA').subscribe((res) => {
  //     this.youtubeResults = res;
  //     console.log(res);
  //   });
  // }

  // ngOnInit() {
  //   this.loadVideos();
  // }
  
  // loadVideos(pageToken?: string) {
  //   this.youtubeService.searchVideos('de mol belgie 2023', pageToken).subscribe((res) => {
  //     if (this.youtubeResults) {
  //       this.youtubeResults.videos.push(...res.videos); // Append the new videos to the existing ones
  //     } else {
  //       this.youtubeResults = res; // Initialize the results if they don't exist yet
  //     }
      
  //     console.log(res);
      
  //     if (res.nextPageToken) {
  //       this.loadVideos(res.nextPageToken); // Load the next page of results
  //     }
  //   });
  // }
  
  // setVideoUrl(videoId: string) {
  //   this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  // }

  ngOnInit() {
    this.searchVideos();
  }

  searchVideos(pageToken?: string) {
    this.youtubeService.searchVideos('de mol belgie 2023', pageToken).subscribe((res) => {
      if (this.youtubeResults) {
        this.youtubeResults.videos = this.youtubeResults.videos.concat(res.videos);
      } else {
        this.youtubeResults = res;
      }
      console.log(res);
    });
  }

  setVideoUrl(videoId: string) {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }

  loadData(event: { target: { complete: () => void; disabled: boolean; }; }) {
    if (this.youtubeResults.nextPageToken) {
      this.searchVideos(this.youtubeResults.nextPageToken);
      event.target.complete();
    } else {
      event.target.disabled = true;
    }
  } 
}