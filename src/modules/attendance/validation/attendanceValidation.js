import {z} from 'zod';

export const registerValidation = z.object({
    globalScheduleId : z.string({required_error : 'day is required'}),
    ip : z.string({required_error : 'day is required'}),
   
})