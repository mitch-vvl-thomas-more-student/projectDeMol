import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YoutubefeedPage } from './youtubefeed.page';

const routes: Routes = [
  {
    path: '',
    component: YoutubefeedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YoutubefeedPageRoutingModule {}
