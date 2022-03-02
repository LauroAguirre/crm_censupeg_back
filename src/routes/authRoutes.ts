import { Router } from 'express'
import AutenticacaoController from '../controllers/autenticacao'

const router = Router()

router.post('/login', AutenticacaoController.autenticar)

export default router

