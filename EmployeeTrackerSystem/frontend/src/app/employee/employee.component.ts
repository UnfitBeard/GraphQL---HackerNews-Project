import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeService } from '../services/employee.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee',
  imports: [CommonModule, FormsModule, MatButtonModule, RouterLink],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {
  constructor(private employeeService: EmployeeService, private router:Router) {}
  selectedEmployee:any;
  filteredEmployeed:any[] = []

  fetchUsers() {
    this.employeeService.fetchEmployees().subscribe(
      response => this.filteredEmployeed = response
    )
  }

  deleteEmployee(employee: any) {
    this.employeeService.deleteEmployee(employee.entityId).subscribe(
      response => {
        console.log('SuccessFully deleted Employee', response)
        this.filteredEmployeed = this.filteredEmployeed.filter(e => e.entityId !== employee.entityId);
      },
      error => console.log(error)
    )
  }

  editEmployee(employee: any) {
    this.router.navigate(['/add-new-employee'], {
      state: { employee }
    });
    localStorage.setItem('employee', employee.entityId)
  }

  ngOnInit() {
    this.fetchUsers()
  }

}
