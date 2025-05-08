import dayjs from "dayjs"
import { prismaClient } from "../../../application/database.js"
import { logger } from "../../../application/logger.js"
import bcrypt from "bcrypt";
import { ResponseError } from "../../../error/responseError.js"
import { registerValidation } from "../validation/attendanceValidation.js"


const register = async (body,userData) => {
    try{
        const attendance = registerValidation.parse(body)
    const user = await prismaClient.user.findUnique({
        where: {
            id : userData.id,
        },
        select : {
            user_public_id:true,
            name:true
        }
    })

    const globalSchedule = await prismaClient.globalSchedule.findUnique({
        where : {
            barcode : attendance.globalScheduleId
        },
        select : {
            id :true,
            barcode : true,
            startTime:true,
            ip:true
        }
    })


    const resultAttendance = await prismaClient.attendance.findFirst({
        where: {
            globalScheduleId : globalSchedule.barcode,
            userId : user.user_public_id
        },
        select : {
            id : true,
            userId : true,
            globalScheduleId:true
        }
    })
    
     const checkOutCheck = await prismaClient.checkOut.count({
            where : {
                attendanceId : resultAttendance.id,
                barcode : resultAttendance.globalScheduleId
            }
        })  
        if(checkOutCheck >= 1){
            throw new ResponseError(400,"User already check out")
        }

        if(attendance.ip !== globalSchedule.ip){
            throw new ResponseError(400, "IP not match")
        }
    
    const checkOut = await prismaClient.checkOut.create({
        data : {
            attendanceId : resultAttendance.id,
            barcode : resultAttendance.globalScheduleId,
            ip : attendance.ip

        },
        select :{
            id:true,
            ip:true,
            timestamp : true
        }
    })

    const updateStatus = await prismaClient.checkOut.update({
        where :{
            id : checkOut.id
        },
        data:{
            status : "Left Office"
        }
    })

      logger.info(
            `[Service - register] Success register attendance Check Out with this data ${JSON.stringify(resultAttendance)} and check in ${JSON.stringify(checkOut)}`
        )

    return resultAttendance;
    
    }catch(e){
        throw new ResponseError(400, e.message)
    }
}

const getCheckOutAll = async (body)=>{
    const result = await prismaClient.checkOut.findMany({
        select : {
         ip : true,
         timestamp : true,
         status : true,
         attendance : {
             select :{
                 att_public_id : true,
                 globalSchedule:{
                     select :{
                         sch_public_id:true,
                         day:true,
                         startTime:true,
                         barcode : true
                     }
                 },
                 user :{
                     select :{
                         user_public_id:true,
                         name:true
                     }
                 }
             }
         },
         
        }
     })

     if (result.length === 0) {
        logger.info(
            `[Service - get all check-out] No check-out found).`
        );
        return null; // Atau kembalikan array kosong jika klien lebih familiar dengan format tersebut
    }

    logger.info(
        `[Service - get all checkout] Success get checkout with this data ${JSON.stringify(result)}`
      );
    return result;
}

const getCheckOutToday = async (body)=>{
        const startOfDay = dayjs().startOf('day').toDate(); // Awal hari (00:00:00)
        const endOfDay = dayjs().endOf('day').toDate();     // Akhir hari (23:59:59)
    
    const result = await prismaClient.checkOut.findMany({
        where:{
            createdAt : {
                gte : startOfDay,
                lte : endOfDay
            }
        },
        select : {
         ip : true,
         timestamp : true,
         status : true,
         attendance : {
             select :{
                 att_public_id : true,
                 globalSchedule:{
                     select :{
                         sch_public_id:true,
                         day:true,
                         startTime:true,
                         barcode : true
                     }
                 },
                 user :{
                     select :{
                         user_public_id:true,
                         name:true
                     }
                 }
             }
         },
         
        }
     })

     if (result.length === 0) {
        logger.info(
            `[Service - get all check-out] No check-out found today).`
        );
        return null; // Atau kembalikan array kosong jika klien lebih familiar dengan format tersebut
    }

    logger.info(
        `[Service - get checkout today] Success get checkout with this data ${JSON.stringify(result)}`
      );
    return result;
}
export default {
    register,
    getCheckOutAll,
    getCheckOutToday
}