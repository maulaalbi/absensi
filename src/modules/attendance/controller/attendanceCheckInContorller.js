import { createSuccessResponse } from "../../../helper/successResponse.js"
import attendanceCheckInService from "../service/attendanceCheckInService.js"


const register = async (req,res,next)=>{
    const user = req.user
    try{
          const result = await attendanceCheckInService.register(req.body,user)
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

const getAll = async (req,res,next)=>{
    try{
          const result = await attendanceCheckInService.attAll()
          const Data = createSuccessResponse(result,"Register success")
          res.status(200).json({
            Data
          })
      }catch(e){
        res.status(e.statusCode || 400).json({
          status: 'error',
          message: e.message || 'Terjadi kesalahan',
        })
      }
}

const getCheckInAll = async (req,res,next)=>{
  try{
        const result = await attendanceCheckInService.getCheckInAll()
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

const getCheckInToday = async (req,res,next)=>{
  try{
        const result = await attendanceCheckInService.getCheckInToday()
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
export default {
    register,
    getAll,
    getCheckInAll,
    getCheckInToday
}