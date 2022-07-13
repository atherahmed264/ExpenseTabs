import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule , HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { InterceptorService } from './Services/interceptor.service';


@NgModule({
  declarations: [
    AppComponent,
    AuthenticateComponent,
    LandingPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:InterceptorService,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
