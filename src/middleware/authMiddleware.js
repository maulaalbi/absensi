import jwt from 'jsonwebtoken'
import { ResponseError } from '../error/responseError.js'

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ResponseError(401, 'Unauthorized: No token provided')
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Simpan data user ke req.user untuk digunakan di controller
    req.user = decoded

    next()
  } catch (error) {
    // Bisa juga next(error) kalau pakai global error handler
    res.status(401).json({
      status: 'fail',
      message: 'Unauthorized: Invalid or expired token',
    })
  }
}

export default authMiddleware
