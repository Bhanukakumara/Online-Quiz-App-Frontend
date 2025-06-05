import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { RequestUser } from '../models/request-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  addUser(user:User):Observable<any>{
    return this.http.post('http://localhost:8080/api/user/create',user);
  }

  getAllUsers():Observable<RequestUser[]>{
    return this.http.get<RequestUser[]>('http://localhost:8080/api/user/get-all');
  }

  /** Search users by username */
  searchByUsername(query: string): Observable<RequestUser> {
    // Adjust the endpoint to whatever your backend expects
    return this.http.get<RequestUser>(`http://localhost:8080/api/user/get-by-username/${query}`);
  }

  /** Search users by email */
  searchByEmail(query: string): Observable<RequestUser> {
    return this.http.get<RequestUser>(`http://localhost:8080/api/user/get-by-email/${query}`);
  }
}
