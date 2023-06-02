import { BackendApiService } from './../../services/backend-api.service';
import Kandidaat from 'src/app/types/Kandidaat';
import { Component, Input, OnInit } from '@angular/core';
import { Position } from '../../enums/Position';
import { Collections } from 'src/app/enums/collections';
import Hint from 'src/app/types/Hint';

@Component({
  selector: 'app-kandidaat-card',
  templateUrl: './kandidaat-card.component.html',
  styleUrls: ['./kandidaat-card.component.scss'],
})
export class KandidaatCardComponent implements OnInit {

  @Input() kandidaat: Kandidaat;
  @Input() positie: number;

  nrOfPublicHints: number = 0;
  nrOfPrivateHints: number = 0;

  constructor(private dataService: BackendApiService) { }

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

  ngOnInit(): void {
    this.kandidaat.hints?.map((id) => {
      this.dataService.getDocByRef<Hint>(id, Collections.hints).then((hint: Hint | undefined) => {
        if (hint) {
          hint.isPubliek ? this.nrOfPublicHints++ : this.nrOfPrivateHints++;
        }
      });
    });
  }
  
}
