import { BackendApiService } from './../../../services/backend-api.service';
import { Component, OnInit } from '@angular/core';
import Kandidaat from 'src/app/types/Kandidaat';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-kandidaten',
  templateUrl: './kandidaten.page.html',
  styleUrls: ['./kandidaten.page.scss'],
})
export class KandidatenPage implements OnInit {
  #kandidatenSub: Subscription;
  kandidaten: Kandidaat[];
  kandidaat: Kandidaat;

  constructor(private dataService: BackendApiService) { }

  async ngOnInit() {
    this.#kandidatenSub = this.dataService.retrieveKandidaats().subscribe((res) => this.kandidaten = res)
  }
  ngOnDestroy() {
    if (this.#kandidatenSub){
      this.#kandidatenSub.unsubscribe();
    }
  }
}
