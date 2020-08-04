const express = require('express')
const router = new express.Router()

const User = require('../models/user')

const auth = require('../middleware/auth')

router.post('/users', async (req, res)=>{   
    const user = new User(req.body);
    try{
        await user.save()
        const token = await user.generateAuthToken()
        
        res.status(201).send({user, token})
    } catch(error){
        res.status(400).send(error)
    }       
})

router.post('/users/logout', auth, async (req, res)=>{
    try{
         req.user.tokens = req.user.tokens.filter((token)=>{
             token.token !== req.token
         })
      
        await req.user.save()
        res.send(200)
    }catch(e){
        res.send(e).status(500)
    }
})

router.post('/users/logoutall', auth, async (req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send(200)
    }catch(e){
        res.send(e).status(500)
    }
})

router.get('/users', auth, async (req, res)=>{
    try{
        const users = await User.find({})
        res.send(users)
    }catch(error){
        res.status(500).send(error)
    }
})
router.get('/users/me', auth, (req, res)=>{
    res.send(req.user)
})

router.get('/users/:id', auth, async (req, res)=>{
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

router.patch('/users/me', auth, async (req, res)=>{

    const allowedUpdates = ['firstName', 'lastName', 'email', 'password']
    const updates = Object.keys(req.body)

    const isAllowed = updates.every((update)=>allowedUpdates.includes(update))

    if(!isAllowed){
        return res.status(400).send({error: "Invalid updates"})
    }
    const _id = req.params.id;
    try{
        //const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators:true})
        updates.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save()
        
       
        res.send(req.user).status(201)
    }catch(error){
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth, async(req, res)=>{
    try{
        //const user = await User.findByIdAndDelete(req.user._id)
        await req.user.remove()
        res.send(req.user)
    }catch(error){
        res.status(500).send(error)
    }
    
})

router.post('/users/login', async (req, res)=>{
    try{
        const user = await User.authenticateUser(req.body.email, req.body.password)
      
        const token = await user.generateAuthToken()  
        console.log(token);
        res.send({user, token})
        
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