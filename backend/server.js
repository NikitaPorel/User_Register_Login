import express from 'express';
import dotenv from 'dotenv'
import { Connection } from './src/config/dbConnection.js';
import route from './src/routes/userRoute.js';
dotenv.config()

const app = express();

const port= process.env.PORT;

Connection()

app.use(express.json())

app.use('/user', route)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port,()=>{
    console.log(`server running at port ${port}`);
})

// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
