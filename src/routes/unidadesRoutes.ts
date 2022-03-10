import { Router } from 'express'
import unidadesController from 'src/controllers/unidadesController'
import authMiddleware from 'src/middleware/authMiddleware'

const router = Router()

router.get('/unidades/:idUnidade', authMiddleware, unidadesController.buscarUnidade)
router.get('/pesquisarUnidades', authMiddleware, unidadesController.pesquisarUnidades)
router.get('/getListaUnidades', authMiddleware, unidadesController.getListaUnidades)

router.put('/unidades/:idUnidade/vincularUsuario', authMiddleware, unidadesController.vincularUsuario)
router.put('/unidades/:idUnidade/removerUsuario', authMiddleware, unidadesController.removerUsuario)

router.post('/unidades/novo', authMiddleware, unidadesController.novaUnidade)


export default router
