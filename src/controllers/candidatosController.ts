import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { verify } from 'jsonwebtoken'
import { JWTHeader } from '../providers/JWTHeader'
import dayjs from 'dayjs'
import { notEqual } from 'assert'

const prisma = new PrismaClient()
class CandidatosController {
  async novoCandidato (req: Request, res: Response): Promise<Response> {
    try {
      const {
        alunoCensupeg, cidade, cpf, cursoAtual, cursosInteresse, dtNascimento,
        email, escolaridade, fone1, fone2, formacao, formato,nivel, nome,
        outrosCursosInteresse, outrasInfos, periodos, sexo, uf } = req.body

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

          const candidato = await prisma.candidatos.create({ data:{
            nome,
            email,
            fone1: fone1 ? fone1.replace(/\D/g, '') : null,
            fone2: fone2 ? fone2.replace(/\D/g, '') : null,
            cpf: cpf ? cpf.replace(/\D/g, '') : null,
            dtNascimento,
            escolaridade,
            formacao,
            cursoAtual,
            cidade,
            uf,
            alunoCensupeg,
            outrosCursosInteresse,
            outrasInfos,
            sexo,
            horarioMatutino: periodos ? periodos.findIndex((per: string) => per === 'Matutino') > -1 : false,
            horarioVespertino: periodos ? periodos.findIndex((per: string) => per === 'Vespertino') > -1 : false,
            horarioNoturno: periodos ? periodos.findIndex((per: string) => per === 'Noturno') > -1 : false,
            interessePos: nivel ? nivel.findIndex((per: string) => per === 'Pós') > -1 : false,
            interesseGraduacao: nivel ? nivel.findIndex((per: string) => per === 'Graduação') > -1 : false,
            interesseMestrado: nivel ? nivel.findIndex((per: string) => per === 'Mestrado') > -1 : false,
            interessePresencial: formato ? formato.findIndex((per: string) => per === 'Presencial') > -1 : false,
            interesseEad: formato ? formato.findIndex((per: string) => per === 'EAD') > -1 : false,
            interesseHibrido: formato ? formato.findIndex((per: string) => per === 'Híbrido') > -1 : false,
            cursosInteresse: {
              create: cursosInteresse?.map((curso: number) => ({ idCurso: curso })),
            },
            dtUltContato: new Date(),
            funcionarioCad: {
              connect:  {
                id: funcionario.id,
              }
            },
            funcionarioUltContato: {
              connect:  {
                id: funcionario.id,
              }
            }
          }})

          return res.status(200).send( candidato )
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

        const dtAniversarioInicio = dtNascimentoInicio ? new Date(dtNascimentoInicio.toLocaleString()) : undefined
        const dtAniversarioFim = dtNascimentoFim ? new Date(dtNascimentoInicio.toLocaleString()) : dtNascimentoInicio ? new Date(dtNascimentoInicio.toLocaleString()) : undefined

      const orFilters = []

      if(curso){
        orFilters.push(
          {cursoAtual: {contains: curso.toString(), mode: 'insensitive'}},
          {outrosCursosInteresse: {contains: curso.toString(), mode: 'insensitive'}},
          {cursosInteresse: {
            every: {
              curso: {
                nome: { contains: curso.toString(), mode: 'insensitive' }
              }
            }
          }}
        )
      }

      const completo = await prisma.candidatos.findMany({
        where:{
          OR: orFilters.length > 0 ? orFilters : undefined,
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          email: email ? {contains: email.toString(), mode: 'insensitive'} : undefined,
          fone1: fone ? {contains: fone.toString().replace(/\D/g, '')} : undefined,
          fone2: fone ? {contains: fone.toString().replace(/\D/g, '')} : undefined,
          cpf: cpf ? {contains: cpf.toString().replace(/\D/g, '')} : undefined,
          escolaridade: escolaridade ? Number(escolaridade) : undefined,

          cidade: cidade ? {contains: cidade.toString(), mode: 'insensitive'} : undefined,
          uf: uf ? {contains: uf.toString(), mode: 'insensitive'} : undefined,
          dtNascimento: {
            gte: dtAniversarioInicio,
            lt: dtAniversarioFim
          },
          alunoCensupeg: alunoCensupeg ? Boolean(alunoCensupeg) : undefined
        }})

      const candidatos = await prisma.candidatos.findMany({
        where:{
          OR: orFilters.length > 0 ? orFilters : undefined,
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          email: email ? {contains: email.toString(), mode: 'insensitive'} : undefined,
          fone1: fone ? {contains: fone.toString().replace(/\D/g, '')} : undefined,
          fone2: fone ? {contains: fone.toString().replace(/\D/g, '')} : undefined,
          cpf: cpf ? {contains: cpf.toString().replace(/\D/g, '')} : undefined,
          escolaridade: escolaridade ? Number(escolaridade) : undefined,
          cidade: cidade ? {contains: cidade.toString(), mode: 'insensitive'} : undefined,
          uf: uf ? {contains: uf.toString(), mode: 'insensitive'} : undefined,
          dtNascimento: {
            gte: dtAniversarioInicio,
            lt: dtAniversarioFim
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

  async editarCandidato (req: Request, res: Response): Promise<Response> {
    try {
      const { alunoCensupeg, cidade, cpf, cursoAtual, cursosInteresse, dtNascimento,
        email, escolaridade, fone1, fone2, formacao, formato, nivel, nome,
        outrosCursosInteresse, outrasInfos, periodos, sexo, uf } = req.body
      const { idCandidato } = req.params

      const cursosList = cursosInteresse ? cursosInteresse : []

      const candidato = await prisma.candidatos.update({
        where: {id: idCandidato.toString()},
        data:{
          nome,
          email,
          fone1: fone1 ? fone1.replace(/\D/g, '') : null,
          fone2: fone2 ? fone2.replace(/\D/g, '') : null,
          cpf: cpf ? cpf.replace(/\D/g, '') : null,
          dtNascimento,
          escolaridade,
          formacao,
          cursoAtual,
          cidade,
          uf,
          alunoCensupeg,
          outrosCursosInteresse,
          outrasInfos,
          sexo,
          horarioMatutino: periodos ? periodos.findIndex((per: string) => per === 'Matutino') > -1 : false,
          horarioVespertino: periodos ? periodos.findIndex((per: string) => per === 'Vespertino') > -1 : false,
          horarioNoturno: periodos ? periodos.findIndex((per: string) => per === 'Noturno') > -1 : false,
          interessePos: nivel ? nivel.findIndex((per: string) => per === 'Pós') > -1 : false,
          interesseGraduacao: nivel ? nivel.findIndex((per: string) => per === 'Graduação') > -1 : false,
          interesseMestrado: nivel ? nivel.findIndex((per: string) => per === 'Mestrado') > -1 : false,
          interessePresencial: formato ? formato.findIndex((per: string) => per === 'Presencial') > -1 : false,
          interesseEad: formato ? formato.findIndex((per: string) => per === 'EAD') > -1 : false,
          interesseHibrido: formato ? formato.findIndex((per: string) => per === 'Híbrido') > -1 : false,
          cursosInteresse: {
            connectOrCreate: cursosList.map((curso: number) => {
                return {
                  where: {
                    idCurso_idCandidato: {
                      idCurso: curso,
                      idCandidato: idCandidato.toString()
                    }
                  },
                  create: {
                    idCurso: curso,
                  },
                };
            }),
            deleteMany: {
              NOT: cursosList.map((curso: number) => ({ idCandidato: idCandidato.toString(), idCurso: curso })),
            }
          },
        },
        include:{
          cursosInteresse:true
        }
      })

      return res.status(200).json(candidato)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }
}

export default new CandidatosController()
