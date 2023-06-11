import { LoginService } from './login.service';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform a POST request on login', () => {
    service.login('test', 'test').subscribe();

    const req = httpMock.expectOne('http://localhost:3000/user/login');
    expect(req.request.method).toEqual('POST');
    req.flush(null);
  });

  it('should perform a POST request on register', () => {
    service.register('test', 'test').subscribe();

    const req = httpMock.expectOne('http://localhost:3000/user/create');
    expect(req.request.method).toEqual('POST');
    req.flush(null);
  });

  afterEach(() => {
    httpMock.verify();
  });
});