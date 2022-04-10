import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

const prisma = new PrismaClient()

class CriarRefreshTk {
  async createRefresh (idFuncionario: string, tokenAtual: string, ipOrigem:string) {
    const dtExpiracao = dayjs().add(Number(process.env.DEFAULT_EXPIRATION_TIME), 'days').toDate()

    const ultimoLogin = await prisma.refreshKeys.findFirst({where:{idFuncionario, ipOrigem}})

    if(ultimoLogin){
      const novoToken = await prisma.refreshKeys.update({
        where:{
          id: ultimoLogin.id
        },
        data: {
          tokenAtual,
          dtExpiracao
        }})
      return novoToken
    } else {
      const novoToken = await prisma.refreshKeys.create({
        data:{
          dtExpiracao,
          idFuncionario,
          tokenAtual,
          ipOrigem
        }
      })

      return novoToken

    }
  }
}

export default new CriarRefreshTk()
