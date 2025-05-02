import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-add-new-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule
  ], templateUrl: './add-new-employee.component.html',
  styleUrl: './add-new-employee.component.scss'
})
export class AddNewEmployeeComponent {
  additionForm!: FormGroup;
  editingId!: string;

  constructor(private router: Router,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute) { }

  initializeForm(): void {
    this.additionForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required]],
      verified: ['', [Validators.required]],
      location: this.fb.group({
        longitude: ['', Validators.required],
        latitude: ['', Validators.required]
      }),
      skills: this.fb.array([this.createSkillsGroup()]),
      personalStatement: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  createSkillsGroup(): FormGroup {
    return this.fb.group({
      skill: ['', Validators.required]
    })
  }

  removeSkill(index: number) {
    this.skills.removeAt(index)
  }

  get skills(): FormArray {
    return this.additionForm.get('skills') as FormArray
  }

  addSkill(): void {
    this.skills.push(this.createSkillsGroup())
  }

  onSubmit(): void {
    if (this.additionForm.invalid) {
      this.additionForm.markAllAsTouched();
    }

    const rawValue = this.additionForm.value

    const transformedData = {
      firstName: rawValue.firstName.trim(),
      lastName: rawValue.lastName.trim(),
      age: Number(rawValue.age),
      verified: rawValue.verified === 'true' || rawValue.verified === true,
      location: {
        longitude: Number(rawValue.location.longitude),
        latitude: Number(rawValue.location.latitude)
      },
      locationUpdated: new Date().toISOString(),
      skills: rawValue.skills.map((s: { skill: string }) => s.skill),
      personalStatement: rawValue.personalStatement
    }
    const request = this.editingId
    ? this.employeeService.updateEmployee(this.editingId, transformedData)
    : this.employeeService.createEmployees(transformedData);

  request.subscribe({
    next: () => {
      alert(`${this.editingId ? 'Updated' : 'Created'} employee: ${transformedData.firstName}`);
      this.router.navigate(['/employees']);
    },
    error: (err: any) => console.error('Error submitting form:', err)
  });
    console.log(transformedData)
  }

  populateForm(employee:any):void {
    this.additionForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      age: employee.age,
      verified: employee.verified.toString(),
      location: {
        longitude: employee.location.longitude,
        latitude: employee.location.latitude
      },
      personalStatement: employee.personalStatement
    });

    this.skills.clear();
    (employee.skills || []).forEach((skill:string) => {
      this.skills.push(this.fb.group({ skill }))
    });
  }

  ngOnInit(): void {
    this.initializeForm()

    this.route.paramMap.subscribe(
      params => {
        const id = params.get('item.entityId');
        console.log(id)

        //using local storage to test
        const person = localStorage.getItem('employee')
        console.log(person)

        if (person) {
          this.employeeService.getEmployeeById(person).subscribe(
            employee => {
              this.populateForm(employee);
              this.editingId = person
            }
          )
        }
      }
    )
  }
}

