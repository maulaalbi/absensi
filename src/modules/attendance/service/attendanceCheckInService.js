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
            startTime:true,
            ip:true
        }
    })

    if(attendance.ip !== globalSchedule.ip){
        throw new ResponseError(400, "IP not match")
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
            ip : attendance.ip
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

const getAttByCheck = async (body) => {
    const result = await prismaClient.attendance.findMany({
      select : {
        createdAt : true,
        att_public_id: true,
        checkIns:{
            select :{
                timestamp : true,
                ip : true,
                status : true
            }
        },
        checkOuts : {
            select : {
                timestamp : true,
                ip : true,
                status : true
            }
        },
        globalSchedule : {
            select : {
                sch_public_id : true,
                day : true,
                startTime : true,
                barcode : true
            }
        },
        user : {
            select : {
                user_public_id : true,
                name : true
            }
        }
      }
    });

    if (result.length === 0) {
        logger.info(
            `[Service - get att check-ins check-iout] No attendance found  .`
        );
        return null; // Atau kembalikan array kosong jika klien lebih familiar dengan format tersebut
    }
        

    logger.info(
        `[Service - get att by check] Success get att check-ins checkout with this data ${JSON.stringify(result)}`
    );

    return result;
};

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
                },
                checkIns : {
                    select :{
                        timestamp :true,
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
        },
        
       }
    })

    logger.info(
        `[Service - get checkin all] Success get checkin all with this data ${JSON.stringify(result)}`
      );
    return result;
}

const getCheckInToday = async (body) => {
    // Mendapatkan awal dan akhir hari ini
    const startOfDay = dayjs().startOf('day').toDate(); // Awal hari (00:00:00)
    const endOfDay = dayjs().endOf('day').toDate();     // Akhir hari (23:59:59)

    const result = await prismaClient.checkIn.findMany({
        where: {
            createdAt: {
                gte: startOfDay, // >= Awal hari
                lte: endOfDay,   // <= Akhir hari
            },
        },
        select: {
            ip: true,
            timestamp: true,
            status: true,
            attendance: {
                select: {
                    att_public_id: true,
                    globalSchedule: {
                        select: {
                            sch_public_id: true,
                            day: true,
                            startTime: true,
                            barcode: true,
                        },
                    },
                    user: {
                        select: {
                            user_public_id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });

    if (result.length === 0) {
        logger.info(
            `[Service - get all check-ins] No check-ins found today (from ${startOfDay} to ${endOfDay}).`
        );
        return null; // Atau kembalikan array kosong jika klien lebih familiar dengan format tersebut
    }
        

    logger.info(
        `[Service - get check-ins today] Success get  check-ins today created today (from ${startOfDay} to ${endOfDay}) with this data: ${JSON.stringify(result)}`
    );

    return result;
};




export default {
    register,
    attAll,
    getCheckInAll,
    getCheckInToday,
    getAttByCheck
}