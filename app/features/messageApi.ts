import { baseApi } from "@/app/services/baseApi";


export const MessageApi = baseApi.injectEndpoints({
    endpoints:(builder) => ({
        createConver:builder.mutation({
            query:(data) => ({
                url:"/New-message",
                method: "POST",
                body: data,
            }),
        }),

        AllMessage:builder.query({
            query:(conversationId) => ({
                url:`/messages/${conversationId}`,
                method: "GET"
            }),
        }),

        Sendmessage :builder.mutation({
            query : ({receiverId , text}) => ({
                url : `/send/${receiverId}`,
                method : "POST",
                body : {
                    text : text,
                },
            }),
        }),

    })
})

export const {useCreateConverMutation , useAllMessageQuery , useSendmessageMutation} = MessageApi