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

export function generateTeamToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyTeamToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function getTeamFromToken(token) {
  const decoded = verifyTeamToken(token)
  if (!decoded) return null

  const team = await prisma.team.findUnique({
    where: { id: decoded.teamId },
    include: {
      submissions: {
        include: {
          challenge: true,
        },
      },
      flagSubmissions: {
        where: { isCorrect: true },
        include: {
          challenge: true,
        },
      },
    },
  })

  return team
}
