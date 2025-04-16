import {z} from 'zod';

export const registerValidation = z.object({
    day : z.string({required_error : 'day is required'}),
    startTime : z.string({required_error : 'start time is required'}),
    endTime : z.string({required_error : 'endTime is required'})
})