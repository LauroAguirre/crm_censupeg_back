import { Request, Response } from 'express'
import { PrismaClient, Usuarios } from '@prisma/client'
import bcrypt from 'bcryptjs'
import gerarSenha from 'src/providers/gerarSenha'
import { verify } from 'jsonwebtoken'
import { JWTHeader } from 'src/providers/JWTHeader'
import dayjs from 'dayjs'

const prisma = new PrismaClient()

class EmpresasController {
  async novaEmpresa (req: Request, res: Response) {
    try {
      const { nome, razaoSocial, cnpj, nomeContato, emailContato, foneContato, foneContato2, situacao, outrasInfos } = req.body

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

          const empresa = await prisma.empresas.create({ data:{
            nome,
            razaoSocial,
            cnpj,
            nomeContato,
            emailContato,
            foneContato,
            foneContato2,
            situacao,
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

          console.log('Empresa:')
          console.log(empresa)
          console.log('----------------------')

          return res.status(200).json({ empresa })
        })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async buscarEmpresa (req: Request, res: Response) {
    try {
      const { idEmpresa } = req.params

      const empresa = await prisma.empresas.findFirst({
        where:{ id: idEmpresa }
      })

      return res.status(200).json( empresa )
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async pesquisarEmpresa (req: Request, res: Response) {
    try {
      const { pagina, porPagina, nome, razaoSocial, cnpj, nomeContato, emailContato, foneContato, situacao, dtPeriodoContatoInicio, dtPeriodoContatoFim} = req.query

      const inicioPeriodo = dtPeriodoContatoInicio ? dayjs(dtPeriodoContatoInicio.toString()).format('YYYY-DD-MM') : undefined
      const dtContatoFim = dtPeriodoContatoFim ? dayjs(dtPeriodoContatoFim.toString()).format('YYYY-DD-MM') : undefined

      const completo = await prisma.empresas.findMany({
        where:{
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          razaoSocial: razaoSocial ? {contains: razaoSocial.toString(), mode: 'insensitive'} : undefined,
          cnpj: cnpj ? {contains: cnpj.toString().replace(/\D/g, '')} : undefined,
          nomeContato: nomeContato ? {contains: nomeContato.toString(), mode: 'insensitive'} : undefined,
          emailContato: emailContato ? {contains: emailContato.toString(), mode: 'insensitive'} : undefined,
          foneContato: foneContato ? {contains: foneContato.toString().replace(/\D/g, '')} : undefined,
          foneContato2: foneContato ? {contains: foneContato.toString().replace(/\D/g, '')} : undefined,
          situacao: Number(situacao),
          // email: email ? {contains: email.toString(), mode: 'insensitive'} : undefined,
          // fone1: fone ? {contains: fone.toString().replace(/\D/g, '')} : undefined,
          // fone2: fone ? {contains: fone.toString().replace(/\D/g, '')} : undefined,
          // cpf: cpf ? {contains: cpf.toString().replace(/\D/g, '')} : undefined,
          // escolaridade: escolaridade ? Number(escolaridade) : null,
          // cursoAtual: cursoAtual ? {contains: cursoAtual.toString(), mode: 'insensitive'} : undefined,
          // cidade: cidade ? {contains: cidade.toString(), mode: 'insensitive'} : undefined,
          // uf: uf ? {contains: uf.toString(), mode: 'insensitive'} : undefined,
          dtUltContato: {
            gte: inicioPeriodo,
            lt: dtContatoFim
          },
        }})

      const candidatos = await prisma.empresas.findMany({
        where:{
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          razaoSocial: razaoSocial ? {contains: razaoSocial.toString(), mode: 'insensitive'} : undefined,
          cnpj: cnpj ? {contains: cnpj.toString().replace(/\D/g, '')} : undefined,
          nomeContato: nomeContato ? {contains: nomeContato.toString(), mode: 'insensitive'} : undefined,
          emailContato: emailContato ? {contains: emailContato.toString(), mode: 'insensitive'} : undefined,
          foneContato: foneContato ? {contains: foneContato.toString().replace(/\D/g, '')} : undefined,
          foneContato2: foneContato ? {contains: foneContato.toString().replace(/\D/g, '')} : undefined,
          situacao: Number(situacao),
          dtUltContato: {
            gte: inicioPeriodo,
            lt: dtContatoFim
          },
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

  async getListaEmpresas (req: Request, res: Response) {
    try {
      const empresas = await prisma.empresas.findMany({
        orderBy: [
          {
            nome: 'asc',
          },
        ],
      })

      return res.status(200).json({ empresas })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async editarEmpresa (req: Request, res: Response) {
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

export default new EmpresasController()
