import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private adminUrl = `http://localhost:8080/admin`
  constructor(private http:HttpClient) { }

  register(adminData:any):Observable<any> {
    return this.http.put<any>(`${this.adminUrl}/register`,adminData)
  }

  login(adminData:any):Observable<any> {
    return this.http.post<any>(`${this.adminUrl}/login`,adminData)
  }
}
