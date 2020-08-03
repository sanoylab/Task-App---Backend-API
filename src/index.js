const express =  require('express')
require('./db/mongoose')


const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(PORT, ()=>{
        console.log(`Server started on PORT ${PORT}`)
    }
)

// const jwt = require('jsonwebtoken')

// const myFunction = async ()=>{
//     const token = await jwt.sign({_id: 'abc123'}, 'thisismynewcourse', {expiresIn: '7 days'})
//     console.log(token)

//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)
// }

// myFunction();


