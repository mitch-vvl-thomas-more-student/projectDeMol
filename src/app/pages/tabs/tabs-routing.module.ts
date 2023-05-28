import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { TabsPage } from './tabs.page';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./../../pages/home/home.module').then(m => m.HomePageModule),
        ...canActivate(redirectUnauthorizedToLogin)
      },
      {
        path: 'kandidaten',
        loadChildren: () => import('./../../pages/kandidaten/kandidaten.module').then(m => m.KandidatenPageModule),
      },
      {
        path: 'kandidaten/:id',
        loadChildren: () => import('./../../pages/kandidaat/kandidaat.module').then( m => m.KandidaatPageModule),
      },
      {
        path: 'youtubefeed',
        loadChildren: () => import('./../../pages/youtubefeed/youtubefeed.module').then(m => m.YoutubefeedPageModule),
        ...canActivate(redirectUnauthorizedToLogin)
      },
      {
        path: 'top10',
        loadChildren: () => import('./../../pages/top10/top10.module').then( m => m.Top10PageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
