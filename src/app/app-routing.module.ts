import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { DetailsComponent } from './details-page/details.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthGuard } from './Services/auth.guard';

const routes: Routes = [
  { path:'' , component:AuthenticateComponent},
  { path:'landing', component:LandingPageComponent , canActivate:[AuthGuard]},
  { path:'landing/:i',component:DetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
