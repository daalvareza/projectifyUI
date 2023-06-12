import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import jwtDecode from 'jwt-decode';
import { getISOWeek, getYear } from 'date-fns';
import { Report } from 'src/app/models/report';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private API_URL = 'https://projectify-api.herokuapp.com/reports';

  constructor(private http: HttpClient) {}

  // Getter for the JWT token stored in localStorage
  private get token(): string | null {
    return localStorage.getItem('jwt');
  }

  /**
   * Function to report hours for a specific project
   * @param projectId ID of the project of the report
   * @param hours number of the hours reported
   */
  reportHours(projectId: string, hours: string): Observable<any> {
    // Headers for the HTTP request, including the Authorization header with the JWT token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    // The current user's ID, week number, and year are included in the body of the request
    const userId = this.getUserId();
    const currentDate = new Date();
    const weekNumber = getISOWeek(currentDate);
    const year = getYear(currentDate);
    const body = { userId, projectId, weekNumber, hours, year };

    // HTTP POST request is made to the API endpoint
    return this.http.post<any>(`${this.API_URL}/create`, body, {headers});
  }

  // Function to decode the user's ID from the JWT token
  getUserId() : String | undefined {
    if (this.token) {
      const userId = jwtDecode(this.token) as any;
      return userId._id;
    } else {
      return;
    }
  }

  /**
   * Function to get all the reports for a specific user
   * @param userId ID of the user
   */
  getReports(userId: string): Observable<Report[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    // HTTP GET request is made to the API endpoint with the user's ID as a query parameter
    return this.http.get<any>(`${this.API_URL}?userId=${userId}`, {headers}).pipe(
      // The 'reports' field of the response is mapped to the Observable
      map(response => response.reports)
    );
  }

  /**
   * Function to update a specific report
   * @param report Report Object to update
   */
  updateReport(report: Report): Observable<Report> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    // Only the report's ID and hours fields are included in the body of the request
    const reportReduced = {
      reportId: report._id,
      hours: report.hours 
    }
    // HTTP PUT request is made to the API endpoint
    return this.http.put<Report>(`${this.API_URL}/update`, reportReduced, {headers});
  }

  // Helper function to calculate the start date of a specific ISO week
  getDateOfISOWeek(weekNum: number, year: number) {
    let simple = new Date(year, 0, 1 + (weekNum - 1) * 7);
    let dayOfWeek = simple.getDay();
    let ISOweekStart = simple;
    if (dayOfWeek <= 4) {
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    } else {
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    }

    return ISOweekStart;
}

  // Helper function to calculate the end date of a week
  getEndOfWeek(date: Date) {
      let endOfWeek = new Date(date);
      endOfWeek.setDate(date.getDate() + 6);

      return endOfWeek;
  }

  // Helper function to format a Date object into a string
  formatDate(date: Date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
  
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }

  // Function to generate a string representing a specific week of a specific year
  getWeekString(weekNum: number, year: number) {
    const startOfWeek = this.getDateOfISOWeek(weekNum, year);
    const endOfWeek = this.getEndOfWeek(startOfWeek);
    return `${this.formatDate(startOfWeek)} - ${this.formatDate(endOfWeek)}`;
  }
}
