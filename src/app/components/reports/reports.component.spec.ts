import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsComponent } from './reports.component';
import { ReportService } from '../../services/reports/reports.service';
import { ProjectService } from '../../services/projects/projects.service';
import { of, lastValueFrom } from 'rxjs';
import { Report } from '../../models/report';
import { Project } from '../../models/project';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let reportService: jasmine.SpyObj<ReportService>;
  let projectService: jasmine.SpyObj<ProjectService>;

  beforeEach(() => {
    reportService = jasmine.createSpyObj('ReportService', ['getReports', 'getUserId', 'updateReport']);
    projectService = jasmine.createSpyObj('ProjectService', ['getProjects']);

    TestBed.configureTestingModule({
      declarations: [ReportsComponent],
      providers: [
        { provide: ReportService, useValue: reportService },
        { provide: ProjectService, useValue: projectService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    reportService = TestBed.inject(ReportService) as jasmine.SpyObj<ReportService>;
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getReports', () => {
    it('should fetch reports and projects', async () => {
      const userId = '123';
      const reports: Report[] = [{ _id: '1', user: 'testUser', project: '1', weekNumber: 1, hours: 5, year: 2023 }];
      const projects: Project[] = [{ _id: '1', name: 'Project 1', description: 'testDescription', users: [], reports: [] }];

      reportService.getUserId.and.returnValue(userId);
      reportService.getReports.and.returnValue(of(reports));
      reportService.getWeekString = jasmine.createSpy().and.returnValue('Week 1 of 2023');
      projectService.getProjects.and.returnValue(of(projects));

      await lastValueFrom(component.getReports());

      expect(reportService.getUserId).toHaveBeenCalled();
      expect(reportService.getReports).toHaveBeenCalledWith(userId);
      expect(projectService.getProjects).toHaveBeenCalled();
      expect(component.reports).toEqual(reports);
      expect(component.editMode).toEqual({ '1': false });
    });
  });

  describe('toggleEditMode', () => {
    it('should toggle the edit mode of the specified report', () => {
      component.editMode = { '1': false };

      component.toggleEditMode('1');

      expect(component.editMode['1']).toBe(true);
    });

    it('should toggle the edit mode off if it was previously on', () => {
      component.editMode = { '1': true };

      component.toggleEditMode('1');

      expect(component.editMode['1']).toBe(false);
    });
  });

  describe('isEditable', () => {
    beforeEach(() => {
        jasmine.clock().install();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should return true if the report is editable', () => {
        jasmine.clock().mockDate(new Date(2023, 1, 1));

        const report: Report = { _id: '1', user: 'testUser', project: '1', weekNumber: 3, hours: 5, year: 2023 };
        const result = component.isEditable(report);

        expect(result).toBe(true);
    });

    it('should return false if the report is not editable', () => {
        jasmine.clock().mockDate(new Date(2023, 1, 1));

        const report: Report = { _id: '1', user: 'testUser', project: '1', weekNumber: 1, hours: 5, year: 2023 };
        const result = component.isEditable(report);

        expect(result).toBe(false);
    });
  });

  describe('updateReport', () => {
    it('should update the report and refresh the reports list', () => {
      const report: Report = { _id: '1', user: 'testUser', project: '1', weekNumber: 1, hours: 5, year: 2023 };

      const updateReportSpy = reportService.updateReport.and.returnValue(of(report));
      const getReportsSpy = spyOn(component, 'getReports');
      const toggleEditModeSpy = spyOn(component, 'toggleEditMode');

      component.updateReport(report);

      expect(updateReportSpy).toHaveBeenCalledWith(report);
      expect(getReportsSpy).toHaveBeenCalled();
      expect(toggleEditModeSpy).toHaveBeenCalledWith('1');
    });
  });
});