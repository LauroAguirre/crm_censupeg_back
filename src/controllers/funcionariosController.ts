import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { verify } from 'jsonwebtoken'
import { JWTHeader } from '../providers/JWTHeader'
import gerarSenha from '../providers/gerarSenha'
import dayjs from 'dayjs'

const prisma = new PrismaClient()

class FuncionariosController {
  async novoFuncionario (req: Request, res: Response): Promise<Response> {
    try {
      const { nome, telefone, email, perfilFuncionario, ativo, cpf } = req.body

      // const senha = '123'
      const senha = gerarSenha.gerarNovaSenha(5)

      const funcionario = await prisma.funcionarios.create({
        data:{
          nome,
          telefone,
          email,
          senha: bcrypt.hashSync(senha, 8),
          perfilFuncionario,
          ativo,
          cpf: cpf ? cpf.replace(/\D/g, '') : null,
        }
      })

      return res.status(200).json({ funcionario, senha })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async getFuncionarioLogado (req: Request, res: Response): Promise<Response> {
    try {
      const authHeader = req.headers.authorization
      const [, token] = authHeader.split(' ')

      verify(token, process.env.JWT_TOKEN, async (error, headerToken:JWTHeader) => {
        if (error) {
          return res.status(401).send({ message: 'Funcionário não encontrado' })
        }

        const idFuncionario = headerToken.userId.toString()
        const funcionario = await prisma.funcionarios.findFirst({
          where:{ id: idFuncionario },
          include: { unidades: true}
        })

        delete funcionario.senha

        return res.status(200).json(funcionario)
      })


    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async buscarFuncionario (req: Request, res: Response): Promise<Response> {
    try {
      const { idFuncionario } = req.params

      const funcionario = await prisma.funcionarios.findFirst({
        where:{ id: idFuncionario },
        include: { unidades: true}
      })

      delete funcionario.senha

      return res.status(200).json( funcionario )
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async getFuncionariosUnidade (req: Request, res: Response): Promise<Response> {
    try {
      const { idUnidade } = req.query

      const funcionarios = await prisma.funcionarios.findMany({
        where:{ unidadesId: Number(idUnidade) },
        orderBy: [
          {
            nome: 'asc',
          },
        ],
      })

      return res.status(200).json(funcionarios)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async pesquisarFuncionarios (req: Request, res: Response): Promise<Response> {
    try {
      const { pagina, porPagina, unidade, nome, email, ativo, cpf} = req.query

      const filtroAtivos = ativo ? ativo === 'true' : undefined

      const completo = await prisma.funcionarios.findMany({
        where:{
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          cpf: cpf ? {equals: cpf.toString().replace(/\D/g, '')} : undefined,
          unidadesId: unidade ? {equals: Number(unidade)} : undefined,
          email: email ? {contains: email.toString(), mode: 'insensitive'} : undefined,
          ativo: ativo ? Boolean(ativo) : undefined
        }})

      const funcionarios = await prisma.funcionarios.findMany({
        where:{
          nome: nome ? {contains: nome.toString(), mode: 'insensitive'} : undefined,
          cpf: cpf ? {equals: cpf.toString().replace(/\D/g, '')} : undefined,
          unidadesId: unidade ? {equals: Number(unidade)} : undefined,
          email: email ? {contains: email.toString(), mode: 'insensitive'} : undefined,
          ativo: filtroAtivos
        },
        include: {
          unidades: true,
        },
        take: Number(porPagina),
        skip: ( Number(pagina) - 1) * Number(porPagina),
        orderBy: [
          {
            nome: 'asc',
          },
        ],
      })

      return res.status(200).json({ funcionarios, total: completo.length, paginas: Math.ceil(completo.length/Number(porPagina)) })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async editarFuncionario (req: Request, res: Response): Promise<Response> {
    console.log('Editando funcionário...')
    try {
      const { nome, telefone, email, perfilFuncionario, ativo, cpf } = req.body
      const { idFuncionario } = req.params

      const funcionario = await prisma.funcionarios.update({
        where: {id: idFuncionario.toString()},
        data:{
          nome,
          telefone: telefone.replace(/\D/g, ''),
          email,
          perfilFuncionario,
          ativo,
          cpf: cpf.replace(/\D/g, ''),
        }
      })
      console.log('Funcionário:')
      console.log(funcionario)
      console.log('----------------------')

      delete funcionario.senha

      return res.status(200).json({ funcionario })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async atualizarSenha (req: Request, res: Response): Promise<Response> {
    const { senhaAtual, novaSenha } = req.body
    const { idFuncionario } = req.params

    try {
      const funcionario = await prisma.funcionarios.findFirst({where:{id: idFuncionario.toString()}})
      const validatePass = await bcrypt.compare(senhaAtual, funcionario.senha)

      if (!validatePass) {
        return res.status(401).send({ message: 'Usuário ou senha inválidos!' })
      }

      await prisma.funcionarios.update({
        where: {id: idFuncionario.toString()},
        data:{ senha:  bcrypt.hashSync(novaSenha, 8), senhaTemp: false}
      })

      delete funcionario.senha

      return res.status(200).send(funcionario)

    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async resetarSenha (req: Request, res: Response): Promise<Response> {
    const { idFuncionario } = req.params

    try {
      const novaSenha = gerarSenha.gerarNovaSenha(5)

      await prisma.funcionarios.update({
        where: {id: idFuncionario.toString()},
        data:{ senha: bcrypt.hashSync(novaSenha, 8) }
      })

      return res.status(200).send(novaSenha)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  async getAtividadesFuncionario (req: Request, res: Response): Promise<Response> {
    try {
      const {dtInicio, dtFim} = req.query
      const { idFuncionario } = req.params

      const dataInicio = new Date(dayjs(dtInicio.toString()).format('YYYY-MM-DD')).toLocaleString()
      const dataFim = new Date(dayjs(dtFim.toString()).add(1,'day').format('YYYY-MM-DD')).toLocaleString()

      const atividades = await listarAtividadesFuncionario( idFuncionario, dataInicio, dataFim)

      // const contatosCandidatos = await prisma.contatoCandidatos.findMany({
      //   where: {
      //     idFuncionario,
      //     dtContato: {
      //       gte: dataInicio,
      //       lte: dataFim
      //     }
      //   },
      //   include:{
      //     funcionario:true,
      //     candidato: true
      //   }
      // })

      // const contatosEmpresas = await prisma.contatoEmpresas.findMany({
      //   where: {
      //     idFuncionario,
      //     dtContato: {
      //       gte: dataInicio,
      //       lte: dataFim
      //     }
      //   },
      //   include:{
      //     funcionario:true,
      //     empresa: true
      //   }
      // })

      // const outrasAtividades = await prisma.atividades.findMany({
      //   where: {
      //     idFuncionario,
      //     dtAtividade: {
      //       gte: dataInicio,
      //       lte: dataFim
      //     }
      //   },
      //   include:{
      //     funcionario:true
      //   }
      // })

      // let atividades = []

      // contatosCandidatos.forEach(contato =>{
      //   atividades.push({
      //     dtAtividade: contato.dtContato,
      //     idContato: contato.idCandidato,
      //     nome: contato.candidato.nome,
      //     detalhes: contato.edital ? `${contato.edital} - ${contato.infosContato}` : contato.infosContato
      //   })
      // })
      // contatosEmpresas.forEach(contato =>{
      //   atividades.push({
      //     dtAtividade: contato.dtContato,
      //     idContato: contato.idEmpresa,
      //     nome: contato.empresa.nome,
      //     detalhes: contato.areasInteresse ? `Interesse em ${contato.areasInteresse}. ${contato.infosContato}` : contato.infosContato
      //   })
      // })
      // outrasAtividades.forEach(atividade =>{
      //   atividades.push({
      //     dtAtividade: atividade.dtAtividade,
      //     detalhes: atividade.descricao
      //   })
      // })

      // atividades = atividades.sort((a, b) => {
      //   return b.dtAtividade - a.dtAtividade
      // })

      return res.status(200).send(atividades)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }
}

export default new FuncionariosController()

export const listarAtividadesFuncionario = async ( idFuncionario:string, dataInicio: string, dataFim: string) => {
  const contatosCandidatos = await prisma.contatoCandidatos.findMany({
    where: {
      idFuncionario,
      dtContato: {
        gte: dataInicio,
        lte: dataFim
      }
    },
    include:{
      funcionario:true,
      candidato: true
    }
  })

  const contatosEmpresas = await prisma.contatoEmpresas.findMany({
    where: {
      idFuncionario,
      dtContato: {
        gte: dataInicio,
        lte: dataFim
      }
    },
    include:{
      funcionario:true,
      empresa: true
    }
  })

  const outrasAtividades = await prisma.atividades.findMany({
    where: {
      idFuncionario,
      dtAtividade: {
        gte: dataInicio,
        lte: dataFim
      }
    },
    include:{
      funcionario:true
    }
  })

  let atividades = []

  contatosCandidatos.forEach(contato =>{
    atividades.push({
      dtAtividade: contato.dtContato,
      idContato: contato.idCandidato,
      nome: contato.candidato.nome,
      detalhes: contato.edital ? `${contato.edital} - ${contato.infosContato}` : contato.infosContato
    })
  })
  contatosEmpresas.forEach(contato =>{
    atividades.push({
      dtAtividade: contato.dtContato,
      idContato: contato.idEmpresa,
      nome: contato.empresa.nome,
      detalhes: contato.areasInteresse ? `Interesse em ${contato.areasInteresse}. ${contato.infosContato}` : contato.infosContato
    })
  })
  outrasAtividades.forEach(atividade =>{
    atividades.push({
      dtAtividade: atividade.dtAtividade,
      detalhes: atividade.descricao
    })
  })

  atividades = atividades.sort((a, b) => {
    return b.dtAtividade - a.dtAtividade
  })

  return atividades
}
