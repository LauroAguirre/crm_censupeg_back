import { Router } from 'express'
import usuariosController from 'src/controllers/usuariosController'
import authMiddleware from 'src/middleware/authMiddleware'
// import authController from '../services/controllers/authController'

const router = Router()

router.get('/usuarios/:idUsuario', usuariosController.buscarUsuario)

router.post('/usuarios/novo', usuariosController.novoUsuario)


export default router
