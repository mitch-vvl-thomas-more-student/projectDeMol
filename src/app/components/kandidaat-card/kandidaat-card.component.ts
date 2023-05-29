// import Kandidaat from 'src/app/types/Kandidaat';
// import { Component, Input, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-kandidaat-card',
//   templateUrl: './kandidaat-card.component.html',
//   styleUrls: ['./kandidaat-card.component.scss'],
// })

// export class KandidaatCardComponent implements OnInit {
//   @Input() kandidaat: Kandidaat;
//   @Input() positie: number;

//   constructor() { }

//   ngOnInit() { }

//   getBadgeClass(positie: number): string {
//     if (positie === 1) {
//       return 'custom-badge gold';
//     } else if (positie === 2) {
//       return 'custom-badge silver';
//     } else if (positie === 3) {
//       return 'custom-badge bronze';
//     } else {
//       return 'custom-badge';
//     }
//   }

//   getClass(positie: number): string {
//     if (positie === 1) {
//       return 'card gold-border';
//     }
//     return 'card';
//   }
// }

import Kandidaat from 'src/app/types/Kandidaat';
import { Component, Input } from '@angular/core';

enum Position {
  Gold = 1,
  Silver = 2,
  Bronze = 3
}

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
  }

  getCardCssClass(position: number): string {
    return position === Position.Gold ? 'card gold-border' : 'card';
  }
}
