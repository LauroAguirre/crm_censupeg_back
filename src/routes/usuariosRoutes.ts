import { Router } from 'express'
import usuariosController from 'src/controllers/usuariosController'
import authMiddleware from 'src/middleware/authMiddleware'
// import authController from '../services/controllers/authController'

const router = Router()

router.get('/usuarios/:idUsuario', authMiddleware, usuariosController.buscarUsuario)
router.get('/logado', authMiddleware, usuariosController.getUsuarioLogado)
router.get('/getUsuariosUnidade', authMiddleware, usuariosController.getUsuariosUnidade)
router.get('/pesquisarUsuarios', authMiddleware, usuariosController.pesquisarUsuarios)
router.get('/getListaUsuarios', authMiddleware, usuariosController.getListaUsuarios)


router.put('/usuarios/:idUsuario/editar', authMiddleware, usuariosController.editarUsuario)
router.put('/usuarios/:idUsuario/resetarSenha', authMiddleware, usuariosController.resetarSenha)
router.put('/usuarios/:idUsuario/atualizarSenha', authMiddleware, usuariosController.atualizarSenha)

router.post('/usuarios/novo', authMiddleware, usuariosController.novoUsuario)


export default router
