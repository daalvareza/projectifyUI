import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl = 'http://localhost:3000/user/login';
  private registerUrl = 'http://localhost:3000/user/create';

  constructor(private http: HttpClient) { }

  /** POST: login to the server */
  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(this.loginUrl, {username, password}, {headers});
  }

  /** POST: register a new user to the server */
  register(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(this.registerUrl, {username, password}, {headers});
  }
}
