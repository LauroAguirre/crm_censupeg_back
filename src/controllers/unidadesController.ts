import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { connect } from 'http2'

const prisma = new PrismaClient()

class UnidadesController {
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

  async editarUnidade (req: Request, res: Response) {
    console.log('Editando unidade...')
    try {
      const { nome, cep, logradouro, numero, complemento, bairro, cidade, uf } = req.body
      const { idUnidade } = req.params

      const unidade = await prisma.unidades.update({
        where: {id: Number(idUnidade)},
        data:{ nome, cep: cep.replace(/\D/g, ''), logradouro, numero, complemento, bairro, cidade, uf }
      })
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

      const unidade = await prisma.unidades.findFirst({
        where:{ id: Number(idUnidade) },
        include:{ funcionarios:true }
      })

      return res.status(200).json({ unidade })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async pesquisarUnidades (req: Request, res: Response) {
    try {
      const { pagina, porPagina, nome, cep, cidade, uf  } = req.query

      const completo = await prisma.unidades.findMany({
        where:{
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          cep: cep ? {equals: cep.toString().replace(/\D/g, '')} : undefined,
          cidade: cidade ? {contains: cidade.toString(), mode: 'insensitive'} : undefined,
          uf: uf ? {equals: uf.toString(), mode: 'insensitive'} : undefined
        }})

      const unidades = await prisma.unidades.findMany({
        where:{
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          cep: cep ? {equals: cep.toString().replace(/\D/g, '')} : undefined,
          cidade: cidade ? {contains: cidade.toString(), mode: 'insensitive'} : undefined,
          uf: uf ? {equals: uf.toString(), mode: 'insensitive'} : undefined
        },
        take: Number(porPagina),
        skip: ( Number(pagina) - 1) * Number(porPagina),
        orderBy: [
          {
            nome: 'asc',
          },
          {
            uf: 'asc',
          },
          {
            cidade: 'asc',
          },
        ],
      })

      return res.status(200).json({ unidades, total: completo.length, paginas: Math.ceil(completo.length/Number(porPagina)) })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async getListaUnidades (req: Request, res: Response) {
    try {
      const unidades = await prisma.unidades.findMany({
        orderBy: [
          {
            nome: 'asc',
          },
          {
            uf: 'asc',
          },
          {
            cidade: 'asc',
          },
        ],
      })

      return res.status(200).json({ unidades })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async vincularFuncionario (req: Request, res: Response) {
    console.log('iniciando a vincular funcionário..')
    try {
      const { idFuncionario } = req.body
      const { idUnidade } = req.params

      await prisma.unidades.update({
        where: { id: Number(idUnidade) },
        data: {
          funcionarios: {
            connect: {
              id: idFuncionario,
            }
          }
        }
      })

      const funcionario = await prisma.funcionarios.findFirst({ where:{ id: idFuncionario }})

      return res.status(200).json(funcionario)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async removerFuncionario (req: Request, res: Response) {
    try {
      const { idFuncionario } = req.body
      const { idUnidade } = req.params

      await prisma.unidades.update({
        where: { id: Number(idUnidade) },
        data: {
          funcionarios: {
            disconnect: {
              id: idFuncionario,
            }
          }
        }
      })

      const unidade = await prisma.unidades.findFirst({ where:{ id: Number(idUnidade) }, include: {funcionarios: true}})

      return res.status(200).json(unidade)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }
}

export default new UnidadesController()
