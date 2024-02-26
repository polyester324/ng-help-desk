import { Component } from "@angular/core";
import { DataService } from "../services/data.service";
import { Router } from "@angular/router";
import { Ticket } from "../classes/ticket.class";
import { Attachment } from "../classes/attachment.class";
import { GraphqlService } from "../services/graphql.service";
import { Apollo } from "apollo-angular";

@Component({
    selector:'app-create-ticket',
    templateUrl: './create-ticket.component.html',
    styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent{
    constructor(private dataService: DataService, private graphqlService: GraphqlService, private apollo: Apollo, private router: Router) {}
    fileInputs: any[] = [];
    category: string = "";
    name: string = "";
    description: string = "";
    urgency: string = "";
    desiredResolutionDate: string = "";
    attachmentIds: number[] = [];
    comment: string = "";
    state: string = "";

    wrongFileType: Record<number, boolean> = {};
    wrongFileSize: Record<number, boolean> = {};
    responseId: string="";

    ngOnInit(): void {
        if(!localStorage.getItem('token')){
            this.router.navigate(['/login']);
        }
        console.log("token info: " + localStorage.getItem('token'));
        this.fileInputs.push({});
    }

    handleFileInput(event: any, index: number) {     
        const file: File = event.target.files[0];
        this.wrongFileType[index] = false;
        this.wrongFileSize[index] = false;
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            this.wrongFileType[index] = true;
            return;
        }
        const maxFileSize = 5 * 1024 * 1024;
        if (file.size > maxFileSize) {
            this.wrongFileSize[index] = true;
            return;
        }
        const attachment: Attachment = new Attachment(0, file);
        this.dataService.uploadAttachment(attachment).subscribe(
            (response) => {
                console.log('File uploaded successfully:', response);
                this.responseId = "" + response;
                this.attachmentIds.push(parseInt(this.responseId));
            },
            (error) => {
                console.error('Error uploading file:', error);
            }
        );
    }

    addFileInput() {
        this.fileInputs.push({});
    }

    removeFileInput(index: number) {
        this.fileInputs.splice(index, 1);
        if (index < this.attachmentIds.length) {
            this.attachmentIds.splice(index, 1);
        }
    }
      

    allTickets(){
        this.router.navigate(['/all-tickets']);
    }

    logout(){
        this.router.navigate(['/login']);
    }

    saveAsDraft(){
        this.state = "DRAFT";
        this.createTicketByUser();
    }

    submit(){
        this.state = "NEW";
        this.createTicketByUser();
    }


    createTicketByUser(): void {
        const token = localStorage.getItem('token');
        const ticket: Ticket = new Ticket(
            this.category,
            this.name,
            this.description,
            this.urgency,
            this.desiredResolutionDate!,
            this.attachmentIds,
            this.comment,
            this.state
        );

        // this.dataService.createTicket(ticket).subscribe({
        //     next: (data: Ticket) => {
        //         this.router.navigate(['/all-tickets']);
        //     },
        //     error: error => console.log(error)
        // });
        if(token) {
            console.log(ticket)
            this.graphqlService.createTicketByUser(token, ticket.category, ticket.name, ticket.description, ticket.urgency,
                ticket.desiredResolutionDate, [...ticket.attachmentIds].join(","), ticket.comment, ticket.state).subscribe({
                    next: data => {console.log(ticket.name)},
                    error: (error) => console.error('Error fetching tickets:', error)
                })
        } else {
            console.error('Token not found!');
        }
    }
}

