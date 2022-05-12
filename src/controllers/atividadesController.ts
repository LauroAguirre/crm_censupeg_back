import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { verify } from 'jsonwebtoken'
import { JWTHeader } from '../providers/JWTHeader'
import { novoAgendamento } from './agendamentosController'

const prisma = new PrismaClient()
const CONTATO_CANDIDATO = 1
const CONTATO_EMPRESA = 2
class AtividadesController {
  async atividade (req: Request, res: Response): Promise<Response>{
    try {
      const { descricao, dtAtividade } = req.body

      const authHeader = req.headers.authorization
      const [, token] = authHeader.split(' ')

      verify(token, process.env.JWT_TOKEN, async (error, headerToken:JWTHeader) => {
        if (error) {
          return res.status(401).send({ message: 'Usuário não encontrado' })
        }

        const idFuncionario = headerToken.userId.toString()
        const funcionario = await prisma.funcionarios.findFirst({
          where:{ id: idFuncionario }
        })

        if(!funcionario) return res.status(400).send('Funcionário não encontrado')
          const atividade = await prisma.atividades.create({
            data: {
              dtAtividade: dtAtividade,
              funcionario: {
                connect: {
                  id: idFuncionario
                }
              },
              descricao
            },
          })

        return res.status(200).send(atividade)

      })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async contatoEmpresa (req: Request, res: Response): Promise<Response> {
    try {
      const { idEmpresa, dtContato, areasInteresse, proxContato, infosContato, statusAtendimento, comentProxContato, idAgendamento } = req.body

      const authHeader = req.headers.authorization
      const [, token] = authHeader.split(' ')

      verify(token, process.env.JWT_TOKEN, async (error, headerToken:JWTHeader) => {
        if (error) {
          return res.status(401).send({ message: 'Usuário não encontrado' })
        }

        const idFuncionario = headerToken.userId.toString()
        const funcionario = await prisma.funcionarios.findFirst({
          where:{ id: idFuncionario }
        })

        if(!funcionario) return res.status(400).send('Funcionário não encontrado')
        const agora = new Date()
          //Salvando o contato
        const contato = await prisma.contatoEmpresas.create({
          data: {
            empresa: {
              connect: {
                id: idEmpresa
              }
            },
            funcionario: {
              connect: {
                id: idFuncionario
              }
            },
            dtContato,
            areasInteresse,
            proxContato,
            infosContato,
            statusAtendimento,
            comentProxContato
          },
        })

        //Atualizando o ultimo contato na empresa
        await prisma.empresas.update({
          where: {id:idEmpresa},
          data:{
            funcionarioUltContato: {
              connect: {
                id: idFuncionario
              }
            },
            dtUltContato: agora
          }
        })

        //Atualiza o status do agendamento (quando houver)
        if(idAgendamento){
          await prisma.agendamentos.update({
            where: {
              id: idAgendamento
            },
            data:{
              concluida: true,
              dtConclusao: new Date()
            }
          })
        }

        if (proxContato){
          await novoAgendamento({
            id: null,
            concluida: false,
            dtConclusao: null,
            dtAgendamento: proxContato,
            idFuncionario,
            tipoAtividade: CONTATO_EMPRESA,
            descricao: comentProxContato,
            idEmpresa,
            idCandidato: undefined
          })
        }

        return res.status(200).send(contato)

      })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async contatoCandidato (req: Request, res: Response): Promise<Response> {
    try {
      const { idCandidato, dtContato, edital, cursosInteresse, proxContato, infosContato, statusAtendimento, comentProxContato, idAgendamento } = req.body

      const authHeader = req.headers.authorization
      const [, token] = authHeader.split(' ')

      const cursosList = cursosInteresse ? cursosInteresse : []

      verify(token, process.env.JWT_TOKEN, async (error, headerToken:JWTHeader) => {
        if (error) {
          return res.status(401).send({ message: 'Usuário não encontrado' })
        }

        const idFuncionario = headerToken.userId.toString()
        const funcionario = await prisma.funcionarios.findFirst({
          where:{ id: idFuncionario }
        })

        if(!funcionario) return res.status(400).send('Funcionário não encontrado')
        const agora = new Date()
          //Salvando o contato
        const contato = await prisma.contatoCandidatos.create({
          data: {
            candidato: {
              connect: {
                id: idCandidato
              }
            },
            funcionario: {
              connect: {
                id: idFuncionario
              }
            },
            dtContato,
            edital,
            proxContato,
            infosContato,
            statusAtendimento,
            comentProxContato
          },
        })

        //Atualizando o ultimo contato na empresa
        await prisma.candidatos.update({
          where: {id:idCandidato},
          data:{
            funcionarioUltContato: {
              connect: {
                id: idFuncionario
              }
            },
            dtUltContato: agora,
            cursosInteresse: {
              connectOrCreate: cursosList.map((curso: number) => {
                  return {
                    where: {
                      idCurso_idCandidato: {
                        idCurso: curso,
                        idCandidato: idCandidato
                      }
                    },
                    create: {
                      idCurso: curso,
                    },
                  };
              }),
              deleteMany: {
                NOT: cursosList.map((curso: number) => ({ idCandidato: idCandidato, idCurso: curso })),
              }
            },
          }
        })

        //Atualiza o status do agendamento (quando houver)
        if(idAgendamento){
          await prisma.agendamentos.update({
            where: {
              id: idAgendamento
            },
            data:{
              concluida: true,
              dtConclusao: new Date()
            }
          })
        }

        if(proxContato){
          await novoAgendamento({
            id: null,
            concluida: false,
            dtConclusao: null,
            dtAgendamento: proxContato,
            idFuncionario,
            tipoAtividade: CONTATO_CANDIDATO,
            descricao: comentProxContato,
            idEmpresa: undefined,
            idCandidato
          })
        }

        return res.status(200).send(contato)
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async getHistoricoContatoCandidato (req: Request, res: Response): Promise<Response> {
    try {
      const { pagina, porPagina } = req.query
      const { idCandidato } = req.params

      console.log(req.query)

      const historico = await prisma.contatoCandidatos.findMany({
        where: {
          idCandidato,

        },
        orderBy: {
          dtContato: 'desc'
        },
        take: Number(porPagina),
        skip: ( Number(pagina) - 1) * Number(porPagina),
        include: {
          funcionario: true
        }
      })

      return res.status(200).send(historico)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async getHistoricoContatoEmpresa (req: Request, res: Response): Promise<Response> {
    try {
      const { pagina, porPagina } = req.query
      const { idEmpresa } = req.params

      console.log(req.query)

      const historico = await prisma.contatoEmpresas.findMany({
        where: {
          idEmpresa,
        },
        orderBy: {
          dtContato: 'desc'
        },
        take: Number(porPagina),
        skip: ( Number(pagina) - 1) * Number(porPagina),
        include: {
          funcionario: true
        }
      })

      return res.status(200).send(historico)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async getHistoricoContatoCandidatoPorData (req: Request, res: Response): Promise<Response> {
    try {
      const { dtInicio, dtFim } = req.query
      const { idCandidato } = req.params

      console.log(req.query)

      const histtorico = await prisma.contatoCandidatos.findMany({
        where: {
          idCandidato,
          dtContato: {
            gte: new Date(dtInicio.toLocaleString()),
            lte: new Date(dtFim.toLocaleString())
          }
        },
        orderBy: {
          dtContato: 'desc'
        }
      })

      return res.status(200).send(histtorico)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async getHistoricoContatoEmpresaPorData (req: Request, res: Response): Promise<Response> {
    try {
      const { dtInicio, dtFim } = req.query
      const { idEmpresa } = req.params

      console.log(req.query)

      const histtorico = await prisma.contatoEmpresas.findMany({
        where: {
          idEmpresa,
          dtContato: {
            gte: new Date(dtInicio.toLocaleString()),
            lte: new Date(dtFim.toLocaleString())
          }
        },
        orderBy: {
          dtContato: 'desc'
        }
      })

      return res.status(200).send(histtorico)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }
}

export default new AtividadesController()
