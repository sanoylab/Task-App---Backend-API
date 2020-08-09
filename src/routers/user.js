const express = require('express')
const multer = require('multer')
const router = new express.Router()
const sharp = require('sharp')

const User = require('../models/user')

const auth = require('../middleware/auth')
const {
    sendWelcomeEmail, 
    sendCancelEmail 
} = require('../emails/account')


router.post('/users', async (req, res)=>{   
    const user = new User(req.body);
    try{
        await user.save()
        sendWelcomeEmail(user.firstName, user.email)
        const token = await user.generateAuthToken()
      
        res.status(201).send({user, token})
    } catch(error){
        res.status(400).send(error)
    }       
})
const uploadAvatar = multer({
    //dest: 'src/images/avatars',
    limits: {
        fieldSize: 1000000 // 2 MB
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){            
           return cb(new Error('File type is not supported'))
        } else{
             cb(undefined, true)
        }
       
    }
    
})

router.post('/users/me/avatar',auth,  uploadAvatar.single('avatar'), async (req, res)=>{
    //req.user.avatar = req.file.buffer
    const buffer = await sharp(req.file.buffer).png().resize({width: 250, height: 250}).toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send(req.user)
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res)=>{
     req.user.avatar = undefined
     await req.user.save()
     res.send(req.user)
})

router.get('/users/:id/avatar', async (req, res)=>{
    try{
        const user =  await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.send().status(404)
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
        console.log('hi', req.user)
        await req.user.remove()
        sendCancelEmail(req.user.firstName, req.user.email)
        res.send(req.user)
    }catch(error){
        res.status(500).send(error)
    }
    
})

router.post('/users/login', async (req, res)=>{
    try{
        const user = await User.authenticateUser(req.body.email, req.body.password)
        const token = await user.generateAuthToken()  
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