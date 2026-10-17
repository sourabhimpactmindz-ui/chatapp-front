import { baseApi } from "@/app/services/baseApi";



export const converApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
    Conver: builder.query({
      query: () => ({
        url: "/conversation",
        method: "GET",
      }),
      providesTags: ["Conversations","Messages"],
    }),

    GroupConver: builder.mutation({
        query :(data) => ({
          url : "/group/create",
          method : "POST",
          body : data
        }),
        invalidatesTags: ["Conversations"]
    })

    })
})


export const { useConverQuery , useGroupConverMutation} = converApi;