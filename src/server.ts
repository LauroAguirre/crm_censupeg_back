import http from 'http'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'

// import './database/connect'
import routes from './routes/defaultRoutes'
import auth from './routes/authRoutes'
import usuarios from './routes/usuariosRoutes'
import unidades from './routes/unidadesRoutes'
import cursos from './routes/cursosRoutes'
import { PrismaClient } from '@prisma/client'
// import usr from './routes/usrRoutes'
// import careUnit from './routes/careUnitRoutes'
// import doctor from './routes/doctorRoutes'
// import patient from './routes/patientRoutes'
// import gestation from './routes/gestationRoutes'
// import appointments from './routes/appointmentsRoutes'
// import healthInsurance from './routes/healthInsuranceRoutes'
// import vacines from './routes/vacinesRoutes'
// import exams from './routes/examsRoutes'

require('dotenv').config()

function normalizePort (val:string) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  console.log('Listening on ' + bind)
}

function onError (error:any) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)

    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)

    default:
      throw error
  }
}

const PORT = normalizePort(process.env.PORT || '3001')

const corsConfig = {
  origin: [
    process.env.HTTP_FRONT,
    process.env.HTTPS_FRONT
  ],
  credentials: true
}

const app = express()
app.use(cors(corsConfig))
app.use(cookieParser())
app.use(express.json())
app.use(routes)
app.use(auth)
app.use(usuarios)
app.use(unidades)
app.use(cursos)

const server = http.createServer(app)

server.listen(PORT, () => (console.log(`Startou na porta ${PORT}`)))
server.on('error', onError)
server.on('listening', onListening)

const prisma = new PrismaClient()

prisma.$connect()
  .then(res =>{
    console.log('Conexão com banco: OK')
    prisma.$disconnect()
  })
  .catch(err => {
    console.log('Falha ao conectar com o banco')
    console.log(err)
  })
