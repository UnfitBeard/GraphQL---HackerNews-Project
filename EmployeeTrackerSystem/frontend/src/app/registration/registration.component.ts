import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { first, pipe } from 'rxjs';
import { MaterialModule } from '../modules/material/material.module';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterLink,
    MaterialModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  submitted = false;
  loading = false;
  registrationForm!: FormGroup

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

  get f() {
    return this.registrationForm.controls
  }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onSubmit() {
    this.submitted = true

    if (this.registrationForm.invalid) {
      return
    }

    this.loading = false

    this.authService.register(this.registrationForm.value)
    .pipe(first())
    .subscribe(
      response => {
        alert(' Registration Successful')
        this.router.navigate(['/login'])
      }, error => {
        alert('Error Registering')
        this.loading = false
      }
    )

  }

}
