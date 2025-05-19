import {z} from 'zod';

export const registerValidation = z.object({
    email : z.string({required_error : 'email is required'}),
    name : z.string({required_error : 'name is required'}),
    password : z.string({required_error : 'password is required'})
    
})

export const loginValidation = z.object({
    email: z.string({required_error: 'email is required'}),
    password: z.string({required_error: 'password is required'})
})