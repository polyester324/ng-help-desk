import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTicketsComponent } from './all-tickets/all-tickets.component';
import { LoginComponent } from './login/login.component';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'all-tickets', component: AllTicketsComponent },
  { path: 'create-ticket', component: CreateTicketComponent },
  { path: 'users', component: UsersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }