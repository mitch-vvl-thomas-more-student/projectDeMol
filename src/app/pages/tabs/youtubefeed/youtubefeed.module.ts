import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { YoutubefeedPageRoutingModule } from './youtubefeed-routing.module';
import { YoutubefeedPage } from './youtubefeed.page';
import { SharedModule } from 'src/app/components/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    YoutubefeedPageRoutingModule,
    SharedModule
  ],
  declarations: [YoutubefeedPage]
})
export class YoutubefeedPageModule { }
