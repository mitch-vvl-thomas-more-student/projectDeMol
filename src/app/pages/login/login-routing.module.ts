import { NgModule } from '@angular/core';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';

const redirectLoggedInToHome = () => redirectLoggedInTo(['tabs','home']);

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
//    ...canActivate(redirectLoggedInToHome)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
