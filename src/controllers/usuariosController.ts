import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { JWTHeader } from 'src/providers/JWTHeader'
import { verify } from 'jsonwebtoken'
import gerarSenha from 'src/providers/gerarSenha'

const prisma = new PrismaClient()

class UsuariosController {
  async novoUsuario (req: Request, res: Response) {
    try {
      // const { nome, telefone, email, senha, perfilUsuario, ativo, idUnidade } = req.body
      const { nome, telefone, email, perfilUsuario, ativo, idUnidade } = req.body

      const senha = gerarSenha.gerarNovaSenha(5)

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

      return res.status(200).json({ usuario, senha })
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

  async editarUsuario (req: Request, res: Response) {
    console.log('Editando usuário...')
    try {
      const { nome, telefone, email, perfilUsuario, ativo } = req.body
      const { idUsuario } = req.params

      const usuario = await prisma.usuarios.update({
        where: {id: idUsuario.toString()},
        data:{ nome, telefone: telefone.replace(/\D/g, ''), email, perfilUsuario, ativo }
      })
      console.log('Usuário:')
      console.log(usuario)
      console.log('----------------------')

      delete usuario.senha

      return res.status(200).json({ usuario })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async atualizarSenha (req: Request, res: Response) {
    const { senhaAtual, novaSenha } = req.body
    const { idUsuario } = req.params

    try {
      const usuario = await prisma.usuarios.findFirst({where:{id: idUsuario.toString()}})
      const validatePass = await bcrypt.compare(senhaAtual, usuario.senha)

      if (!validatePass) {
        return res.status(401).send({ message: 'Usuário ou senha inválidos!' })
      }

      await prisma.usuarios.update({
        where: {id: idUsuario.toString()},
        data:{ senha:  bcrypt.hashSync(novaSenha, 8), senhaTemp: false}
      })

      delete usuario.senha

      return res.status(200).send(usuario)

    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async resetarSenha (req: Request, res: Response) {
    const { idUsuario } = req.params

    try {
      const novaSenha = gerarSenha.gerarNovaSenha(5)

      await prisma.usuarios.update({
        where: {id: idUsuario.toString()},
        data:{ senha: bcrypt.hashSync(novaSenha, 8) }
      })

      return res.status(200).send(novaSenha)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }
}

export default new UsuariosController()
