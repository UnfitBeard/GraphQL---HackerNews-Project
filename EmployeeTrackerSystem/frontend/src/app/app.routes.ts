import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { EmployeeComponent } from './employee/employee.component';
import { LoginComponent } from './login/login.component';
import { AddNewEmployeeComponent } from './add-new-employee/add-new-employee.component';
import { RegistrationComponent } from './registration/registration.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'landing-page', component: LandingPageComponent },
  { path: '', component: LandingPageComponent },
  { path: 'employees', component: EmployeeComponent, canActivate:[authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent},
  { path: 'add-new-employee/:id', component: AddNewEmployeeComponent,canActivate:[authGuard] },
  { path: 'add-new-employee', component:AddNewEmployeeComponent, canActivate:[authGuard]},
];
