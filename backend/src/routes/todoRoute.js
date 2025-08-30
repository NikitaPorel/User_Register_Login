import express from 'express'
import { addTodo, deleteTodo, getTodo, getTodoById, updateTodo } from '../controller/todoController.js';
import { hasToken } from '../middleware/hasToken.js';
import { todoSchema, validateTodo } from '../validator/todoValidator.js';

const todoRoute = express.Router()

todoRoute.post('/create', validateTodo(todoSchema) ,hasToken, addTodo);
todoRoute.get('/getAll', hasToken, getTodo);
todoRoute.delete('/delete/:id', hasToken, deleteTodo);
todoRoute.put('/update/:id', hasToken, updateTodo);
todoRoute.get('/getById/:id', hasToken, getTodoById);


export default todoRoute