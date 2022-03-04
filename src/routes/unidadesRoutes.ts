import { Router } from 'express'
import unidadesController from 'src/controllers/unidadesController'
import authMiddleware from 'src/middleware/authMiddleware'

const router = Router()

router.get('/unidades/:idUnidade', authMiddleware, unidadesController.buscarUnidade)


router.post('/unidades/novo', authMiddleware, unidadesController.novaUnidade)
router.post('/unidades/:idUnidade/vincularUsuario', authMiddleware, unidadesController.vincularUsuario)


export default router
