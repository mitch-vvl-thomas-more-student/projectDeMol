import  Kandidaat  from 'src/app/types/Kandidaat';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-kandidaat-card',
  templateUrl: './kandidaat-card.component.html',
  styleUrls: ['./kandidaat-card.component.scss'],
})

export class KandidaatCardComponent  implements OnInit {
  @Input() kandidaat: Kandidaat;
  @Input() positie: number;

  constructor() { }

  ngOnInit() {}

  getBadgeClass(positie: number): string {
    if (positie === 1) {
      return 'custom-badge gold';
    } else if (positie === 2) {
      return 'custom-badge silver';
    } else if (positie === 3) {
      return 'custom-badge bronze';
    } else {
      return 'custom-badge';
    }
  }

  getClass(positie: number): string {
    if (positie === 1){
      return 'card gold-border';
    }
    return 'card';
  }
  
}
