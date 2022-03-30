import { Request, Response } from 'express'
import { PrismaClient, Usuarios } from '@prisma/client'
import bcrypt from 'bcryptjs'
import gerarSenha from 'src/providers/gerarSenha'
import { verify } from 'jsonwebtoken'
import { JWTHeader } from 'src/providers/JWTHeader'
import dayjs from 'dayjs'

const prisma = new PrismaClient()

class CandidatosController {
  async novoCandidato (req: Request, res: Response) {
    try {
      const { nome, email, fone1, fone2, cpf, dtNascimento, escolaridade, cursoAtual, cidade, uf, alunoCensupeg, outrasInfos } = req.body

        const authHeader = req.headers.authorization
        const [, token] = authHeader.split(' ')

        verify(token, process.env.JWT_TOKEN, async (error, headerToken:JWTHeader) => {
          if (error) {
            return res.status(401).send({ message: 'Usuário não encontrado' })
          }

          const idUsuario = headerToken.userId.toString()
          const usuario = await prisma.usuarios.findFirst({
            where:{ id: idUsuario }
          })

          const candidato = await prisma.candidatos.create({ data:{
            nome,
            email,
            fone1,
            fone2,
            cpf,
            dtNascimento,
            escolaridade,
            cursoAtual,
            cidade,
            uf,
            alunoCensupeg,
            outrasInfos,
            dtUltContato: new Date(),
            usuarioCad: {
              connect:  {
                id: usuario.id,
              }
            },
            usuarioUltContato: {
              connect:  {
                id: usuario.id,
              }
            }
          }})

          console.log('Candidato:')
          console.log(candidato)
          console.log('----------------------')

          return res.status(200).json({ candidato })
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

  // async getListaCandidatos (req: Request, res: Response) {
  //   try {
  //     const { idUnidade } = req.query

  //     const usuarios = await prisma.usuarios.findMany({
  //       where:{ unidadesId: { not: Number(idUnidade) }},
  //       include: { Unidades: true},
  //       orderBy: [
  //         {
  //           nome: 'asc',
  //         },
  //       ],
  //     })

  //     return res.status(200).json({ usuarios })
  //   } catch (error) {
  //     console.error(error)
  //     return res.status(500).json(error)
  //   }
  // }

  async editarCandidato (req: Request, res: Response) {
    console.log('Editando usuário...')
    try {
      const { nome, email, fone1, fone2, cpf, dtNascimento,
        escolaridade, cursoAtual, cidade, uf, alunoCensupeg } = req.body
      const { idUsuario } = req.params

      const candidato = await prisma.candidatos.update({
        where: {id: idUsuario.toString()},
        data:{
          nome,
          email,
          fone1: fone1.replace(/\D/g, ''),
          fone2: fone2.replace(/\D/g, ''),
          cpf: cpf.replace(/\D/g, ''),
          dtNascimento,
          escolaridade,
          cursoAtual,
          cidade,
          uf,
          alunoCensupeg
        }
      })
      console.log('Candidato:')
      console.log(candidato)
      console.log('----------------------')

      return res.status(200).json({ candidato })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }


}

export default new CandidatosController()
