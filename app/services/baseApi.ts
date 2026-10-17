import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3005/api",
  credentials: "include",
});

const baseQueryWithRefresh = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/refresh",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data?.status) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      window.location.href = "/login";
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRefresh,
  tagTypes : ["Messages","Conversations"],
  endpoints: () => ({}),
});