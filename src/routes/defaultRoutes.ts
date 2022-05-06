import { Router } from 'express'

const router = Router()

router.get('/', (req, res, next) => {
  res.status(200).send({
    title: 'CRM Censupeg API',
    version: 'Beta 0.0.1'
  })
})


export default router
