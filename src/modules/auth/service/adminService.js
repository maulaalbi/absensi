import { loginValidation, registerValidation } from "../validation/authValidation.js";
import { prismaClient } from "../../../application/database.js";
import { ResponseError } from "../../../error/responseError.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
import jwt from 'jsonwebtoken';
import { logger } from "../../../application/logger.js";


const login = async (request)=>{
    try{
    const loginData = loginValidation.parse(request);

    const user = await prismaClient.user.findFirst({
      where: { email: loginData.email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true, // Hanya untuk perbandingan password
        role : true
      },
    });
  
    // Jika user tidak ditemukan
    if (!user) {
      throw new ResponseError(400,'Email or password wrong');
    }
  
    // Memeriksa password
    const passwordCheck = await bcrypt.compare(loginData.password, user.password);
    if (!passwordCheck) {
      throw new ResponseError('Email or Password wrong');
    }
    
    if(user.role !== 'admin'){
      throw new ResponseError(400,'This account is not admin')
    }

    // Membuat payload untuk token JWT
    const payload = {
      id: user.id,
      email: user.email,
      name : user.name
    };
  
    // Membuat token JWT
    const secret = process.env.JWT_SECRET;
    const expiresIn = 60 * 60 * 1; // 1 jam
    const token = jwt.sign(payload, secret, { expiresIn });

   logger.info(
      `[Service - login] Success login with this data ${JSON.stringify(payload.email)}`
    );
    // Mengembalikan data user dan token
    return {
      
      email: user.email,
      name : user.name,
      token,
    };
    }catch(e){
        throw new ResponseError(e.statusCode || 400,e.message || 'Terjadi kesalahan')
    }
}

const getMe = async (id) =>{
    const user = await prismaClient.user.findUnique({
        where: {
            id : id,
        },
        select : {
            name:true,
            role:true
        }
    })
    logger.info(
        `[Service - get Me] Success getMe with this data ${JSON.stringify(user)}`
      );
    return user;
}

export default {
    login,
    getMe
}
