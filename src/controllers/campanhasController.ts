import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
class CampanhasController {
  async cadastrarCampanha (req: Request, res: Response): Promise<Response> {
    try {
      const { nome, idZappier, unidades, redesSociais } = req.body

      const campanha = await prisma.campanhas.create({
         data:{
           nome,
           idZappier,
           unidades: {
            create: unidades?.map((unidade: number) => ({ idUnidade: unidade })),
          },
           redesSociais: {
            create: redesSociais?.map((rede: number) => ({ idRede: rede })),
          },
         }
      })

      return res.status(200).send(campanha)

    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async editarCampanhas (req: Request, res: Response): Promise<Response> {
    try {
      const { nome, idZappier, unidades, redesSociais } = req.body
      const { idCampanha } = req.params

      const campanha = await prisma.campanhas.update({
        where: {id: idCampanha.toString()},
        data:{
          nome,
          idZappier,
          unidades: {
            connectOrCreate: unidades.map((unidade: number) => {
                return {
                  where: {
                    idCampanha_idUnidade: {
                      idCampanha: idCampanha.toString(),
                      idUnidade: unidade
                    }
                  },
                  create: {
                    idUnidade: unidade,
                  },
                };
            }),
            deleteMany: {
              NOT: unidades?.map((unidade: number) => ({ idCampanha: idCampanha.toString(), idUnidade: unidade })),
            }
          },
          redesSociais: {
            connectOrCreate: redesSociais.map((rede: number) => {
                return {
                  where: {
                    idCampanha_idRede: {
                      idCampanha: idCampanha.toString(),
                      idRede: rede
                    }
                  },
                  create: {
                    idRede: rede,
                  },
                };
            }),
            deleteMany: {
              NOT: redesSociais?.map((rede: number) => ({ idCampanha: idCampanha.toString(), idRede: rede })),
            }
          },
        },
        include:{
          unidades:true,
          redesSociais: true
        }
      })

      return res.status(200).json(campanha)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async pesquisarCampanhas (req: Request, res: Response): Promise<Response> {
    try {
      const { pagina, porPagina, nome, idZappier } = req.body

      const completo = await prisma.campanhas.findMany({
        where: {
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          idZappier: idZappier ? {contains: idZappier.toString(), mode: 'insensitive'} : undefined,
        },
        orderBy: {
          nome: 'asc'
        }
      })

      const campanhas = await prisma.campanhas.findMany({
        where: {
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          idZappier: idZappier ? {contains: idZappier.toString(), mode: 'insensitive'} : undefined,
        },
        orderBy: {
          nome: 'asc'
        },
        include: {
          redesSociais:true,
          unidades: true
        },
        take: Number(porPagina),
        skip: ( Number(pagina) - 1) * Number(porPagina),
      })

      return res.status(200).json({ campanhas, total: completo.length, paginas: Math.ceil(completo.length/Number(porPagina)) })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }
}

export default new CampanhasController()
