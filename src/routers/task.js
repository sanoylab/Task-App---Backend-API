const express = require('express')
const router = express.Router()

const Task = require('../models/task')


router.post('/tasks', async (req, res)=>{
    const task = new Task(req.body)
    try{
        await task.save()
        res.send(task).status(201)
    }catch(error){
        res.send(error).status(400)
    }
})

router.get('/tasks', async (req, res)=>{
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }catch(error){
        res.status(500).send(error)
    }

})

router.get('/tasks/:id', async (req, res)=>{
    const _id = req.params.id;
    try{
        const task = await Task.findById({_id})
        if(!task){
            return res.send().status(404)
        }
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }

})

router.patch('/tasks/:id', async (req, res)=>{
    try{
        const allowedUpdates = ["description", "completed"]
        const updates = Object.keys(req.body)

        const isAllowedUpdate = updates.every(update=>allowedUpdates.includes(update))
        if(!isAllowedUpdate){
            return res.status(400).send({error: 'Invalid update'})
        }
        const task = await Task.findById(req.params.id)

        updates.forEach(update=>task[update] = req.body[update])
        await task.save()
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body,{new:true, runValidators:true} )
        if(!task){
            return res.status(404).send()
        }
        res.status(201).send(task)
        
    }catch(error){
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', async (req, res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)        
    }catch(error){
        res.status(500).send(error)
    }
})

module.exports = router