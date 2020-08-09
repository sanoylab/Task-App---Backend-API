const express =  require('express')
const path =require('path')
require('./db/mongoose')
require('dotenv').config()

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const PORT = process.env.PORT ||3000

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.listen(PORT, ()=>{
        console.log(`Server started on PORT ${PORT}`)
    }
)
