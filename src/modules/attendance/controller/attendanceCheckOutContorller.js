import { createSuccessResponse } from "../../../helper/successResponse.js"
import attendanceCheckOutService from "../service/attendanceCheckOutService.js"


const register = async (req,res,next)=>{
    const user = req.user
    try{
          const result = await attendanceCheckOutService.register(req.body,user)
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

// const getAll = async (req,res,next)=>{
//     try{
//           const result = await attendanceCheckOutService.attAll()
//           const successData = createSuccessResponse(result,"Register success")
//           res.status(200).json({
//             successData
//           })
//       }catch(e){
//         res.status(e.statusCode || 400).json({
//           status: 'error',
//           message: e.message || 'Terjadi kesalahan',
//         })
//       }
// }
const getCheckOutAll = async (req,res,next)=>{
  try{
        const result = await attendanceCheckOutService.getCheckOutAll()
        const successData = createSuccessResponse(result,"get checkout all success")
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

const getCheckOutToday = async (req,res,next)=>{
  try{
        const result = await attendanceCheckOutService.getCheckOutToday();
        const successData = createSuccessResponse(result,"get checkout today success")
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
    getCheckOutAll,
    getCheckOutToday
}