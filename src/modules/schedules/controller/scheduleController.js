import { createSuccessResponse } from "../../../helper/successResponse.js"
import scheduleService from "../service/scheduleService.js"



const register= async (req,res,next)=>{
  try{
      const result = await scheduleService.register(req.body)
      const successData = createSuccessResponse(result,"Register success")
      res.status(200).json({
        successData
      })
  }catch(e){
    res.status(e.statusCode || 400).json({
      status: 'error',
      message: e.message || 'Terjadi kesalahan',
    })
  }
}

const scheduleAll = async (req,res,next)=>{
    try{
        const result = await scheduleService.getScheduleAll();
        const successData = createSuccessResponse(result,"get all schedule success")
        res.status(200).json({
            successData
        })
    }catch(e){
        res.status(e.statusCode || 400).json({
          status: 'error',
          message: e.message || 'Terjadi kesalahan',
        })
      }
}

const scheduleToday = async (req,res,next)=>{
  try{
      const result = await scheduleService.getScheduleToday();
      const successData = createSuccessResponse(result,"get schedule today success")
      res.status(200).json({
          successData
      })
  }catch(e){
      res.status(e.statusCode || 400).json({
        status: 'error',
        message: e.message || 'Terjadi kesalahan',
      })
    }
}

export default {
    register,
    scheduleAll,
    scheduleToday
}