import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

const prisma = new PrismaClient()

class CriarRefreshTk {
  async createRefresh (idUsuario: string, tokenAtual: string, ipOrigem:string) {
    const dataExpiracao = dayjs().add(Number(process.env.DEFAULT_EXPIRATION_TIME), 'days').toDate()

    const ultimoLogin = await prisma.refreshKeys.findFirst({where:{idUsuario, ipOrigem}})

    if(ultimoLogin){
      const novoToken = await prisma.refreshKeys.update({
        where:{
          id: ultimoLogin.id
        },
        data: {
          tokenAtual,
          dataExpiracao
        }})
      return novoToken
    } else {
      const novoToken = await prisma.refreshKeys.create({
        data:{
          dataExpiracao,
          idUsuario,
          tokenAtual,
          ipOrigem
        }
      })

      return novoToken

    }
  }
}

export default new CriarRefreshTk()
