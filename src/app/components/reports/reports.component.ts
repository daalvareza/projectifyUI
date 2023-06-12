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

  // Fetch the reports on component initialization
  ngOnInit(): void {
    this.getReports().pipe(takeUntil(this.ngUnsubscribe)).subscribe();
  }

  // Clean up subscriptions on component destruction
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Fetch the reports for the current user from the server
  getReports(): Observable<any> {
    const userId = this.reportService.getUserId();
    if (userId) {
      // Use forkJoin to wait for both the user's reports and the project details to return
      return forkJoin([
        this.reportService.getReports(userId.toString()),
        this.projectService.getProjects()
      ]).pipe(
        tap(([reports, projects]) => {
          // Loop over each report
          reports.forEach((report: Report) => {
            // Find the corresponding project for this report
            const project = projects.find((project: Project) => project._id == report.project);
            // Set additional properties on the report for use in the template
            report.projectName = project ? project.name : 'Unknown';
            report.dateRange = this.reportService.getWeekString(report.weekNumber.valueOf(), report.year.valueOf());
            // Initialize edit mode for each report
            this.editMode[report._id] = false;
          });
          // Set the component's reports property to the returned reports
          this.reports = reports;
        })
      );
    }
    return of([]);
  }  

  // Toggle the edit mode for a specific report
  toggleEditMode(reportId: string): void {
    this.editMode[reportId] = !this.editMode[reportId];
  }

  // Determine if a report is editable (only if it's less than 4 weeks old)
  isEditable(report: Report): boolean {
    const reportDate = new Date(report.year.valueOf(), 0, 1 + (report.weekNumber.valueOf() - 1) * 7);
    const today = new Date();
    const differenceInTime = today.getTime() - reportDate.getTime();
    
    // Calculate the difference in weeks
    const differenceInWeeks = differenceInTime / (1000 * 3600 * 24 * 7);
    
    // If the report is less than 4 weeks old, it is editable
    return differenceInWeeks <= 4;
  }

  // Function to update a specific report
  updateReport(report: Report): void {
    // Call the updateReport service method and subscribe to the Observable it returns
    this.reportService.updateReport(report).subscribe({
      next: (updatedReport) => {
        // If the update is successful, fetch the reports again, toggle the edit mode, and remove any error flags
        this.getReports();
        this.toggleEditMode(report._id);
        this.error[report._id] = false;
      },
      error: (error: any) => {
        // If there is an error, set the error flag and store the error message
        this.error[report._id] = true;
        this.message_error = error.error.error;
      }
    });
  }
}