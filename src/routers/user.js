const express = require('express')
const router = new express.Router()

const User = require('../models/user')

router.post('/users', async (req, res)=>{   
    const user = new User(req.body);
    try{
        await user.save()
        res.status(201).send(user)
    } catch(error){
        res.status(400).send(error)
    }       
})

router.get('/users', async (req, res)=>{
    try{
        const users = await User.find({})
        res.send(users)
    }catch(error){
        res.status(500).send(error)
    }
})

router.get('/users/:id', async (req, res)=>{
    const _id = req.params.id;
    try{
        const user = await User.findById({_id})
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(error){
        res.send(error).status(500)
    }  
})

router.patch('/users/:id', async (req, res)=>{

    const allowedUpdates = ['firstName', 'lastName', 'email', 'password']
    const updates = Object.keys(req.body)

    const isAllowed = updates.every((update)=>allowedUpdates.includes(update))

    if(!isAllowed){
        return res.status(400).send({error: "Invalid updates"})
    }
    const _id = req.params.id;
    try{


        //const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators:true})
        const user = await User.findById(_id);

        updates.forEach((update)=>user[update]=req.body[update])
        await user.save()
        
        if(!user){
            return res.status(404).send()
        }
        res.send(user).status(201)
    }catch(error){
        res.status(400).send(error)
    }
})

router.delete('/users/:id', async(req, res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(error){
        res.status(500).send(error)
    }
    
})

router.post('/users/login', async (req, res)=>{
    try{
        
        const user = await User.authenticateUser(req.body.email, req.body.password)
        res.send(user)
    }catch(e){
        res.send(e).status(400)
    }
})

module.exports = router










// app.post('/users', (req, res)=>{   
//     const user = new User(req.body);
//     user.save()
//         .then(()=>{
//             res.status(201).send(user)
//         })
//         .catch((error)=>{
//             res.status(400)
//             res.send(error)
//         })     
// })



// app.get('/users', (req, res)=>{
    
//     User.find({}).then((users)=>{
//         res.send(users)
//     })
//     .catch((error)=>{
//         res.status(500).send(error)
//     })
// })








// app.get('/users/:id', (req, res)=>{
    
//     const _id = req.params.id;
//     User.findById(_id).then((user)=>{
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     })
//     .catch(()=>{
//         res.status(500).send()
//     })
// })