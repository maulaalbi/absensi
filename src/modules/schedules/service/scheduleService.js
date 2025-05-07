import { registerValidation } from "../validation/scheduleValidation.js"
import { v4 as uuid } from "uuid";
import { ResponseError } from "../../../error/responseError.js"; // pastikan ini kamu punya
import { prismaClient } from "../../../application/database.js";
import { logger } from "../../../application/logger.js";
import QRCode from 'qrcode';
import path from 'path';
import fs from 'node:fs';
import { mkdir } from 'node:fs/promises';
import dayjs from "dayjs";





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

    // Ensure QR directory exists
    const qrDir = path.resolve('qr-codes');
    if (!fs.existsSync(qrDir)) {
      await mkdir(qrDir);
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

  // Simpan ke database
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
