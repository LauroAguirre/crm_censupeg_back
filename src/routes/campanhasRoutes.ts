import { Router } from 'express'
import campanhasController from '../controllers/campanhasController'
import authMiddleware from '../middleware/authMiddleware'

const router = Router()

router.get('/pesquisarCampanhas', authMiddleware, campanhasController.pesquisarCampanhas)

router.put('/campanhas/:idCampanha', authMiddleware, campanhasController.editarCampanhas)

router.post('/campanhas', authMiddleware, campanhasController.cadastrarCampanha)


export default router
