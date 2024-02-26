import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";
import { User } from "../classes/user.class";
import { Router } from "@angular/router";
import { GET_USERS } from "../graphql.operations";
import { Apollo } from "apollo-angular";
import { IUser } from "../interfaces/user.interface";
import { Usertest } from "../classes/usertest.class";

@Component({
    selector:'users',
    templateUrl: './users.component.html',
    // styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{
    constructor(private dataService: DataService, private router: Router, private apollo: Apollo){}
    users: IUser[] = [];

    ngOnInit(): void {
        this.apollo.query<{ getAllUsers: IUser[] }>({ query: GET_USERS }).subscribe({
          next: ({ data }) => {
            console.log('Полученные данные:', data); // Проверяем, какие данные мы получаем
            if (data && data.getAllUsers) {
              this.users = data.getAllUsers;
              console.log('Пользователи:', this.users);
            } else {
              console.log('Данные о пользователях не получены или отсутствуют');
            }
          },
          error: (error) => {
            console.log('Ошибка при получении пользователей:', error);
          }
        });
      }      
}
