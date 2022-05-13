import { Request, Response } from 'express'
import { Matriculas, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface DadosMatricula{
  idCandidato: string,
  idCurso: number,
  dtMatricula: Date,
  idFuncionario: string
  idContato?: number
}
class MatriculasController {
 async getMatriculasPorPeriodo(req:Request, res:Response): Promise<Response> {
   try {
     const {dtInicio, dtFim} = req.query
    const matriculas = await prisma.matriculas.findMany({
      where:{
        dtMatricula: {
          gte: new Date(dtInicio.toLocaleString()),
          lte: new Date(dtFim.toLocaleString())
        }
      }
    })

    return res.status(200).send(matriculas)
   } catch (error) {
    console.error(error)
    return res.status(500).json(error)
   }
 }
}

export const registrarMatricula = async (matricula:DadosMatricula):Promise<Matriculas> => {
  const {idCandidato, idCurso, dtMatricula, idFuncionario, idContato} = matricula
  try {
    const novaMatricula = await prisma.matriculas.create({
      data:{
        dtMatricula,
        candidato: {
          connect:{
            id: idCandidato
          }
        },
        curso: {
          connect: {
            id: idCurso
          }
        },
        funcionarioResponsavel: {
          connect: {
            id: idFuncionario
          }
        }
      },
      include:{
        candidato: true,
        curso: true,
      }
    })

    const perfilCandidato = await prisma.candidatos.findUnique({where: {id: idCandidato}})
    const curso = await prisma.cursos.findUnique({where: {id: idCurso}})

    await prisma.candidatos.update({
      where: {
        id: idCandidato
      },
      data: {
        alunoCensupeg: true,
        cursoAtual: perfilCandidato.cursoAtual?.length > 0 ? `${perfilCandidato.cursoAtual}, ${curso.nome}` : curso.nome
      }
    })

    await prisma.contatoCandidatos.update({
      where: {
        idContato: idContato
      },
      data: {
        matricula: {
          connect: {
            id: novaMatricula.id
          }
        }
      }
    })

    return novaMatricula
  } catch (error) {
    throw new Error(error)
  }

}

export default new MatriculasController()
