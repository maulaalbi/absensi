import { registerValidation } from "../validation/scheduleValidation.js"
import { v4 as uuid } from "uuid";
import { ResponseError } from "../../../error/responseError.js"; // pastikan ini kamu punya
import { prismaClient } from "../../../application/database.js";
import { logger } from "../../../application/logger.js";
import QRCode from 'qrcode';
import path from 'path';
import { constants } from 'node:fs'
import dayjs from "dayjs";
import {google} from "googleapis";
import { access, mkdir } from 'node:fs/promises';
import fs from 'node:fs'; 





const register = async (body) => {
  const schedule = registerValidation.parse(body);

  const countSchedule = await prismaClient.globalSchedule.count({
    where: {
      day: schedule.day
    }
  });

  if (countSchedule === 1) {
    throw new ResponseError(400, "Schedule for this day already exists");
  }

  // Generate UUID sebagai barcode
  schedule.barcode = uuid().toString();

  const qrDir = path.resolve('qr-codes');
  try {
    await access(qrDir, constants.F_OK); // Cek apakah direktori ada
  } catch (err) {
    await mkdir(qrDir, { recursive: true }); // Jika tidak ada, buat direktori
  }
  // Buat QR Code berdasarkan barcode
  const qrPath = path.resolve('qr-codes', `${schedule.barcode}.png`);
  try {
    await QRCode.toFile(qrPath, schedule.barcode, {
      color: {
        dark: '#000000',
        light: '#ffffff'
      } 
    });
  } catch (err) {
    throw new ResponseError(500, 'Failed to generate QR code');
  }

  const gd_folder_id = '1O27hxG5RjaCH4j1eEdqLx4SMk8t0dYaz';
    const auth = new google.auth.GoogleAuth({
        credentials :  {
            "type": process.env.GOOGLE_DRIVE_TYPE,
            "project_id": process.env.GOOGLE_DRIVE_PROJECT_ID,
            "private_key_id": process.env.GOOGLE_DRIVE_PRIVATE_KEY_ID,
            "private_key": process.env.GOOGLE_DRIVE_PRIVATE_KEY,
            "client_email": process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
            "client_id": process.env.GOOGLE_DRIVE_CLIENT_ID,
            "auth_uri": process.env.GOOGLE_DRIVE_AUTH_URI,
            "token_uri": process.env.GOOGLE_DRIVE_TOKEN_URI,
            "auth_provider_x509_cert_url": process.env.GOOGLE_DRIVE_AUTH_PROVIDER,
            "client_x509_cert_url": process.env.GOOGLE_DRIVE_AUTH_CLIENT_URI,
            "universe_domain": process.env.GOOGLE_DRIVE_UNIVERSE_DOMAIN
        },
        scopes :   ['https://www.googleapis.com/auth/drive']
    })

    const driveService = google.drive({
      version : 'v3',
      auth 
  })

  const fileMetadata = {
      'name' : `${schedule.barcode}.png`,
      'parents' : [gd_folder_id]
  }

  const media = {
      mimeType : "image/png",
      body : fs.createReadStream(qrPath)
  }

  try{
    const drivefile = await driveService.files.create({
      requestBody : fileMetadata,
      media : media,
      fields : 'id'
    })

    const file_path= "https://drive.google.com/uc?id="+drivefile.data.id
    schedule.barcode = file_path

     
  }catch(err){
    throw new ResponseError(500, 'Failed to upload QR code to Google Drive');
  }

  const result = await prismaClient.globalSchedule.create({
    data: schedule,
    select: {
      day: true,
      startTime: true,
      barcode: true
    }
  });

  logger.info(
    `[Service - register] Success register schedule with this data ${JSON.stringify(result)}`
  );

  return result;
  
};


const getScheduleAll = async (body)=>{
    const scheduleAll = await prismaClient.globalSchedule.findMany({
        select : {
            day :true,
            startTime :true,
            barcode :true,
            ip :true
        }
    })

    logger.info(
        `[Service - get all schedule] Success get all schedule with this data ${JSON.stringify(scheduleAll)}`
      );
    return scheduleAll;
}

const getScheduleToday = async (body)=>{
      const startOfDay = dayjs().startOf('day').toDate(); // Awal hari (00:00:00)
      const endOfDay = dayjs().endOf('day').toDate(); 
  const scheduleAll = await prismaClient.globalSchedule.findMany({
    where : {
      createdAt: {
        gte: startOfDay, // >= Awal hari
        lte: endOfDay,   // <= Akhir hari
    },
    },
      select : {
          day :true,
          startTime :true,
          barcode :true,
          ip :true
      }
  })

  
      if (scheduleAll.length === 0) {
          logger.info(
              `[Service - get schedule today] No schedule found today (from ${startOfDay} to ${endOfDay}).`
          );
          return null; // Atau kembalikan array kosong jika klien lebih familiar dengan format tersebut
      }

  logger.info(
      `[Service - get schedule today] Success get schedule today with this data ${JSON.stringify(scheduleAll)}`
    );
  return scheduleAll;
}

export default {
  register,
  getScheduleAll,
  getScheduleToday
}
