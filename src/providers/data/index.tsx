import { GraphQLClient } from "@refinedev/nestjs-query"; // import the class that helps us talk to the API
import { createClient } from "graphql-ws";
import { fetchWrapper } from "./fetch-wrapper";

export const API_BASe_URL = 'https://api.crm.refine.dev'
export const API_URL = 'https://api.crm.refine.dev' // data will come from this URL
export const WS_URL = 'wss://api.crm.refine.dev/graphql'

export const clint = new GraphQLClient(API_URL, { // clinet = the part that requests data from somewhere else
    fetch: (url: string, options: RequestInit) => {
        try {
            return fetchWrapper(url, options); // fetchWrapper gives us more flexibility in designing our clint

        } catch (error) {
            return Promise.reject(error as Error)
        }
    }
})

export const wsClint = typeof window !== "undefined"
 ? createClient({
    url: WS_URL,
    connectionParams: () => {
        const accessToken = localStorage.getItem("access_token");

        return {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }
    }
 })
 : undefined