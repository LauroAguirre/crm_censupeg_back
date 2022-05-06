import { Router } from 'express'
import agendamentosController from 'src/controllers/agendamentosController'
import campanhasController from 'src/controllers/campanhasController'
import authMiddleware from 'src/middleware/authMiddleware'

const router = Router()

router.get('/getAgendamentosPorPeriodo', authMiddleware, agendamentosController.getAgendamentosPorPeriodo)

router.put('/agendamentos/:idAgendamento', authMiddleware, agendamentosController.editarAgendamento)

router.post('/agendarAtividade', authMiddleware, agendamentosController.agendarAtividade)


export default router
