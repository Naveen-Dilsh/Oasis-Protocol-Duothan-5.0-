import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { prisma } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret"

export async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function getAdminFromToken(token) {
  const decoded = verifyToken(token)
  if (!decoded) return null

  const admin = await prisma.admin.findUnique({
    where: { id: decoded.adminId },
  })

  return admin
}
