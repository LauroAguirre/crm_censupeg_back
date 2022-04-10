import { Router } from 'express'
import funcionariosController from 'src/controllers/funcionariosController'
import authMiddleware from 'src/middleware/authMiddleware'
// import authController from '../services/controllers/authController'

const router = Router()

router.get('/funcionarios/:idFuncionario', authMiddleware, funcionariosController.buscarFuncionario)
router.get('/logado', authMiddleware, funcionariosController.getFuncionarioLogado)
router.get('/getFuncionariosUnidade', authMiddleware, funcionariosController.getFuncionariosUnidade)
router.get('/pesquisarFuncionarios', authMiddleware, funcionariosController.pesquisarFuncionarios)
router.get('/getListaFuncionarios', authMiddleware, funcionariosController.getListaFuncionarios)


router.put('/funcionarios/:idFuncionario/editar', authMiddleware, funcionariosController.editarFuncionario)
router.put('/funcionarios/:idFuncionario/resetarSenha', authMiddleware, funcionariosController.resetarSenha)
router.put('/funcionarios/:idFuncionario/atualizarSenha', authMiddleware, funcionariosController.atualizarSenha)

router.post('/novoFuncionario', authMiddleware, funcionariosController.novoFuncionario)
router.post('/primeiroFuncionario', funcionariosController.novoFuncionario)


export default router
