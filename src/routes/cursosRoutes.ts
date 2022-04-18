import { Router } from 'express'
import cursosController from 'src/controllers/cursosController'
import authMiddleware from 'src/middleware/authMiddleware'

const router = Router()

router.get('/cursos/:idCurso', authMiddleware, cursosController.buscarCurso)
router.get('/pesquisarCursos', authMiddleware, cursosController.pesquisarCurso)
router.get('/getListaCursos', authMiddleware, cursosController.getListaCursos)


router.put('/cursos/:idCurso/editar', authMiddleware, cursosController.editarCurso)


router.post('/novoCurso', authMiddleware, cursosController.novoCurso)


export default router
