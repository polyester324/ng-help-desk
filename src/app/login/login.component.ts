import { Component } from "@angular/core";
import { DataService } from "../services/data.service";
import { User } from "../classes/user.class";
import { Router } from "@angular/router";
import { Login } from "../classes/login.class";
import { Apollo } from "apollo-angular";
import gql from 'graphql-tag';
import { LOGIN } from "../graphql.operations";

@Component({
    selector:'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email: string = "";
  password: string = "";
  submitAttempted: boolean = false;

  constructor(private dataService: DataService, private apollo: Apollo, private router: Router) {}

  onSubmit() {
    this.apollo.mutate({
      mutation: LOGIN,
      variables: {
        email: this.email,
        password: this.password
      }
    }).subscribe({
      next: (data: any) => {
        const token = data.data.generateToken.token;
        const message = data.data.generateToken.message;

        console.log("login message: " + message);
        localStorage.setItem('token', token);
        this.router.navigate(['/all-tickets']);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
}