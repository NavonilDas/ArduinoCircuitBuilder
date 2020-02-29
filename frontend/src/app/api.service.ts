import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'http://127.0.0.1:8000/'
  constructor(private http: HttpClient) { }

  getProjects(token: String): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
        'Access-Control-Allow-Origin': '*',
      })
    };
    return this.http.get(`${this.url}list/`, httpOptions);
  }
  getToken(username: string, password: string): Observable<any> {
    let data = new FormData();
    data.append("username", username);
    data.append("password", password);
    return this.http.post(`${this.url}api-auth-token`, data);
  }
}
