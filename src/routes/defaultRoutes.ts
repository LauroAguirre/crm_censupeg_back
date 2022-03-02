import { Router } from 'express'
import authMiddleware from 'src/middleware/authMiddleware'

const router = Router()

router.get('/', (req, res, next) => {
  res.status(200).send({
    title: 'CRM Censupeg API',
    version: 'Beta 0.0.1'
  })
})


export default router
