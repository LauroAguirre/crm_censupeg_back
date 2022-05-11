import { Router } from 'express'
import atividadesController from '../controllers/atividadesController'
import funcionariosController from '../controllers/funcionariosController'
import authMiddleware from '../middleware/authMiddleware'
// import authController from '../services/controllers/authController'

const router = Router()

router.get('/funcionarios/:idFuncionario', authMiddleware, funcionariosController.buscarFuncionario)
router.get('/logado', authMiddleware, funcionariosController.getFuncionarioLogado)
router.get('/getFuncionariosUnidade', authMiddleware, funcionariosController.getFuncionariosUnidade)
router.get('/pesquisarFuncionarios', authMiddleware, funcionariosController.pesquisarFuncionarios)
router.get('/funcionarios/:idFuncionario/getAtividades', authMiddleware, funcionariosController.getAtividadesFuncionario)
router.get('/funcionarios/:idFuncionario/relAtividades', authMiddleware, funcionariosController.getRelAtividadesFuncionario)


router.put('/funcionarios/:idFuncionario/editar', authMiddleware, funcionariosController.editarFuncionario)
router.put('/funcionarios/:idFuncionario/resetarSenha', authMiddleware, funcionariosController.resetarSenha)
router.put('/funcionarios/:idFuncionario/atualizarSenha', authMiddleware, funcionariosController.atualizarSenha)

router.post('/novoFuncionario', authMiddleware, funcionariosController.novoFuncionario)
router.post('/registrarAtividade', authMiddleware, atividadesController.atividade)
router.post('/primeiroFuncionario', funcionariosController.novoFuncionario)


export default router
