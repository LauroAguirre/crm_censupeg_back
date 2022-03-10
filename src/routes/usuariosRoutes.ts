import { Router } from 'express'
import usuariosController from 'src/controllers/usuariosController'
import authMiddleware from 'src/middleware/authMiddleware'
// import authController from '../services/controllers/authController'

const router = Router()

router.get('/usuarios/:idUsuario', authMiddleware, usuariosController.buscarUsuario)
router.get('/usuarios/logado', authMiddleware, usuariosController.getUsuarioLogado)
router.get('/usuarios/getUsuariosUnidade', authMiddleware, usuariosController.getUsuariosUnidade)
router.get('/usuarios/getListaUsuarios', authMiddleware, usuariosController.getListaUsuarios)

router.post('/usuarios/novo', authMiddleware, usuariosController.novoUsuario)


export default router
