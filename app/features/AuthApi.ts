import { baseApi } from "../services/baseApi";


export  const authApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        login:builder.mutation({
            query:(data) => ({
                url : "/login",
                method:"POST",
                body : data
            }),
        }),

        Signup:builder.mutation({
            query:(data) => ({
                    url : "/signup",
                    method:"POST",
                    body:data
                }),
            }),

        GetMe : builder.query({
            query : () => ({
                url : "/me",
                method : "GET",
                providesTags : ["Profile"]
            }),
        }),

        UpdateProfile : builder.mutation({
            query : (formdata) => ({
                url : "/profile",
                method : "PUT",
                body : formdata
            }),
            invalidatesTag : ["Profile"],
        }),

       

        Logout : builder.mutation({
            query : () => ({
                url : "/logout",
                method: "POST",
            })
        })
    })
    })

export const { useLoginMutation , useSignupMutation , useGetMeQuery , useUpdateProfileMutation, useLogoutMutation  } = authApi;