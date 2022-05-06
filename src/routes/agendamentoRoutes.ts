import { Router } from 'express'
import agendamentosController from '../controllers/agendamentosController'
import authMiddleware from '../middleware/authMiddleware'

const router = Router()

router.get('/getAgendamentosPorPeriodo', authMiddleware, agendamentosController.getAgendamentosPorPeriodo)

router.put('/agendamentos/:idAgendamento', authMiddleware, agendamentosController.editarAgendamento)

router.post('/agendarAtividade', authMiddleware, agendamentosController.agendarAtividade)


export default router
