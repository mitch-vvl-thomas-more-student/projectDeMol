import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KandidaatPage } from './kandidaat/kandidaat.page';

import { KandidatenPage } from './kandidaten.page';

const routes: Routes = [
  {
        path: '',
        component: KandidatenPage
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KandidatenPageRoutingModule {}
