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
      const { nome, razaoSocial, cnpj, nomeContato, emailContato, foneContato, foneContato2, situacao,
        cep, logradouro, numero, complemento, bairro, cidade, uf, outraSituacao, outrasInfos } = req.body

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
            cnpj: cnpj.replace(/\D/g, ''),
            nomeContato,
            emailContato,
            foneContato: foneContato.replace(/\D/g, ''),
            foneContato2: foneContato2 ? foneContato2.replace(/\D/g, '') : null,
            situacao,
            outraSituacao,
            cep: cep ? cep.replace(/\D/g, '') : null,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
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
          situacao: situacao ? Number(situacao) : undefined,
          dtUltContato: {
            gte: inicioPeriodo,
            lt: dtContatoFim
          },
        }})

      const empresas = await prisma.empresas.findMany({
        where:{
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          razaoSocial: razaoSocial ? {contains: razaoSocial.toString(), mode: 'insensitive'} : undefined,
          cnpj: cnpj ? {contains: cnpj.toString().replace(/\D/g, '')} : undefined,
          nomeContato: nomeContato ? {contains: nomeContato.toString(), mode: 'insensitive'} : undefined,
          emailContato: emailContato ? {contains: emailContato.toString(), mode: 'insensitive'} : undefined,
          foneContato: foneContato ? {contains: foneContato.toString().replace(/\D/g, '')} : undefined,
          foneContato2: foneContato ? {contains: foneContato.toString().replace(/\D/g, '')} : undefined,
          situacao: situacao ? Number(situacao) : undefined,
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

      return res.status(200).json({ empresas, total: completo.length, paginas: Math.ceil(completo.length/Number(porPagina)) })
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

      const lista = empresas.map(empresa => {
        return {idEmpresa: empresa.id, texto: `${empresa.nome} - ${empresa.cnpj.replace(
          /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/,
          '$1.$2.$3-$4/$5'
        )}`}
      })

      return res.status(200).json(lista)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async editarEmpresa (req: Request, res: Response) {
    console.log('Editando usuário...')
    try {
      const { nome, razaoSocial, cnpj, nomeContato, emailContato, foneContato, foneContato2, situacao, outrasInfos } = req.body
      const { idUsuario } = req.params

      const empresa = await prisma.empresas.update({
        where: {id: idUsuario.toString()},
        data:{
          nome,
          razaoSocial,
            cnpj: cnpj.replace(/\D/g, ''),
            nomeContato,
            emailContato,
            foneContato: foneContato.replace(/\D/g, ''),
            foneContato2: foneContato2.replace(/\D/g, ''),
            situacao,
            outrasInfos
        }
      })
      console.log('Empresa:')
      console.log(empresa)
      console.log('----------------------')

      return res.status(200).json(empresa)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }


}

export default new EmpresasController()
