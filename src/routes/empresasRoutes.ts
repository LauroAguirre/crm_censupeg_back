import { Router } from 'express'
import atividadesController from 'src/controllers/atividadesController'
import empresasController from 'src/controllers/empresasController'
import authMiddleware from 'src/middleware/authMiddleware'

const router = Router()

router.get('/empresas/:idEmpresa', authMiddleware, empresasController.buscarEmpresa)
router.get('/empresas/:idEmpresa/getHistoricoContato', authMiddleware, atividadesController.getHistoricoContatoEmpresa)
router.get('/pesquisarempresas', authMiddleware, empresasController.pesquisarEmpresa)
router.get('/getListaempresas', authMiddleware, empresasController.getListaEmpresas)


router.put('/empresas/:idEmpresa/editar', authMiddleware, empresasController.editarEmpresa)


router.post('/novaEmpresa', authMiddleware, empresasController.novaEmpresa)
router.post('/empresas/:idEmpresa/salvarContato', authMiddleware, atividadesController.contatoEmpresa)


export default router
