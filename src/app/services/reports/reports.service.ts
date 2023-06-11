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
  private API_URL = 'http://localhost:3000/reports';

  constructor(private http: HttpClient) {}

  private get token(): string | null {
    return localStorage.getItem('jwt');
  }

  reportHours(projectId: string, hours: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    const userId = this.getUserId();
    const currentDate = new Date();
    const weekNumber = getISOWeek(currentDate);
    const year = getYear(currentDate);
    const body = { userId, projectId, weekNumber, hours, year };
    return this.http.post<any>(`${this.API_URL}/create`, body, {headers});
  }

  getUserId() : String | undefined {
    if (this.token) {
      const userId = jwtDecode(this.token) as any;
      return userId._id;
    } else {
      return;
    }
  }

  getReports(userId: string): Observable<Report[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.get<any>(`${this.API_URL}?userId=${userId}`, {headers}).pipe(
      map(response => response.reports)
    );
  }

  updateReport(report: Report): Observable<Report> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    console.log(report);
    const reportReduced = {
      reportId: report._id,
      hours: report.hours 
    }
    return this.http.put<Report>(`${this.API_URL}/update`, reportReduced, {headers});
  }

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

  // For getting end date of the week
  getEndOfWeek(date: Date) {
      let endOfWeek = new Date(date);
      endOfWeek.setDate(date.getDate() + 6);

      return endOfWeek;
  }

  formatDate(date: Date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
  
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }

  getWeekString(weekNum: number, year: number) {
    const startOfWeek = this.getDateOfISOWeek(weekNum, year);
    const endOfWeek = this.getEndOfWeek(startOfWeek);
    return `${this.formatDate(startOfWeek)} - ${this.formatDate(endOfWeek)}`;
  }
}
