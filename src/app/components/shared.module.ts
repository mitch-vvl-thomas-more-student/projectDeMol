import { KandidaatHintComponent } from './kandidaat-hint/kandidaat-hint.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { KandidaatCardComponent } from './kandidaat-card/kandidaat-card.component';
import { HintModalComponent } from './hint-modal/hint-modal.component';
import { ReorderComponent } from './reorder/reorder.component';
import { FormsModule } from '@angular/forms';
import { ResetPaswoordComponent } from './reset-paswoord/reset-paswoord.component';
import { RegisterComponent } from './register/register.component';
import { LoginAttemptsComponent } from './login-attempts/login-attempts.component';
import { PopoverContentComponent } from './popover/popover.component';
import { MapComponent } from './map/map.component';
import { HintOpmerkingComponent } from './hint-opmerking/hint-opmerking.component';
import { ProfielFormComponent } from '../profiel-form/profiel-form.component';

@NgModule({
  declarations: [
    KandidaatCardComponent,
    HintModalComponent,
    ReorderComponent,
    KandidaatHintComponent,
    ResetPaswoordComponent,
    RegisterComponent,
    LoginAttemptsComponent,
    PopoverContentComponent,
    MapComponent,
    HintOpmerkingComponent,
    ProfielFormComponent
  ],
  exports: [
    KandidaatCardComponent,
    HintModalComponent,
    ReorderComponent,
    KandidaatHintComponent, 
    ResetPaswoordComponent,
    RegisterComponent,
    LoginAttemptsComponent,
    PopoverContentComponent, 
    MapComponent,
    HintOpmerkingComponent,
    ProfielFormComponent
    ],
  imports: [
    FormsModule,
    CommonModule,
    IonicModule,
    RouterModule.forChild([]) // You can add routes specific to the shared module here
  ]
})
export class SharedModule {}
