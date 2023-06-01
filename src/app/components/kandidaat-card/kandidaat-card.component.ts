import Kandidaat from 'src/app/types/Kandidaat';
import { Component, Input } from '@angular/core';
import { Position } from '../../enums/Position';

@Component({
  selector: 'app-kandidaat-card',
  templateUrl: './kandidaat-card.component.html',
  styleUrls: ['./kandidaat-card.component.scss'],
})
export class KandidaatCardComponent {
  @Input() kandidaat: Kandidaat;
  @Input() positie: number;

  getBadgeCssClass(position: number): string {
    switch (position) {
      case Position.Gold:
        return 'custom-badge gold';
      case Position.Silver:
        return 'custom-badge silver';
      case Position.Bronze:
        return 'custom-badge bronze';
      default:
        return 'custom-badge';
    }
  };

  getCardCssClass(position: number): string {
    return position === Position.Gold ? 'card gold-border' : 'card';
  };
}
