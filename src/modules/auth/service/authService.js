import { loginValidation, registerValidation } from "../validation/authValidation.js";
import { prismaClient } from "../../../application/database.js";
import { ResponseError } from "../../../error/responseError.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
import jwt from 'jsonwebtoken';
import { logger } from "../../../application/logger.js";



const register = async (body) =>{
    const user = registerValidation.parse(body)


    const countUser = await prismaClient.user.count({
        where : {
            email : user.email
        }
    })

    if(countUser === 1){
        throw new ResponseError(400,"user already")
    }

    user.password = await bcrypt.hash(user.password,10)

    const result = prismaClient.user.create({
        data : user,
        select : {
            email : true,
            name : true
        }
    })
    logger.info(
        `[Service - register] Success register user with this data ${JSON.stringify(result)}`
    )

    return result;
}

const login = async (request)=>{
    const loginData = loginValidation.parse(request);

    const user = await prismaClient.user.findFirst({
      where: { email: loginData.email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true, // Hanya untuk perbandingan password
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
      data: {
        email: user.email,
        name : user.name
      },
      token,
    };
}


const getMe = async (id) =>{
    const user = await prismaClient.user.findUnique({
        where: {
            id : id,
        },
        select : {
            name:true
        }
    })
    logger.info(
        `[Service - get Me] Success getMe with this data ${JSON.stringify(user)}`
      );
    return user;
}

const getAllUser = async ()=>{
    const user = await prismaClient.user.findMany({
        select : {
            email :true,
            name: true
        }
    })

    return user;
}

export default {
    register,
    login,
    getMe,
    getAllUser
}