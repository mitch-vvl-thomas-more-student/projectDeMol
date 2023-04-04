import { KandidaatHintComponent } from './kandidaat-hint/kandidaat-hint.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { MenuComponent } from './menu/menu.component';
import { PhoneVerificationComponent } from './phone-verification/phone-verification.component';
import { KandidaatCardComponent } from './kandidaat-card/kandidaat-card.component';
import { HintModalComponent } from './hint-modal/hint-modal.component';
import { ReorderComponent } from './reorder/reorder.component';
import { FormsModule } from '@angular/forms';
// import { KandidaatPage } from '../pages/kandidaat/kandidaat.page';

// @NgModule({
//   declarations: [
//     MenuComponent,
//     PhoneVerificationComponent,
//     KandidaatCardComponent,
//     HintModalComponent
//   ],
//   exports: [
//     MenuComponent,
//     PhoneVerificationComponent,
//     KandidaatCardComponent,
//     HintModalComponent
//   ],
//   imports: [
//     CommonModule,
//     IonicModule,
//     RouterModule
//   ]
// })
// export class SharedModule { }


@NgModule({
  declarations: [
    MenuComponent,
    PhoneVerificationComponent,
    KandidaatCardComponent,
    HintModalComponent,
    ReorderComponent,
    KandidaatHintComponent
  ],
  exports: [
    MenuComponent,
    PhoneVerificationComponent,
    KandidaatCardComponent,
    HintModalComponent,
    ReorderComponent,
    KandidaatHintComponent
    ],
  imports: [
    FormsModule,
    CommonModule,
    IonicModule,
    RouterModule.forChild([]) // You can add routes specific to the shared module here
  ]
})
export class SharedModule {}
