import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from 'src/app/services/login/login.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: LoginService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [LoginService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginService = TestBed.inject(LoginService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login on submit', () => {
    const loginSpy = spyOn(loginService, 'login').and.returnValue(of({ token: 'test-token' }));
    const routerNavigateSpy = spyOn(component['router'], 'navigate');

    component.loginForm.setValue({ username: 'test', password: 'test' });
    fixture.debugElement.query(By.css('form')).triggerEventHandler('submit', null);

    expect(loginSpy).toHaveBeenCalledWith('test', 'test');
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/projects']);
  });

  it('should handle login error', () => {
    const error = { error: { error: 'test-error' } };
    spyOn(loginService, 'login').and.returnValue(throwError(error));

    component.loginForm.setValue({ username: 'test', password: 'test' });
    fixture.debugElement.query(By.css('form')).triggerEventHandler('submit', null);

    expect(component.error).toEqual('test-error');
  });

  it('should call register on register', () => {
    const registerSpy = spyOn(loginService, 'register').and.returnValue(of({}));

    component.loginForm.setValue({ username: 'test', password: 'test' });
    fixture.debugElement.query(By.css('.register-button')).triggerEventHandler('click', null);

    expect(registerSpy).toHaveBeenCalledWith('test', 'test');
  });

  it('should handle register error', () => {
    const error = { error: { error: 'test-error' } };
    spyOn(loginService, 'register').and.returnValue(throwError(error));

    component.loginForm.setValue({ username: 'test', password: 'test' });
    fixture.debugElement.query(By.css('.register-button')).triggerEventHandler('click', null);

    expect(component.error).toEqual('test-error');
  });
});