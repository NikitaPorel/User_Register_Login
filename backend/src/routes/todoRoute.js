import express from 'express'
import { addTodo, getTodo } from '../controller/todoController.js';
import { hasToken } from '../middleware/hasToken.js';

const todoRoute = express.Router()

todoRoute.post('/create', hasToken, addTodo);
todoRoute.get('/getAll', hasToken, getTodo);



export default todoRoute