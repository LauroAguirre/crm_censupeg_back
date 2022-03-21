import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import requestIp from 'request-ip'
import CriarRefreshTk from '../providers/criarRefreshTk'

import dayjs from 'dayjs'
import { PrismaClient } from '@prisma/client'
import { JWTHeader } from 'src/providers/JWTHeader'

const prisma = new PrismaClient()

export default function authMiddleware (req: Request, res: Response, next: NextFunction) {
  try {
    console.log('====================================')
    console.log('Middleware')
    console.log(req.route.path)
    console.log('====================================')
    const authHeader = req.headers.authorization
    const ipOrigem = requestIp.getClientIp(req)

    if (authHeader) {
      const [, token] = authHeader.split(' ')

      verify(token, process.env.JWT_TOKEN, async (error, headerToken:JWTHeader) => {
        if (error) {
          console.log(headerToken)
          console.log('JWT inválido!')
          console.log(error)
          return res.status(401).send({ message: 'Erro de autenticação' })
        }

        const idUsuario = headerToken.userId.toString()
        const perfil = headerToken.perfil

        const userTk = await prisma.refreshKeys.findFirst({ where: {idUsuario, ipOrigem}})
        const now = new Date()

        if (!userTk) console.log('Não tem o cookie')

        if (!userTk) {
          await CriarRefreshTk.createRefresh(idUsuario, token, ipOrigem)
        } else {
          if (userTk.tokenAtual !== token || dayjs(userTk.dtExpiracao).isBefore(dayjs(now))) {
            console.log('Autenticação expirada.')
            console.log(`Data expiração: ${userTk?.dtExpiracao}`)
            console.log(`Token Header: ${token}`)
            console.log(`Token DB: ${userTk?.tokenAtual}`)
            return res.status(401).send({ message: 'Erro de autenticação' })
          }
        }

        if(perfil !== 1 ){
          const rotasGestor = [
            '/unidades/novo',
            '/unidades/:idUnidade/vincularUsuario'
          ]

          if(rotasGestor.findIndex(rota => rota === req.route.path) > -1) return res.status(401).send('Perfil não autorizado')
        }

        next()
      })
    } else {
      return res.status(401).send({ message: 'Não autenticado' })
    }
  } catch {
    return res.status(401).send({ message: 'Expirou' })
  }
}
