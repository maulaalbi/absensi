import { createSuccessResponse } from "../../../helper/successResponse.js"
import authService from "../service/authService.js"


const register= async (req,res,next)=>{
  try{
      const result = await authService.register(req.body)
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

const login = async (req,res,next)=>{
  try{
    const result = await authService.login(req.body)
    res.status(200).json({
      data : result
    })
  }catch(e){
    res.status(e.statusCode || 400).json({
      status: 'error',
      message: e.message || 'Terjadi kesalahan',
    })
    
  }
}
const getMe = async (req,res,next)=>{
  try{
      const userData  = req.user;
      const result = await authService.getMe(userData.id)
      res.status(200).json({
        data : result
      })
  }catch(e){
    res.status(e.statusCode || 400).json({
      status: 'error',
      message: e.message || 'Terjadi kesalahan',
    })
  }
}

const getAlluser = async (req,res,next)=>{
  try{
    const result = await authService.getAllUser();
    res.status(200).json({
      data : result
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
  login,
  getMe,
  getAlluser
}