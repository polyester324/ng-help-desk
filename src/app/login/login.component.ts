import { Component } from "@angular/core";
import { DataService } from "../services/data.service";

@Component({
    selector:'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent{
    email:string=""
    password:string=""
    constructor(private dataService: DataService){}
    onSubmit() {
    console.log(this.password); 
    }
}