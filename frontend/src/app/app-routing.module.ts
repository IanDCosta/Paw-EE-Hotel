import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { HotelPageComponent } from './components/pages/hotel-page/hotel-page.component';
import { RoomPageComponent } from './components/pages/room-page/room-page.component';
import { CustomerPageComponent } from './components/pages/customer-page/customer-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { AuthGuardGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/pages/register/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search/:searchTerm', component: HomeComponent },
  { path: 'room/:id', component: RoomPageComponent, data:{role: "customer"} ,canActivate: [AuthGuardGuard]},
  { path: 'profile', component: CustomerPageComponent, data:{role: "customer"} ,canActivate: [AuthGuardGuard] },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
