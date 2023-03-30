import  Kandidaat  from 'src/app/types/Kandidaat';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-kandidaat-card',
  templateUrl: './kandidaat-card.component.html',
  styleUrls: ['./kandidaat-card.component.scss'],
})

export class KandidaatCardComponent  implements OnInit {
  @Input() kandidaat: Kandidaat;

  constructor() { }

  ngOnInit() {}

}
