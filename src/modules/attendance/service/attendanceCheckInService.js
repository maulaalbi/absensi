import dayjs from "dayjs"
import { prismaClient } from "../../../application/database.js"
import { logger } from "../../../application/logger.js"
import requestIp from 'request-ip';
import { ResponseError } from "../../../error/responseError.js"
import { registerValidation } from "../validation/attendanceValidation.js"


const register = async (body,userData,req) => {
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
            startTime:true
        }
    })
    
    const clientIp = requestIp.getClientIp(req); // Mendapatkan IP pengguna dari request
    if (!clientIp) {
        throw new Error('Unable to get client IP');
    }

    const resultAttendance = await prismaClient.attendance.create({
        data: {
            globalScheduleId : globalSchedule.barcode,
            userId : user.user_public_id
        },
        select : {
            id : true,
            userId : true,
            globalScheduleId:true
        }
    })
    
  
    const checkIn = await prismaClient.checkIn.create({
        data : {
            attendanceId : resultAttendance.id,
            barcode : resultAttendance.globalScheduleId,
            ip : clientIp
        },
        select :{
            id:true,
            ip : true,
            timestamp : true
        }
    })

    if (dayjs(checkIn.timestamp).isAfter(dayjs(globalSchedule.startTime))) {
        await prismaClient.checkIn.update({
          where: {
            id: checkIn.id
          },
          data: {
            status: "LATE",
          },
        })
      }

      logger.info(
            `[Service - register] Success register attendance Check In with this data ${JSON.stringify(resultAttendance)} and check in ${JSON.stringify(checkIn)}`
        )

    return resultAttendance;
    
}

const attAll = async (body)=>{
    const result = await prismaClient.attendance.findMany({
        select : {
            user :{
                select :{
                    user_public_id:true,
                    name:true
                }
            },
            globalSchedule : {
                select :{
                    sch_public_id:true,
                    day:true,
                    startTime:true,
                    barcode : true
                }
            },
            checkIns: {
                select:{
                    timestamp:true,
                    ip: true,
                    status : true
                }
            },
            checkOuts : {
                select :{
                    timestamp :true,
                    ip: true,
                    status : true
                }
            }
        }
    })

    logger.info(
        `[Service - get all schedule] Success get all att with this data ${JSON.stringify(result)}`
      );
    return result;
}

const getCheckInAll = async (body)=>{
    const result = await prismaClient.checkIn.findMany({
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

    logger.info(
        `[Service - get all schedule] Success get all att with this data ${JSON.stringify(result)}`
      );
    return result;
}

export default {
    register,
    attAll,
    getCheckInAll
}