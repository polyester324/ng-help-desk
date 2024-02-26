import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
  private graphqlUrl = 'help-desk/graphql';

  constructor(private http: HttpClient) { }

  getAllTicketsFor(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.graphqlUrl, {
      query: `
        query {
          getAllTicketsFor {
            id
            name
            desiredResolutionDate
            stateId
            urgencyId
          }
        }
      `
    }, { headers });
  }

  getAllMyTicketsFor(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.graphqlUrl, {
      query: `
        query {
          getAllMyTicketsFor {
            id
            name
            desiredResolutionDate
            stateId
            urgencyId
          }
        }
      `
    }, { headers });
  }

  createTicketByUser(token: string, category: string, name: string, description: string, 
    urgency: string, desiredResolutionDate: string, attachmentIds: string, commentText: string, state: string,) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.graphqlUrl, {
      // query: `
      //   mutation {
      //     createTicketByUser (${category}: String!, ${name}: String!, ${description}: String!, 
      //       ${urgency}: String!, ${desiredResolutionDate}: String!, ${attachmentIds}: String!, 
      //       ${commentText}: String!, ${state}: String!){
      //       id
      //       name
      //     }
      //   }
      // `,
      query: `
        mutation CreateTicketByUser($category: String!, $name: String!, $description: String!, 
          $urgency: String!, $desiredResolutionDate: String!, $attachmentIds: String, 
          $commentText: String!, $state: String!) {
            createTicketByUser(dto: { category: $category, name: $name, description: $description,
                urgency: $urgency, desiredResolutionDate: $desiredResolutionDate, attachmentIds: $attachmentIds, 
                commentText: $commentText, state: $state }){
                    id
                    name
                } 
        }
      `,
      variables: {
        category: category,
        name: name,
        description: description,
        urgency: urgency,
        desiredResolutionDate: desiredResolutionDate,
        attachmentIds: attachmentIds,
        commentText: commentText,
        state: state,
      }
    }, { headers });
  }

}
