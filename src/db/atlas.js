// const mongoose = require('mongoose')
// const validator =  require('validator')

const DB_URL = 'mongodb+srv://root:P@ssw0rd@cluster0.7jass.mongodb.net?retryWrites=true&w=majority'

//const DB_URL = 'mongodb+srv://root:P@ssw0rd@cluster0.7jass.mongodb.net/telalaki?retryWrites=true&w=majority'


// mongoose.connect(DB_URL, { useNewUrlParser:true, useCreateIndex:true })

// const User = mongoose.model('user', {
//     firstName: {
//         type: String,
//         required: true
//     },
//     lastName:{
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         validate(val){
//             if(!validator.isEmail(val)){
//                 throw new Error('Invalid Email')
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 6
//     },
//     active:{
//         type: Boolean,
//         required:true
//     }
// });

// const admin= new User({
//     firstName: 'Yonas',
//     lastName: 'Yeneneh',
//     email: 'expertsanoy@gmail.com',
//     password: 'P@ssw0rd',
//     active: true
// });

// admin.save().then((result)=>console.log(result)).catch(error=>console.log(error))




const mongodb = require('mongodb').MongoClient



mongodb.connect(DB_URL, (error, client)=>{
    if(error){
        console.log('Unable to conncet')
    }

    const db = client.db('telalaki')

    db.collection('tasks').insertOne({
        name: 'Task 1',
        complited: false
    }).then(result=>console.log(result)).catch(error => console.log(error))
})

