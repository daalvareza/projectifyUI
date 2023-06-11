import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsUrl = 'https://projectify-api.herokuapp.com/projects/all'; // URL to web api

  constructor(private http: HttpClient) { }

  /** GET: get projects from the server */
  getProjects(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt')}` // add the JWT to the headers
    });
    return this.http.get<any>(this.projectsUrl, {headers}).pipe(
      map(response => response.projects)
    );
  }
}
