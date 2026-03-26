import { GraphQLClient } from "@refinedev/nestjs-query"; // import the class that helps us talk to the API

export const API_URL = 'https://api.crm.refine.dev' // data will come from this URL

export const clint = new GraphQLClient(API_URL, { // clinet = the part that requests data from somewhere else
    fetch: (url: string, options: RequestInit) => {
        try {
            return fetchWrapper(url, options); // fetchWrapper gives us more flexibility in designing our clint

        } catch (error) {
            return Promise.reject(error as Error)
        }
    }
})
