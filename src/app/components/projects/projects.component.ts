import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectService } from '../../services/projects/projects.service';
import { ReportService } from '../../services/reports/reports.service';
import { Project } from 'src/app/models/project';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  // The array of projects retrieved from the service
  projects: Project[] = [];

  // A map of project id's to form groups for reporting hours on each project
  forms: { [key: string]: FormGroup; } = {};

  // The id of the currently selected project (for which the form is visible)
  selectedProject: string | null = null;

  // An error message string to display in the UI in case of error
  error: String = "";

  constructor(
    private projectService: ProjectService,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    // On initialization, fetch the projects from the service
    this.getProjects();
  }

  // Fetch the projects and create a form for each project
  getProjects(): void {
    this.projectService.getProjects().subscribe({
      next: data => {
        this.projects = data;
        this.projects.forEach(project => {
          this.forms[project._id] = new FormGroup({
            'hours': new FormControl('', [
              Validators.required,
              Validators.max(45)
            ])
          });
        });
      },
      error: error => {
        console.error(error);
      }
    });
  }

  // Toggle the visibility of the hours form for a project
  toggleForm(projectId: string) {
    if (this.selectedProject === projectId) {
      this.selectedProject = '';
      return;
    }
    this.selectedProject = projectId;
  }  

  // Report hours for a project
  reportHours(projectId: string): void {
    if (this.forms[projectId].valid) {
      this.reportService.reportHours(projectId, this.forms[projectId].value.hours).subscribe({
        next: data => {
          // On successful reporting of hours, refresh the projects
          this.getProjects();
        },
        error: error => {
          // In case of error during reporting, set the error message
          this.error = error.error.error;
        }
      });
    }
  }

  // Helper methods to be used in the template for showing validation errors

  isHoursInvalid(projectId: string): boolean {
    const projectForm = this.forms[projectId];
    if (!projectForm) {
      return false;
    }
  
    const hoursControl = projectForm.get('hours');
    if (!hoursControl) {
      return false;
    }
  
    return hoursControl.invalid && (hoursControl.dirty || hoursControl.touched);
  }
  
  isHoursRequired(projectId: string): boolean {
    const projectForm = this.forms[projectId];
    if (!projectForm) {
      return false;
    }
  
    const hoursControl = projectForm.get('hours');
    return hoursControl?.hasError('required') || false;
  }
  
  isHoursExceeded(projectId: string): boolean {
    const projectForm = this.forms[projectId];
    if (!projectForm) {
      return false;
    }
  
    const hoursControl = projectForm.get('hours');
    return hoursControl?.hasError('max') || false;
  }
}