import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/reports/reports.service';
import { ProjectService } from 'src/app/services/projects/projects.service';
import { Report } from '../../models/report';
import { Project } from 'src/app/models/project';
import { Observable, Subject, forkJoin, of, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reports: Report[] = [];
  editMode: { [key: string]: boolean } = {};
  error: { [key: string]: boolean } = {};
  message_error: String = "";
  private ngUnsubscribe = new Subject<void>();

  constructor(private reportService: ReportService, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.getReports().pipe(takeUntil(this.ngUnsubscribe)).subscribe();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getReports(): Observable<any> {
    const userId = this.reportService.getUserId();
    if (userId) {
      return forkJoin([
        this.reportService.getReports(userId.toString()),
        this.projectService.getProjects()
      ]).pipe(
        tap(([reports, projects]) => {
          reports.forEach((report: Report) => {
            const project = projects.find((project: Project) => project._id == report.project);
            report.projectName = project ? project.name : 'Unknown';
            report.dateRange = this.reportService.getWeekString(report.weekNumber.valueOf(), report.year.valueOf());
            this.editMode[report._id] = false;
          });
          this.reports = reports;
        })
      );
    }
    return of([]);
  }  

  toggleEditMode(reportId: string): void {
    this.editMode[reportId] = !this.editMode[reportId];
  }

  isEditable(report: Report): boolean {
    const reportDate = new Date(report.year.valueOf(), 0, 1 + (report.weekNumber.valueOf() - 1) * 7);
    const today = new Date();
    const differenceInTime = today.getTime() - reportDate.getTime();
    
    // Calculate the difference in weeks
    const differenceInWeeks = differenceInTime / (1000 * 3600 * 24 * 7);
    
    // If the report is less than 4 weeks old, it is editable
    return differenceInWeeks <= 4;
  }

  updateReport(report: Report): void {
    this.reportService.updateReport(report).subscribe({
      next: (updatedReport) => {
        this.getReports();
        this.toggleEditMode(report._id);
        this.error[report._id] = false;
      },
      error: (error: any) => {
        this.error[report._id] = true;
        this.message_error = error.error.error;
      }
    });
  }
}
