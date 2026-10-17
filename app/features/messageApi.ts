import { baseApi } from "@/app/services/baseApi";


export const MessageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createConver: builder.mutation({
            query: (data) => ({
                url: "/New-message",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Messages"]
        }),

        AllMessage: builder.query({
            query: (conversationId) => ({
                url: `/messages/${conversationId}`,
                method: "GET"
            }),
            providesTags: ["Messages"]
        }),

        sendmessage: builder.mutation({
            query: (body) => ({
                url: "/send",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Messages", "Conversations"],
        }),

    })
})

export const { useCreateConverMutation, useAllMessageQuery, useSendmessageMutation } = MessageApi