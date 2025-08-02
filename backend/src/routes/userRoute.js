import express from 'express'
import { verification } from '../middleware/verifyToken.js'
import {login, register} from '../controller/userController.js';
import { userSchema, validateUser } from '../validator/userValidator.js';

const route = express.Router()

route.post('/register', validateUser(userSchema), register);
route.get('/verify', verification)
route.post('/login', login)
// route.post('/logout', logout)

export default route