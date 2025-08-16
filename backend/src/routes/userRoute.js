import express from 'express'
import { verification } from '../middleware/verifyToken.js'
import {login, logout, register} from '../controller/userController.js';
import { userSchema, validateUser } from '../validator/userValidator.js';
import { hasToken } from '../middleware/hasToken.js';

const route = express.Router()

route.post('/register', validateUser(userSchema), register);
route.get('/verify', verification)
route.post('/login', login)
route.delete('/logout', hasToken, logout)

export default route