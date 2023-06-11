import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProjectsComponent } from './projects.component';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectService } from '../../services/projects/projects.service';
import { ReportService } from '../../services/reports/reports.service';
import { of, throwError } from 'rxjs';
import { Project } from 'src/app/models/project';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let projectService: ProjectService;
  let reportService: ReportService;
  let projectServiceMock: any;

  beforeEach(waitForAsync(() => {
    projectServiceMock = {
      getProjects: jasmine.createSpy('getProjects').and.returnValue(of([])),
    };
    TestBed.configureTestingModule({
      declarations: [ProjectsComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ProjectService, useValue: projectServiceMock },
        { provide: ReportService, useValue: { reportHours: jasmine.createSpy('reportHours') } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService);
    reportService = TestBed.inject(ReportService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch projects on initialization', () => {
    const projectsData: Project[] = [
      { _id: '1', name: 'Project 1', description: '', users: [], reports: [] },
      { _id: '2', name: 'Project 2', description: '', users: [], reports: [] }
    ];
    (projectServiceMock.getProjects as jasmine.Spy).and.returnValue(of(projectsData));

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(projectService.getProjects).toHaveBeenCalled();
    expect(component.projects).toEqual(projectsData);
    expect(Object.keys(component.forms)).toEqual(['1', '2']);
  });

  it('should handle error when fetching projects', () => {
    const error = 'Error fetching projects';
    (projectServiceMock.getProjects as jasmine.Spy).and.returnValue(throwError(error));
    spyOn(console, 'error');

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(projectService.getProjects).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(error);
  });

  it('should toggle form when calling toggleForm', () => {
    component.toggleForm('1');
    expect(component.selectedProject).toEqual('1');

    component.toggleForm('1');
    expect(component.selectedProject).toEqual('');
  });

  it('should report hours when calling reportHours with valid form', () => {
    const projectId = '1';
    const hours = '10';
    (reportService.reportHours as jasmine.Spy).and.returnValue(of(null));
    const getProjectsSpy = spyOn(component, 'getProjects');

    component.forms[projectId] = new FormGroup({
      hours: new FormControl(hours)
    });

    component.reportHours(projectId);

    expect(reportService.reportHours).toHaveBeenCalledWith(projectId, hours);
    expect(getProjectsSpy).toHaveBeenCalled();
  });

  it('should handle error when reporting hours', () => {
    const projectId = '1';
    const hours = '10';
    const errorResponse = { error: { error: 'Error reporting hours' } };

    (reportService.reportHours as jasmine.Spy).and.returnValue(throwError(errorResponse));

    spyOn(console, 'error');
    
    component.forms[projectId] = new FormGroup({
      hours: new FormControl(hours, Validators.required)
    });

    component.reportHours(projectId);
    
    expect(reportService.reportHours).toHaveBeenCalledWith(projectId, hours);
    expect(component.error).toEqual(errorResponse.error.error);
  });

  it('should return false for isHoursInvalid when form is not found', () => {
    expect(component.isHoursInvalid('1')).toBeFalsy();
  });

  it('should return true for isHoursInvalid when form control is invalid and dirty or touched', () => {
    const projectId = '1';
    component.forms[projectId] = new FormGroup({
      hours: new FormControl('', [Validators.required])
    });
    const hoursControl = component.forms[projectId].get('hours');
    hoursControl?.markAsDirty();

    expect(component.isHoursInvalid(projectId)).toBeTruthy();

    hoursControl?.markAsTouched();

    expect(component.isHoursInvalid(projectId)).toBeTruthy();
  });

  it('should return false for isHoursInvalid when form control is valid', () => {
    const projectId = '1';
    component.forms[projectId] = new FormGroup({
      hours: new FormControl(10, [Validators.required])
    });

    expect(component.isHoursInvalid(projectId)).toBeFalsy();
  });

  it('should return false for isHoursRequired when form control is not found', () => {
    expect(component.isHoursRequired('1')).toBeFalsy();
  });

  it('should return true for isHoursRequired when form control has required error', () => {
    const projectId = '1';
    component.forms[projectId] = new FormGroup({
      hours: new FormControl('', [Validators.required])
    });

    expect(component.isHoursRequired(projectId)).toBeTruthy();
  });

  it('should return false for isHoursRequired when form control does not have required error', () => {
    const projectId = '1';
    component.forms[projectId] = new FormGroup({
      hours: new FormControl(10)
    });

    expect(component.isHoursRequired(projectId)).toBeFalsy();
  });

  it('should return false for isHoursExceeded when form control is not found', () => {
    expect(component.isHoursExceeded('1')).toBeFalsy();
  });

  it('should return true for isHoursExceeded when form control has max error', () => {
    const projectId = '1';
    component.forms[projectId] = new FormGroup({
      hours: new FormControl(50, [Validators.max(45)])
    });

    expect(component.isHoursExceeded(projectId)).toBeTruthy();
  });

  it('should return false for isHoursExceeded when form control does not have max error', () => {
    const projectId = '1';
    component.forms[projectId] = new FormGroup({
      hours: new FormControl(40, [Validators.max(45)])
    });

    expect(component.isHoursExceeded(projectId)).toBeFalsy();
  });
});