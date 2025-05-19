import adminService from "../service/adminService.js"

const login = async (req,res,next)=>{
  try{
    const result = await adminService.login(req.body)
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
      const result = await adminService.getMe(userData.id)
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
    login,
    getMe
}  