import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { verify } from 'jsonwebtoken'
import { JWTHeader } from '../providers/JWTHeader'

const prisma = new PrismaClient()
class AgendamentosController {
  async agendarAtividade (req: Request, res: Response): Promise<Response> {
    try {
      const { descricao, dtAgendamento, tipoAtividade, idCandidato, idEmpresa } = req.body

      const authHeader = req.headers.authorization
      const [, token] = authHeader.split(' ')

      verify(token, process.env.JWT_TOKEN, async (error, headerToken:JWTHeader) => {
        if (error) {
          return res.status(401).send({ message: 'Funcionário não encontrado' })
        }

        const idFuncionario = headerToken.userId.toString()
        const funcionario = await prisma.funcionarios.findFirst({
          where:{ id: idFuncionario }
        })

        if(!funcionario) return res.status(400).send('Funcionário não encontrado')

          const agendamento = await novoAgendamento({
            id: null,
            concluida: false,
            dtConclusao: null,
            dtAgendamento,
            idFuncionario,
            tipoAtividade,
            descricao,
            idCandidato,
            idEmpresa
          })

        return res.status(200).send(agendamento)

      })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async editarAgendamento (req:Request, res: Response): Promise<Response> {
    try {
      const { descricao, dtAgendamento, tipoAtividade, idCandidato, idEmpresa } = req.body
      const { idAgendamento } = req.params

      const agendamento = await prisma.agendamentos.update({
        where: {id: idAgendamento.toString()},
        data:{
          descricao,
          dtAgendamento,
          tipoAtividade,
          candidato: {
            connect: {
              id: idCandidato
            }
          },
          empresa: {
            connect: {
              id: idEmpresa
            }
          }
        },
        include:{
          candidato:true,
          empresa:true
        }
      })

      return res.status(200).send(agendamento)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async getAgendamentosPorPeriodo (req: Request, res: Response): Promise<Response> {
    try {
      const { dtInicio, dtFim, idFuncionario } = req.query

      const agendamentos = await prisma.agendamentos.findMany({
        where: {
          idFuncionario: idFuncionario.toString(),
          dtAgendamento: {
            gte: new Date(dtInicio.toLocaleString()),
            lte: new Date(dtFim.toLocaleString())
          }
        },
        orderBy: {
          dtAgendamento: 'desc'
        }
      })

      return res.status(200).send(agendamentos)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }
}

export async function novoAgendamento (agendamento:any): Promise<any> {
  try {
    const novoAgendamento = await prisma.agendamentos.create({
      data: {
        dtAgendamento: agendamento.dtAgendamento,
        funcionario: {
          connect: {
            id: agendamento.idFuncionario
          }
        },
        tipoAtividade: agendamento.tipoAtividade,
        descricao: agendamento.descricao,
        candidato: {
          connect: {
            id: agendamento.idCandidato
          }
        },
        empresa: {
          connect: {
            id: agendamento.idEmpresa
          }
        }
      },
    })

    return novoAgendamento
  } catch (error) {
    throw new Error(error);
  }

}

export default new AgendamentosController()
