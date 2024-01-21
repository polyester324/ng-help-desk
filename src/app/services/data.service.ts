import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../classes/user.class';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient){}

  login(user:User){
    const body = {email: user.email, password: user.password};
    return this.http.post("http://localhost:8082/help-desk/login", body);
  }

  getAllTickets(){
    return this.http.get('http://localhost:8082/help-desk/ticket')
  }
}
