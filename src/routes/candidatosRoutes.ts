import { Router } from 'express'
import atividadesController from 'src/controllers/atividadesController'
import candidatosController from 'src/controllers/candidatosController'
import authMiddleware from 'src/middleware/authMiddleware'

const router = Router()

router.get('/candidatos/:idCandidato', authMiddleware, candidatosController.buscarCandidato)
router.get('/candidatos/:idCandidato/getHistoricoContato', authMiddleware, atividadesController.getHistoricoContatoCandidato)
router.get('/pesquisarCandidatos', authMiddleware, candidatosController.pesquisarCandidato)
// router.get('/getListaCursos', authMiddleware, cursosController.getListaCursos)


router.put('/candidatos/:idCandidato/editar', authMiddleware, candidatosController.editarCandidato)


router.post('/novoCandidato', authMiddleware, candidatosController.novoCandidato)
router.post('/candidatos/:idCandidato/salvarContato', authMiddleware, atividadesController.contatoCandidato)


export default router
