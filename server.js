import http, { Server } from 'http'
import app from './app'
import WebSocket from 'ws'

const PORT=process.env.PORT  || 5000

const server=http.createServer(app)













server.listen(PORT, ()=>    {
    console.log(`Server started on ${PORT}`)
})

















