import { Router } from '@angular/router';
import { BackendApiService } from './../../services/backend-api.service';
import { Component, OnInit } from '@angular/core';
import Kandidaat from 'src/app/types/Kandidaat';

@Component({
  selector: 'app-kandidaten',
  templateUrl: './kandidaten.page.html',
  styleUrls: ['./kandidaten.page.scss'],
})
export class KandidatenPage implements OnInit {
  kandidaten: Kandidaat[];
  kandidaat: Kandidaat;

  constructor(private dataService: BackendApiService, private router: Router) { }

  async ngOnInit() {
    this.dataService.retrieveKandidaats().subscribe((res) => this.kandidaten = res)
  }

  onKandidaatClicked(id: number) {
    this.router.navigate(['kandidaten', id])
  }
}
