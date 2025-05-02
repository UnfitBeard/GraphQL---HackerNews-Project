import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { EmployeeComponent } from './employee/employee.component';
import { LoginComponent } from './login/login.component';
import { AddNewEmployeeComponent } from './add-new-employee/add-new-employee.component';

export const routes: Routes = [
  { path: 'landing-page', component: LandingPageComponent },
  { path: '', component: LandingPageComponent },
  { path: 'employees', component: EmployeeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add-new-employee/:id', component: AddNewEmployeeComponent },
  { path: 'add-new-employee', component:AddNewEmployeeComponent},
];
