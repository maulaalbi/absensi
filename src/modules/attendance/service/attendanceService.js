import { prismaClient } from "../../../application/database"
import { logger } from "../../../application/logger"
import { ResponseError } from "../../../error/responseError"
import { registerValidation } from "../validation/attendanceValidation"


const register = async (body,user) => {
    const attendance = registerValidation.parse(body)

    const globalSchedule = await prismaClient.globalSchedule.findUnique({
        where : {
            barcode : attendance.globalScheduleId
        },
        select : {
            id :true,
            barcode : true
        }
    })
    const countAtt = await prismaClient.attendance.count({
        where : {
            globalScheduleId : globalSchedule.id,
            userId : user.id
        }
    })

    if(countAtt ===1){
        throw ResponseError(400,"Sudah Hadir")
    }

    const result = await prismaClient.attendance.create({
        data: {
            globalScheduleId : globalSchedule,
            userId : user.id
        }
    })

      logger.info(
            `[Service - register] Success register attendance with this data ${JSON.stringify(result)}`
        )

    return result;
    
}