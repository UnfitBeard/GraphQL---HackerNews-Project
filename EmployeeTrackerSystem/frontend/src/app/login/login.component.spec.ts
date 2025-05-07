import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any
  let mockRouter: any
  let mockActivatedRoute:any

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.ngOnInit(); //manual calling of ngOnInit
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call login service if form is invalid', ()=>{
    component.loginForm.setValue({username: '', password: ''});
    component.onSubmit();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should call login and navigate on success', ()=>{
    const mockToken = 'test-token';
    spyOn(mockAuthService, 'login').and.returnValue(of({ token: 'abc123' }));
    component.loginForm.setValue({username: 'adminuser', password: 'securePassword123'})
    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      username: 'adminuser',
      password: 'securePassword123'
    })

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employees'])
    expect(localStorage.getItem('accessToken')).toBe(mockToken)
  })


});
