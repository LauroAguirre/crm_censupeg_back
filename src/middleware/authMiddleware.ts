import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import requestIp from 'request-ip'
import CriarRefreshTk from '../providers/criarRefreshTk'

import dayjs from 'dayjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default function authMiddleware (req: Request, res: Response, next: NextFunction) {
  try {
    console.log('Rodando o middleware')
    console.log(req.headers)
    const authHeader = req.headers.authorization
    const ipOrigem = requestIp.getClientIp(req)

    if (authHeader) {
      const [, token] = authHeader.split(' ')

      verify(token, process.env.JWT_TOKEN, async (error, headerToken) => {
        if (error) {
          console.log(headerToken)
          console.log('JWT inválido!')
          console.log(error)
          return res.status(401).send({ message: 'Erro de autenticação' })
        }

        console.log(headerToken)

        // const idUsuario = headerToken.userId.toString()

        // const userTk = await prisma.refreshKeys.findFirst({ where: {idUsuario, ipOrigem}})
        // const now = new Date()

        // if (!userTk) console.log('Não tem o cookie')

        // if (!userTk) {
        //   await CriarRefreshTk.createRefresh(idUsuario, token, ipOrigem)
        // } else {
        //   if (userTk.tokenAtual !== token || dayjs(userTk.dataExpiracao).isBefore(dayjs(now))) {
        //     console.log('Autenticação expirada.')
        //     console.log(`Data expiração: ${userTk?.dataExpiracao}`)
        //     console.log(`Token Header: ${token}`)
        //     console.log(`Token DB: ${userTk?.tokenAtual}`)
        //     return res.status(401).send({ message: 'Erro de autenticação' })
        //   }
        // }

        next()
      })
    }
  } catch {
    return res.status(401).send({ message: 'Expirou' })
  }
}
