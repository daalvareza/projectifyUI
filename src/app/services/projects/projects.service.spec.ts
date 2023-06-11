import { ProjectService } from './projects.service';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ProjectsService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform a GET request on getProjects', () => {
    service.getProjects().subscribe();

    const req = httpMock.expectOne('http://localhost:3000/projects/all');
    expect(req.request.method).toEqual('GET');
    req.flush([]);
  });

  afterEach(() => {
    httpMock.verify();
  });
});