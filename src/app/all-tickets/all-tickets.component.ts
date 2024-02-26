import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";
import { ITicket } from "../interfaces/ticket.interface";
import { Router } from "@angular/router";
import { Apollo } from 'apollo-angular';
import { GET_ALL_TICKETS_FOR, GET_ALL_MY_TICKETS_FOR } from "../graphql.operations";
import { HttpHeaders } from '@angular/common/http';
import { GraphqlService } from "../services/graphql.service";


@Component({
    selector: 'app-all-tickets',
    templateUrl: './all-tickets.component.html',
    styleUrls: ['./all-tickets.component.css']
})
export class AllTicketsComponent implements OnInit {
    constructor(private dataService: DataService, private graphqlService: GraphqlService, private apollo: Apollo, private router: Router) { }


    tickets: ITicket[] = [];
    flag: boolean = false;
    isInputValid: boolean = true;

    filterText: string = '';
    filteredTickets: ITicket[] = [];

    filterTable(): void {
        this.isInputValid = true;
        const isValidInput = /^[a-zA-Z0-9~.\(\),:;<>@[\]!#$%&'*+\-/=?^_`{|}]*$/.test(this.filterText);
        if (!isValidInput) {
            this.isInputValid = false;
            return;
        }

        if (!this.filterText.trim()) {
            this.filteredTickets = [...this.tickets];
        } else {
            this.filteredTickets = this.tickets.filter(ticket =>
                ticket.id.toString().toLowerCase().includes(this.filterText.toLowerCase()) ||
                ticket.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
                ticket.desiredResolutionDate.toLowerCase().includes(this.filterText.toLowerCase()) ||
                ticket.urgencyId.toLowerCase().includes(this.filterText.toLowerCase()) ||
                ticket.stateId.toLowerCase().includes(this.filterText.toLowerCase())
            );
        }
    }

    ngOnInit(): void {
        if (!localStorage.getItem('token')) {
            this.router.navigate(['/login']);
        }
        this.loadTickets();

        console.log("token info: " + localStorage.getItem('token'))
    }

    // loadTickets(): void {
    //     if (this.flag) {
    //         this.dataService.getAllTicketsMine().subscribe({
    //             next: (data: ITicket[]) => {
    //                 this.tickets = data;
    //                 this.filteredTickets = data;
    //                 this.formatTicketsDates();
    //             }
    //         });
    //     } else {
    //         this.dataService.getAllTickets().subscribe({
    //             next: (data: ITicket[]) => {
    //                 this.tickets = data;
    //                 this.filteredTickets = data;
    //                 this.formatTicketsDates();
    //             }
    //         });
    //     }
    // }

    loadTickets(): void {
        const token = localStorage.getItem('token');
        if (this.flag) {
            if (token) {
                this.graphqlService.getAllMyTicketsFor(token).subscribe(data => {
                    this.tickets = data.data.getAllMyTicketsFor;
                    this.filteredTickets = data.data.getAllMyTicketsFor;
                    this.formatTicketsDates();
                }, error => {
                    console.error('Error fetching tickets:', error);
                });
            } else {
                console.error('Token not found!');
            }
        } else {
            if (token) {
                this.graphqlService.getAllTicketsFor(token).subscribe({
                    next: data => {
                        this.tickets = data.data.getAllTicketsFor;
                        this.filteredTickets = data.data.getAllTicketsFor;
                        this.formatTicketsDates();
                    },
                    error: (error) => console.error('Error fetching tickets:', error)
                })
            } else {
                console.error('Token not found!');
            }
            // if (token) {
            //     this.graphqlService.getAllTicketsFor(token).subscribe(data => {
            //       this.tickets = data.data.getAllTicketsFor;
            //       this.filteredTickets = data.data.getAllTicketsFor;
            //       this.formatTicketsDates();
            //     }, error => {
            //       console.error('Error fetching tickets:', error);
            //     });
            //   } else {
            //     console.error('Token not found!');
            //   }
        }
    }

    createTicket(): void {
        this.router.navigate(['/create-ticket']);
    }

    getAllTickets(): void {
        this.flag = false;
        this.loadTickets();
    }

    getAllTicketsMine(): void {
        this.flag = true;
        this.loadTickets();
    }

    logout(): void {
        localStorage.removeItem('token')
        this.router.navigate(['/login']);
    }

    users(): void {
        this.router.navigate(['/users']);
    }

    idSortAsc(): void {
        this.tickets.sort((a, b) => a.id - b.id);
    }

    idSortDes(): void {
        this.tickets.sort((a, b) => b.id - a.id);
    }

    nameSortAsc(): void {
        this.tickets.sort((a, b) => a.name.localeCompare(b.name));
    }

    nameSortDes(): void {
        this.tickets.sort((a, b) => b.name.localeCompare(a.name));
    }

    urgencySortAsc(): void {
        this.tickets.sort((a, b) => this.compareUrgency(a.urgencyId, b.urgencyId));
    }

    urgencySortDes(): void {
        this.tickets.sort((a, b) => this.compareUrgency(b.urgencyId, a.urgencyId));
    }

    compareUrgency(urgencyA: string, urgencyB: string): number {
        const order = ['LOW', 'AVERAGE', 'HIGH', 'CRITICAL'];
        const indexA = order.indexOf(urgencyA);
        const indexB = order.indexOf(urgencyB);
        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
        }
        if (indexA === -1) {
            return 1;
        }
        return -1;
    }

    statusSortAsc(): void {
        this.tickets.sort((a, b) => a.stateId.localeCompare(b.stateId));
    }

    statusSortDes(): void {
        this.tickets.sort((a, b) => b.stateId.localeCompare(a.stateId));
    }

    formatTicketsDates() {
        this.tickets.forEach(ticket => {
            ticket.desiredResolutionDate = this.formatDateString(ticket.desiredResolutionDate);
        });
    }

    formatDateString(inputDateString: string): string {
        const inputDate = new Date(inputDateString);
        const day = inputDate.getDate().toString().padStart(2, '0');
        const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
        const year = inputDate.getFullYear();
        return `${day}/${month}/${year}`;
    }

    dateSortAsc(): void {
        this.tickets.sort((a, b) => {
            const dateA = this.parseCustomDateFormat(a.desiredResolutionDate)!.getTime();
            const dateB = this.parseCustomDateFormat(b.desiredResolutionDate)!.getTime();
            return dateA - dateB;
        });
    }

    dateSortDes(): void {
        this.tickets.sort((a, b) => {
            const dateA = this.parseCustomDateFormat(a.desiredResolutionDate)!.getTime();
            const dateB = this.parseCustomDateFormat(b.desiredResolutionDate)!.getTime();
            return dateB - dateA;
        });
    }

    parseCustomDateFormat(inputDateString: string): Date | null {
        const parts = inputDateString.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                return new Date(year, month, day);
            }
        }
        return null;
    }
}