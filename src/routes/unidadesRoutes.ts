import { Router } from 'express'
import unidadesController from '../controllers/unidadesController'
import authMiddleware from '../middleware/authMiddleware'

const router = Router()

router.get('/unidades/:idUnidade', authMiddleware, unidadesController.buscarUnidade)
router.get('/pesquisarUnidades', authMiddleware, unidadesController.pesquisarUnidades)
router.get('/getListaUnidades', authMiddleware, unidadesController.getListaUnidades)

router.put('/unidades/:idUnidade/editarUnidade', authMiddleware, unidadesController.editarUnidade)
router.put('/unidades/:idUnidade/vincularFuncionario', authMiddleware, unidadesController.vincularFuncionario)
router.put('/unidades/:idUnidade/removerFuncionario', authMiddleware, unidadesController.removerFuncionario)

router.post('/unidades/novo', authMiddleware, unidadesController.novaUnidade)


export default router
