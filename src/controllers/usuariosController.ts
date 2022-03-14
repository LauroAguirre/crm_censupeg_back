import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { JWTHeader } from 'src/providers/JWTHeader'
import { verify } from 'jsonwebtoken'

const prisma = new PrismaClient()

class UsuariosController {
  async novoUsuario (req: Request, res: Response) {
    try {
      const { nome, telefone, email, senha, perfilUsuario, ativo, idUnidade } = req.body

      const usuario = await prisma.usuarios.create({ data:{ nome, telefone, email, senha: bcrypt.hashSync(senha, 8), perfilUsuario, ativo }})

      if(idUnidade > 0){
        await prisma.unidades.update({
          where: { id: idUnidade },
          data: {
            usuarios: {
              connect: {
                id: usuario.id,
              }
            }
          }
        })
      }

      return res.status(200).json({ usuario })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async getUsuarioLogado (req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization
      const [, token] = authHeader.split(' ')

      verify(token, process.env.JWT_TOKEN, async (error, headerToken:JWTHeader) => {
        if (error) {
          return res.status(401).send({ message: 'Usuário não encontrado' })
        }

        const idUsuario = headerToken.userId.toString()
        const usuario = await prisma.usuarios.findFirst({
          where:{ id: idUsuario },
          include: { Unidades: true}
        })

        delete usuario.senha

        return res.status(200).json(usuario)
      })


    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async buscarUsuario (req: Request, res: Response) {
    try {
      const { idUsuario } = req.params

      const usuario = await prisma.usuarios.findFirst({
        where:{ id: idUsuario },
        include: { Unidades: true}
      })

      delete usuario.senha

      return res.status(200).json( usuario )
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async getUsuariosUnidade (req: Request, res: Response) {
    try {
      const { idUnidade } = req.query

      const usuarios = await prisma.usuarios.findMany({
        where:{ unidadesId: Number(idUnidade) },
        orderBy: [
          {
            nome: 'asc',
          },
        ],
      })

      return res.status(200).json({ usuarios })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async pesquisarUsuarios (req: Request, res: Response) {
    try {
      const { pagina, porPagina, unidade, nome, email, ativo} = req.query

      const completo = await prisma.usuarios.findMany({
        where:{
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          unidadesId: unidade ? {equals: Number(unidade)} : undefined,
          email: email ? {contains: email.toString(), mode: 'insensitive'} : undefined,
          ativo: ativo ? Boolean(ativo) : undefined
        }})

      const usuarios = await prisma.usuarios.findMany({
        where:{
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          unidadesId: unidade ? {equals: Number(unidade)} : undefined,
          email: email ? {contains: email.toString(), mode: 'insensitive'} : undefined,
          ativo: ativo ? Boolean(ativo) : undefined
        },
        take: Number(porPagina),
        skip: ( Number(pagina) - 1) * Number(porPagina),
        orderBy: [
          {
            nome: 'asc',
          },
        ],
      })

      return res.status(200).json({ usuarios, total: completo.length, paginas: Math.ceil(completo.length/Number(porPagina)) })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async getListaUsuarios (req: Request, res: Response) {
    try {
      const { idUnidade } = req.query

      const usuarios = await prisma.usuarios.findMany({
        where:{ unidadesId: { not: Number(idUnidade) }},
        include: { Unidades: true},
        orderBy: [
          {
            nome: 'asc',
          },
        ],
      })

      return res.status(200).json({ usuarios })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }
}

export default new UsuariosController()
