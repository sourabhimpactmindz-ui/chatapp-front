import { baseApi } from "@/app/services/baseApi";



export const converApi = baseApi.injectEndpoints({
    endpoints:(builder) => ({
        Conver:builder.query({
            query : () => ({
                url : "/conversation",
                method : "GET",
                providerTags : ["Conversation"]
            }),
        }),
    })
})


export const { useConverQuery } = converApi;