import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { verify } from 'jsonwebtoken'
import { JWTHeader } from 'src/providers/JWTHeader'
import dayjs from 'dayjs'
import { connect } from 'http2'

const prisma = new PrismaClient()
class CandidatosController {
  async novoCandidato (req: Request, res: Response) {
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

          console.log('Candidato:')
          console.log(candidato)
          console.log('----------------------')

          return res.status(200).send( candidato )
        })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async buscarCandidato (req: Request, res: Response) {
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

  async pesquisarCandidato (req: Request, res: Response) {
    try {
      const { pagina, porPagina, nome, email, fone, cpf, dtNascimentoInicio, dtNascimentoFim,
        escolaridade, cursoAtual, cidade, uf, alunoCensupeg} = req.query

        const dtAniversarioInicio = dtNascimentoInicio ? dayjs(dtNascimentoInicio.toString()) : undefined
        const dtAniversarioFim = dtNascimentoFim ? dayjs(dtNascimentoInicio.toString()) : dtNascimentoInicio ? dayjs(dtNascimentoInicio.toString()) : undefined

      const completo = await prisma.candidatos.findMany({
        where:{
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          email: email ? {contains: email.toString(), mode: 'insensitive'} : undefined,
          fone1: fone ? {contains: fone.toString().replace(/\D/g, '')} : undefined,
          fone2: fone ? {contains: fone.toString().replace(/\D/g, '')} : undefined,
          cpf: cpf ? {contains: cpf.toString().replace(/\D/g, '')} : undefined,
          escolaridade: escolaridade ? Number(escolaridade) : null,
          cursoAtual: cursoAtual ? {contains: cursoAtual.toString(), mode: 'insensitive'} : undefined,
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
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          email: email ? {contains: email.toString(), mode: 'insensitive'} : undefined,
          fone1: fone ? {contains: fone.toString().replace(/\D/g, '')} : undefined,
          fone2: fone ? {contains: fone.toString().replace(/\D/g, '')} : undefined,
          cpf: cpf ? {contains: cpf.toString().replace(/\D/g, '')} : undefined,
          escolaridade: escolaridade ? Number(escolaridade) : null,
          cursoAtual: cursoAtual ? {contains: cursoAtual.toString(), mode: 'insensitive'} : undefined,
          cidade: cidade ? {contains: cidade.toString(), mode: 'insensitive'} : undefined,
          uf: uf ? {contains: uf.toString(), mode: 'insensitive'} : undefined,
          dtNascimento: {
            gte: dtAniversarioInicio ? new Date(dtAniversarioInicio.format('YYYY-MM-DD')) : undefined,
            lt: dtAniversarioFim ? new Date(dtAniversarioFim.format('YYYY-MM-DD')) : undefined
          },
          alunoCensupeg: alunoCensupeg ? Boolean(alunoCensupeg) : undefined
        },
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

  async editarCandidato (req: Request, res: Response) {
    console.log('Editando candidato...')
    try {
      const { alunoCensupeg, cidade, cpf, cursoAtual, cursosInteresse, dtNascimento,
        email, escolaridade, fone1, fone2, formacao, formato,nivel, nome,
        outrosCursosInteresse, outrasInfos, periodos, sexo, uf } = req.body
      const { idFuncionario } = req.params

      const candidato = await prisma.candidatos.update({
        where: {id: idFuncionario.toString()},
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
            create: cursosInteresse?.map((curso: number) => ({ idCurso: curso })),
          },
        }
      })

      console.log('Candidato:')
      console.log(candidato)
      console.log('----------------------')

      return res.status(200).json(candidato)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }


}

export default new CandidatosController()
