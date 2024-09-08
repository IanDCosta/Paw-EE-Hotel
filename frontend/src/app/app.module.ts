import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { HomeComponent } from './components/pages/home/home.component';
import { SearchComponent } from './components/partials/search/search.component';
import { HotelPageComponent } from './components/pages/hotel-page/hotel-page.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { RoomPageComponent } from './components/pages/room-page/room-page.component';
import { CustomerPageComponent } from './components/pages/customer-page/customer-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/pages/register/register.component';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SearchComponent,
    HotelPageComponent,
    FooterComponent,
    RoomPageComponent,
    CustomerPageComponent,
    LoginPageComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    //ReactiveFormsModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
