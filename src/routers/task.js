const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const Task = require('../models/task')


router.post('/tasks', auth, async (req, res)=>{
    //const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        'createdBy':req.user._id
    })
    try{
        await task.save()
        res.send(task).status(201)
    }catch(error){
        res.send(error).status(400)
    }
})

router.get('/tasks', auth, async (req, res)=>{
    try{
        const tasks = await Task.find({createdBy: req.user._id})
        res.send(tasks)
    }catch(error){
        res.status(500).send(error)
    }

})

router.get('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id;
    try{
        //const task = await Task.findById({_id})

        const task = await Task.findOne({_id, createdBy: req.user._id})
        console.log('hhh', task)
        if(!task){
            return res.send().status(404)
        }
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }

})

router.patch('/tasks/:id', auth, async (req, res)=>{
    try{
        const allowedUpdates = ["description", "completed"]
        const updates = Object.keys(req.body)

        const isAllowedUpdate = updates.every(update=>allowedUpdates.includes(update))
        if(!isAllowedUpdate){
            return res.status(400).send({error: 'Invalid update'})
        }
        const task = await Task.findOne({_id:req.params.id, createdBy: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach(update=>task[update] = req.body[update])
        await task.save()
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body,{new:true, runValidators:true} )
        
        res.status(201).send(task)
        
    }catch(error){
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res)=>{
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, createdBy: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)        
    }catch(error){
        res.status(500).send(error)
    }
})

module.exports = router