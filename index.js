const express = require('express')
const app = express()
//init config file
require('dotenv').config({ path: './config/config.env' });
//Database Connection
require('./database/connection')
//routes
const userRouter = require('./routes/User');
const authRouter = require('./routes/Login');


app.use(express.json());

app.use('/api', userRouter)
app.use('/api', authRouter)

app.listen(process.env.PORT, () => {
  console.log("Server Running on port" + process.env.PORT);
})