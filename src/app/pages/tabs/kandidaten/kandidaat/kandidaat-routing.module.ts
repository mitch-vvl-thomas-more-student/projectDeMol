import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KandidaatPage } from './kandidaat.page';

const routes: Routes = [
  {
    path: '',
    component: KandidaatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KandidaatPageRoutingModule {}
