import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { connect } from 'http2'

const prisma = new PrismaClient()

class UsuariosController {
  async novaUnidade (req: Request, res: Response) {
    console.log('Cadastrando nova unidade...')
    try {
      const { nome, cep, logradouro, numero, complemento, bairro, cidade, uf } = req.body

      const unidade = await prisma.unidades.create({ data:{ nome, cep: cep.replace(/\D/g, ''), logradouro, numero, complemento, bairro, cidade, uf }})
      console.log('Unidade:')
      console.log(unidade)
      console.log('----------------------')

      return res.status(200).json({ unidade })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }


  async buscarUnidade (req: Request, res: Response) {
    try {
      const { idUnidade } = req.params

      const unidade = await prisma.unidades.findFirst({ where:{ id: Number(idUnidade) }})
      console.log('Unidade:')
      console.log(unidade)
      console.log('----------------------')

      return res.status(200).json({ usuario: unidade })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async vincularUsuario (req: Request, res: Response) {
    console.log('iniciando a vincular usuário..')
    try {
      const { idUsuario } = req.body
      const { idUnidade } = req.params

      await prisma.unidades.update({
        where: { id: Number(idUnidade) },
        data: {
          usuarios: {
            connect: {
              id: idUsuario,
            }
          }
        }
      })

      const unidade = await prisma.unidades.findFirst({ where:{ id: Number(idUnidade) }, include: {usuarios: true}})

      // console.log('Unidade:')
      // console.log(unidade)
      // console.log('----------------------')

      return res.status(200).json({ unidade })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async removerUsuario (req: Request, res: Response) {
    try {
      const { idUsuario } = req.body
      const { idUnidade } = req.params

      await prisma.unidades.update({
        where: { id: Number(idUnidade) },
        data: {
          usuarios: {
            disconnect: {
              id: idUsuario,
            }
          }
        }
      })

      const unidade = await prisma.unidades.findFirst({ where:{ id: Number(idUnidade) }, include: {usuarios: true}})

      // console.log('Unidade:')
      // console.log(unidade)
      // console.log('----------------------')

      return res.status(200).json({ unidade })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }
}

export default new UsuariosController()
