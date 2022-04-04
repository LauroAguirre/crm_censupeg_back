import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

class CursosController {
  async novoCurso (req: Request, res: Response) {
    try {
      const { nome, modalidade, tipo, valor, duracao, link, infosAdicionais } = req.body


          const curso = await prisma.cursos.create({ data:{
            nome,
            modalidade,
            tipo,
            valor,
            duracao,
            link,
            infosAdicionais,
          }})

          console.log('Curso:')
          console.log(curso)
          console.log('----------------------')

          return res.status(200).json({ curso })

    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async buscarCurso (req: Request, res: Response) {
    try {
      const { idCurso } = req.params

      const curso = await prisma.cursos.findFirst({
        where:{ id: Number(idCurso) }
      })

      return res.status(200).json( curso )
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async pesquisarCurso (req: Request, res: Response) {
    try {
      const { pagina, porPagina, nome, modalidade, tipo, valor, duracao} = req.query

      const completo = await prisma.cursos.findMany({
        where:{
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          modalidade: modalidade ? Number(modalidade) : undefined,
          tipo: tipo ? Number(tipo) : undefined,
          valor: valor ? Number(valor) : undefined,
          duracao: duracao ? {contains: duracao.toString(), mode: 'insensitive'} : undefined,
        }})

      const cursos = await prisma.cursos.findMany({
        where:{
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          modalidade: modalidade ? Number(modalidade) : undefined,
          tipo: tipo ? Number(tipo) : undefined,
          valor: valor ? Number(valor) : undefined,
          duracao: duracao ? {contains: duracao.toString(), mode: 'insensitive'} : undefined,
        },
        take: porPagina ? Number(porPagina) : 10,
        skip: 0,//( Number(pagina) - 1) * Number(porPagina),
        orderBy: [
          {
            nome: 'asc',
          },
        ],
      })

      console.log(cursos)

      return res.status(200).json({ cursos, total: completo.length, paginas: Math.ceil(completo.length/Number(porPagina)) })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async getListaCursosUnidade (req: Request, res: Response) {
    try {
      const { idUnidade } = req.params

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

  async editarCurso (req: Request, res: Response) {
    try {
      const { nome, modalidade, tipo, valor, duracao, link, infosAdicionais } = req.body
      const { idCurso } = req.params

      const curso = await prisma.cursos.update({
        where: {id: Number(idCurso)},
        data:{
          nome,
          modalidade,
          tipo,
          valor,
          duracao,
          link,
          infosAdicionais
        }
      })
      console.log('Candidato:')
      console.log(curso)
      console.log('----------------------')

      return res.status(200).json({ candidato: curso })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

}

export default new CursosController()
