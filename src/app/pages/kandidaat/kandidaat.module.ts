import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KandidaatPageRoutingModule } from './kandidaat-routing.module';

import { KandidaatPage } from './kandidaat.page';
import { SharedModule } from 'src/app/components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KandidaatPageRoutingModule,
    SharedModule,
    RouterModule
  ],
  declarations: [KandidaatPage]
})
export class KandidaatPageModule {}
