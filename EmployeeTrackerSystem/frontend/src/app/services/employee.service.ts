import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeeURL = `http://localhost:8080/persons`
  private personURL = `http://localhost:8080/person`

  constructor(private http:HttpClient) { }

  fetchEmployees():Observable<any> {
    return this.http.get(`${this.employeeURL}/all`)
  }

  getEmployeeById(id:string): Observable<any> {
    return this.http.get<any>(`${this.personURL}/${id}`)
  }

  deleteEmployee(entityId: any) {
    return this.http.delete(`${this.employeeURL}/${entityId}`, {responseType: 'text'})
  }

  createEmployees(employeeData:any):Observable<any> {
    return this.http.put(`${this.personURL}`, employeeData)
  }

  updateEmployee(employeeId:string, employeeData:any) {
    return this.http.post(`${this.personURL}/${employeeId}`, employeeData)
  }
}
