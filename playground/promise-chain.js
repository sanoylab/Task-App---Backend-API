require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5f1f82f43c601c4a02fe071d')
//         .then((result)=>{
//             console.log(result)
//            return  Task.countDocuments({completed: false})
//         }).then((result)=>{
//             console.log(result)
//         }).catch(err=>console.log(err))


const deleteTaskAndCount = async (id)=>{
   const taskToDelete = await Task.findByIdAndDelete(id)
   const countDocument = await Task.countDocuments({completed: false})
   return countDocument
}

deleteTaskAndCount('5f20b4ce2ed06460dc24ae66').then((count)=>{
    console.log(count)
}) .catch(err => console.log(err))