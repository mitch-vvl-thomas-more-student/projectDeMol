import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KandidatenPageRoutingModule } from './kandidaten-routing.module';

import { KandidatenPage } from './kandidaten.page';
import { SharedModule } from 'src/app/components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KandidatenPageRoutingModule,
    SharedModule,
    RouterModule,
  ],
  declarations: [KandidatenPage]
})
export class KandidatenPageModule {}
