import { Component } from "@angular/core";
import { DataService } from "../services/data.service";
import { Router } from "@angular/router";
import { Ticket } from "../classes/ticket.class";
import { Attachment } from "../classes/attachment.class";
import { GraphqlService } from "../services/graphql.service";
import { Apollo } from "apollo-angular";

@Component({
    selector:'app-ticket-info',
    templateUrl: './ticket-info.component.html',
    styleUrls: ['./ticket-info.component.css']
})
export class TicketInfoComponent{
    constructor(private graphqlService: GraphqlService, private apollo: Apollo, private router: Router) {}

    
}