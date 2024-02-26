import { gql } from "apollo-angular";

export const GET_USERS = gql`
    query GetAllUsers {
        getAllUsers {
            id
            firstName
            lastName
        }
    }
`

export const LOGIN = gql`
    mutation GenerateToken($email: String!, $password: String!) {
        generateToken(authRequest: { email: $email, password: $password }) {
            token
            message
        }
    }
`
export const CREATE_TICKET = gql`
    mutation CreateTicketByUser($category: String!, $name: String!, $description: String!, 
        $urgency: String!, $desiredResolutionDate: String!, $attachmentIds: String!, 
        $commentText: String!, $state: String!) {
            createTicketByUser(dto: { category: $category, name: $name, description: $description,
                urgency: $urgency, desiredResolutionDate: $desiredResolutionDate, attachmentIds: $attachmentIds, 
                commentText: $commentText, state: $state }){
                    id
                    name
                } 
        }
`


export const GET_ALL_TICKETS_FOR = gql`
    query GetAllTicketsFor {
        getAllTicketsFor {
            id
            name
            desiredResolutionDate
            stateId
            urgencyId
        }
    }
`

export const GET_ALL_MY_TICKETS_FOR = gql`
    query GetAllMyTicketsFor {
        getAllMyTicketsFor {
            id
            name
            desiredResolutionDate
            stateId
            urgencyId
        }
    }
`


  