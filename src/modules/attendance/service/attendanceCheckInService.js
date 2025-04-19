import dayjs from "dayjs"
import { prismaClient } from "../../../application/database.js"
import { logger } from "../../../application/logger.js"
import { ResponseError } from "../../../error/responseError.js"
import { registerValidation } from "../validation/attendanceValidation.js"


const register = async (body,userData) => {
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
    
    logger.info(
        `[Service - result] ${JSON.stringify(resultAttendance.id)}`
    )
    const checkIn = await prismaClient.checkIn.create({
        data : {
            attendanceId : resultAttendance.id,
            barcode : resultAttendance.globalScheduleId
        },
        select :{
            id:true,
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
            userId : true,
            globalScheduleId : true,
            globalSchedule : {
                select : {
                    startTime : true
                }
            },
            checkIns: {
                select:{
                    timestamp:true,
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

export default {
    register,
    attAll
}