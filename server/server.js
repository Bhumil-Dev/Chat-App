import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import http from 'http'
import { connectDB } from './lib/db.js'
import userRouter from './routes/userRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)

// ✅ SOCKET.IO CORS (for client connection)
export const io = new Server(server, {
  cors: {
    origin: ['https://bhumil-chatapp.netlify.app'], // ⚠️ Updated for production only
    credentials: true
  }
})

export const userSocketMap = {}

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId
  console.log('User Connected:', userId)

  if (userId) userSocketMap[userId] = socket.id

  io.emit('getOnlineUsers', Object.keys(userSocketMap))

  socket.on('disconnect', () => {
    console.log('User Disconnected:', userId)
    delete userSocketMap[userId]
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})

// ✅ Middleware
app.use(express.json({ limit: '4mb' }))

// ✅ CORS for API (main fix)
app.use(cors({
  origin: ['https://bhumil-chatapp.netlify.app'], // ✅ Allow frontend origin
  credentials: true
}))

// ✅ Routes
app.use('/api/status', (req, res) => res.send('server is live'))
app.use('/api/auth', userRouter)
app.use('/api/messages', messageRouter)

// ✅ DB + Server Start
await connectDB()

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`✅ Server is running on PORT: ${PORT}`)
})

export default server
