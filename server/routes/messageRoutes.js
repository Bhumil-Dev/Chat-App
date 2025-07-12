import express from 'express'
import { protectedRoute } from "../middleware/auth.js"
import { getMessage, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../controllers/messageController.js'

const messageRouter = express.Router()

messageRouter.get("/users",protectedRoute ,getUsersForSidebar)
messageRouter.get("/:id",protectedRoute ,getMessage)
messageRouter.get("/mark/:id",protectedRoute ,markMessageAsSeen)
messageRouter.post("/send/:id",protectedRoute ,sendMessage)

export default messageRouter;