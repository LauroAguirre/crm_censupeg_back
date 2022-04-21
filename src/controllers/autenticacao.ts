import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import requestIp from 'request-ip'
import { sign } from 'jsonwebtoken'
import criarRefreshTk from 'src/providers/criarRefreshTk'

const prisma = new PrismaClient()

class AutenticacaoController {
  async autenticar (req: Request, res: Response): Promise<Response> {
    console.log('Iniciando a autenticação...')
    try {
      const { email, senha } = req.body
      const ipOrigem = requestIp.getClientIp(req)

      console.log(req.body)

      const funcionario = await prisma.funcionarios.findFirst({
        where:{email},
        include: { Unidades: true}})
      console.log('Funcionario:')
      console.log(funcionario)
      console.log('----------------------')

      if (!funcionario || funcionario.ativo === false) {
        return res.status(401).send({ message: 'Usuário não encontrado!' })
      }

      const validatePass = await bcrypt.compare(senha, funcionario.senha)

      if (!validatePass) {
        console.log('senha inválida')
        return res.status(401).send({ message: 'Usuário ou senha inválidos!' })
      }

      const infosToken = {
        userId: funcionario.id,
        email: funcionario.email,
        perfil: funcionario.perfilFuncionario
      }

      const jwt = sign(infosToken, process.env.JWT_TOKEN)
      const refreshTk = await criarRefreshTk.createRefresh(funcionario.id, jwt, ipOrigem)

      return res.status(200).json({ funcionario, jwt, refreshTk })
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }
}

export default new AutenticacaoController()
