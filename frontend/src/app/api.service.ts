import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'http://127.0.0.1:8000/'; // Url for the api request
  constructor(private http: HttpClient) { }

  /**
   * Gets the list of project by a user
   * @param token User Token
   */
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
  /**
   * Return the User token based on the username and password
   * @param username Username 
   * @param password Password of user
   */
  getToken(username: string, password: string): Observable<any> {
    let data = new FormData();
    data.append("username", username);
    data.append("password", password);
    return this.http.post(`${this.url}api-auth-token`, data);
  }
  /**
   * Saves the project and returns id of the project
   * @param name Project name
   * @param saved Saved data object as JSON String
   * @param token User Token
   */
  saveProject(name: string, saved: string, token: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Token ${token}`,
        'Access-Control-Allow-Origin': '*',
      })
    };
    // Create a Form Data
    let data = new FormData();
    data.append("name", name);
    data.append("saved", saved);
    // Do post request
    return this.http.post(`${this.url}save`, data, httpOptions);
  }
  /**
   * Update existing Project
   * @param projectId Project id
   * @param name Project name (maybe Updated)
   * @param saved Saved object as JSON String
   * @param token User Token
   */
  updateProject(projectId: string, name: string, saved: string, token: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Token ${token}`,
        'Access-Control-Allow-Origin': '*',
      })
    };
    // Add id,name,data in form data
    let data = new FormData();
    data.append("id", projectId);
    data.append("name", name);
    data.append("saved", saved);
    // Send a post request
    return this.http.post(`${this.url}update`, data, httpOptions);
  }
  /**
   * Get Project Data based on id
   * @param projectId Project id
   * @param token User Token
   */
  getProject(projectId:number,token:string){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
        'Access-Control-Allow-Origin': '*',
      })
    };
    return this.http.get(`${this.url}project?id=${projectId}`, httpOptions);
  }
}
