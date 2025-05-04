import {z} from 'zod';

export const registerValidation = z.object({
    day : z.string({required_error : 'day is required'}),
    startTime : z.string({required_error : 'start time is required'}),
    ip : z.string({required_error : 'ip is required'}),
})