import { GlobalsService } from 'src/app/services/globals.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private globalsService: GlobalsService) {
    setTimeout(() => { this.globalsService.navigate(['tabs', 'kandidaten']) }, 2500)
  }

  ngOnInit() { }

}
