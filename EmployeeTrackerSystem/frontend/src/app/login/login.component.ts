import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { first } from 'rxjs';
import { MaterialModule } from '../modules/material/material.module';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,FormsModule, CommonModule, RouterLink, MaterialModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  submitted = false
  loading = false
  loginForm!: FormGroup;
  constructor(private formBuilder: FormBuilder, private router:Router, private authService:AuthService) {}

  //convenient access to forms controls
  get f() {return this.loginForm.controls;}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['',Validators.required],
    })
  }

  onSubmit() {
    this.submitted = true

    if (this.loginForm.invalid) {
      return
    }

    this.loading = true

    this.authService.login(this.loginForm.value)
    .pipe(first())
    .subscribe(
      response => {
        alert('Login successful')
        this.router.navigate(['/employees'])
        console.log(response.token)
        localStorage.setItem("accessToken", response.token)
      }, error => {
        alert("Error")
        console.log("Error", error)
        this.loading = false
      }
    )
    

  }
}
