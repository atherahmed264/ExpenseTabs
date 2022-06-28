import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  { path:'' , component:AuthenticateComponent},
  { path:'landing', component:LandingPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
