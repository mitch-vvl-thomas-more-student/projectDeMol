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
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
        ...canActivate(redirectUnauthorizedToLogin)
      },
      {
        path: 'kandidaten',
        loadChildren: () => import('./kandidaten/kandidaten.module').then(m => m.KandidatenPageModule),
      },
      {
        path: 'kandidaten/:id',
        loadChildren: () => import('./kandidaten/kandidaat/kandidaat.module').then( m => m.KandidaatPageModule),
      },
      {
        path: 'youtubefeed',
        loadChildren: () => import('./youtubefeed/youtubefeed.module').then(m => m.YoutubefeedPageModule),
        ...canActivate(redirectUnauthorizedToLogin)
      },
      {
        path: 'top10',
        loadChildren: () => import('./top10/top10.module').then( m => m.Top10PageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
