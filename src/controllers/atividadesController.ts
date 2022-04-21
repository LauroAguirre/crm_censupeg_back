import { Request, Response } from 'express'
import { ContatoEmpresas, Prisma, PrismaClient, PrismaPromise } from '@prisma/client'
import { verify } from 'jsonwebtoken'
import { JWTHeader } from 'src/providers/JWTHeader'
import dayjs from 'dayjs'

const prisma = new PrismaClient()
class AtividadesController {
  async contatoEmpresa (req: Request, res: Response): Promise<Response> {
    try {
      const { idEmpresa, dtContato, areasInteresse, proxContato, infosContato, statusAtendimento } = req.body

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
              statusAtendimento
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

        return res.status(200).send(contato)

      })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async contatoCandidato (req: Request, res: Response): Promise<Response> {
    try {
      const { idCandidato, dtContato, edital, cursosInteresse, proxContato, infosContato, statusAtendimento } = req.body

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
                connectOrCreate: cursosInteresse.map((curso: number) => {
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
                  NOT: cursosInteresse?.map((curso: number) => ({ idCandidato: idCandidato, idCurso: curso })),
                }
              },
            }
          })

        return res.status(200).send(contato)

      })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async buscarCandidato (req: Request, res: Response): Promise<Response> {
    try {
      const { idCandidato } = req.params

      const candidato = await prisma.candidatos.findFirst({
        where:{ id: idCandidato }
      })

      return res.status(200).json( candidato )
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async pesquisarCandidato (req: Request, res: Response): Promise<Response> {
    try {
      console.log(req.query)
      const { pagina, porPagina, nome, email, fone, cpf, dtNascimentoInicio, dtNascimentoFim,
        escolaridade, curso, cidade, uf, alunoCensupeg} = req.query

        const dtAniversarioInicio = dtNascimentoInicio ? dayjs(dtNascimentoInicio.toString()) : undefined
        const dtAniversarioFim = dtNascimentoFim ? dayjs(dtNascimentoInicio.toString()) : dtNascimentoInicio ? dayjs(dtNascimentoInicio.toString()) : undefined

      const completo = await prisma.candidatos.findMany({
        where:{
          OR: [
            {cursoAtual: curso ? {contains: curso.toString(), mode: 'insensitive'} : undefined},
            {outrosCursosInteresse: curso ? {contains: curso.toString(), mode: 'insensitive'} : undefined},
            {cursosInteresse: curso ? {
              every: {
                curso: {
                  nome: { contains: curso.toString(), mode: 'insensitive' }
                }
              }
            } : undefined},
          ],
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          email: email ? {contains: email.toString(), mode: 'insensitive'} : undefined,
          fone1: fone ? {contains: fone.toString().replace(/\D/g, '')} : undefined,
          fone2: fone ? {contains: fone.toString().replace(/\D/g, '')} : undefined,
          cpf: cpf ? {contains: cpf.toString().replace(/\D/g, '')} : undefined,
          escolaridade: escolaridade ? Number(escolaridade) : null,

          cidade: cidade ? {contains: cidade.toString(), mode: 'insensitive'} : undefined,
          uf: uf ? {contains: uf.toString(), mode: 'insensitive'} : undefined,
          dtNascimento: {
            gte: dtAniversarioInicio ? new Date(dtAniversarioInicio.format('YYYY-MM-DD')) : undefined,
            lt: dtAniversarioFim ? new Date(dtAniversarioFim.format('YYYY-MM-DD')) : undefined
          },
          alunoCensupeg: alunoCensupeg ? Boolean(alunoCensupeg) : undefined
        }})

      const candidatos = await prisma.candidatos.findMany({
        where:{
          OR: [
            {cursoAtual: curso ? {contains: curso.toString(), mode: 'insensitive'} : undefined},
            {outrosCursosInteresse: curso ? {contains: curso.toString(), mode: 'insensitive'} : undefined},
            {cursosInteresse: curso ? {
              every: {
                curso: {
                  nome: { contains: curso.toString(), mode: 'insensitive' }
                }
              }
            } : undefined},
          ],
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          email: email ? {contains: email.toString(), mode: 'insensitive'} : undefined,
          fone1: fone ? {contains: fone.toString().replace(/\D/g, '')} : undefined,
          fone2: fone ? {contains: fone.toString().replace(/\D/g, '')} : undefined,
          cpf: cpf ? {contains: cpf.toString().replace(/\D/g, '')} : undefined,
          escolaridade: escolaridade ? Number(escolaridade) : null,
          // cursoAtual: curso ? {contains: curso.toString(), mode: 'insensitive'} : undefined,
          cidade: cidade ? {contains: cidade.toString(), mode: 'insensitive'} : undefined,
          uf: uf ? {contains: uf.toString(), mode: 'insensitive'} : undefined,
          dtNascimento: {
            gte: dtAniversarioInicio ? new Date(dtAniversarioInicio.format('YYYY-MM-DD')) : undefined,
            lt: dtAniversarioFim ? new Date(dtAniversarioFim.format('YYYY-MM-DD')) : undefined
          },
          alunoCensupeg: alunoCensupeg ? Boolean(alunoCensupeg) : undefined
        },
        include: {cursosInteresse: true},
        take: Number(porPagina),
        skip: ( Number(pagina) - 1) * Number(porPagina),
        orderBy: [
          {
            nome: 'asc',
          },
        ],
      })

      return res.status(200).json({ candidatos, total: completo.length, paginas: Math.ceil(completo.length/Number(porPagina)) })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async getHistoricoContatoCandidato (req: Request, res: Response): Promise<Response> {
    try {
      const { dtInicio, dtFim } = req.query
      const { idCandidato } = req.params

      console.log(req.query)

      const histtorico = await prisma.contatoCandidatos.findMany({
        where: {
          idCandidato,
          dtContato: {
            gte: new Date(dtInicio.toString()),
            lte: new Date(dtFim.toString())
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

  async getHistoricoContatoEmpresa (req: Request, res: Response): Promise<Response> {
    try {
      const { dtInicio, dtFim } = req.query
      const { idEmpresa } = req.params

      console.log(req.query)

      const histtorico = await prisma.contatoEmpresas.findMany({
        where: {
          idEmpresa,
          dtContato: {
            gte: new Date(dtInicio.toString()),
            lte: new Date(dtFim.toString())
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
