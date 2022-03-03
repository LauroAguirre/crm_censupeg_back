import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { JWTHeader } from 'src/providers/JWTHeader'
import { verify } from 'jsonwebtoken'

const prisma = new PrismaClient()

class UsuariosController {
  async novoUsuario (req: Request, res: Response) {
    console.log('Cadastrando novo usuário...')
    try {
      const { nome, telefone, email, senha, perfilUsuario, ativo } = req.body

      const usuario = await prisma.usuarios.create({ data:{ nome, telefone, email, senha: bcrypt.hashSync(senha, 8), perfilUsuario, ativo }})
      console.log('Usuário:')
      console.log(usuario)
      console.log('----------------------')

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
          console.log(headerToken)
          console.log('JWT inválido!')
          console.log(error)
          return res.status(401).send({ message: 'Usuário não encontrado' })
        }

        console.log(headerToken)

        const idUsuario = headerToken.userId.toString()
        const usuario = await prisma.usuarios.findFirst({ where:{ id: idUsuario }})
        console.log('Usuário:')
        console.log(usuario)
        console.log('----------------------')

        return res.status(200).json({ usuario })
      })


    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async buscarUsuario (req: Request, res: Response) {
    try {
      const { idUsuario } = req.params

      const usuario = await prisma.usuarios.findFirst({ where:{ id: idUsuario }})
      console.log('Usuário:')
      console.log(usuario)
      console.log('----------------------')

      return res.status(200).json({ usuario })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }
}

export default new UsuariosController()
