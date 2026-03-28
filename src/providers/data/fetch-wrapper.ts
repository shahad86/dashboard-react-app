
// created custom fetch function, it will happen on top and before every fetch we make 

import { GraphQLFormattedError } from "graphql"
import { GraphQLClient } from "@refinedev/nestjs-query";
import { message } from "antd";

type Error = { 
    message: string,
    statuscode: string
}   // created our own error type

const custemFetch = async (url: string, options: RequestInit) => {
    const accessToken = localStorage.getItem('access_token'); // where web apps store a JWT (JSON Web Token) after a user logs in.

    const headers = options.headers as Record<string, string>;

    return await fetch(url, {
        ...options,
        headers: {
            ...headers, Authorization: headers?.Authorazation || `Bearer ${accessToken}`,
            "Content-type": "application/json",
            "Appllo-Require-preflight": "true",

        }
    })
}

const getGraphQLErrors = (body: Record<"errors", GraphQLFormattedError[] | undefined>):
 Error | null => {
    if (!body) {
        return {
            message: "Unknow error",
            statuscode: "INTERNAL_SERVER_ERROR"
        }
    }
    if ("errors" in body) {
        const errors = body?.errors;
        const messages = errors?.map((error) => error?.message)?.join(""); // turns all error messages into one
        const code = errors?.[0]?.extensions?.code;

        return {
            message: messages || JSON.stringify(errors),
            statuscode: code || 500 // 500 means we don't which code it is 
        }
    }

    return null;
}

export const fetchWrapper = async(url: string, options: RequestInit) => {
    const response = await custemFetch(url, options);

    const responseClone = response.clone();
    const body = await responseClone.json();

    const error = getGraphQLErrors(body);

    if(error){
        throw error;
    }

    return response;
}