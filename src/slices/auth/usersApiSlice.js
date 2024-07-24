import { apiSlice } from '../apiSlice';
const USERS_URL = "/api/v1";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEmailCode: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/jwt/verifyEmailCode`,
                method: "POST",
                body: data
            })
        }),
        verifyEmailCode: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/jwt/verifyEmailCode/ok`,
                method: "POST",
                body: data
            })
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: `${USERS_URL}/jwt/auth`,
                method: "POST",
                body: {...credentials}
            })
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/jwt/register`,
                method: "POST",
                body: data
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/jwt/logout`,
                method: "POST",
            })
        }),
        updateUser: builder.mutation({
            query: (data) => ({
            url: `${USERS_URL}/jwt/profile`,
            method: "PUT",
            body: data,
        })
        }),
        getUsers: builder.mutation
    })
})

export const { useGetEmailCodeMutation, useVerifyEmailCodeMutation, useLoginMutation, useLogoutMutation, 
    useRegisterMutation, useUpdateUserMutation} = usersApiSlice;