const asyncHandler = require("express-async-handler");
const Task =require("../models/taskModel")








const getPercentageOfTasks = asyncHandler(async(req,res)=>{
   const id=req.params.id;
  const status=["To Do","Done"];
  const totalTasks = await Task.countDocuments({ projectId: id });

  const ToDoTasks= await Task.countDocuments({projectId:id,status:status[0]});
  const DoneTasks =await Task.countDocuments({projectId:id,status:status[1]})
  const percentage = totalTasks > 0 ? (DoneTasks / totalTasks) * 100 : 0;
  res.status(200).json({
    projectId: id,
    totalTasks,
    ToDoTasks,
    percentage,

   

  })
});

const getTask = asyncHandler(async (req, res) => {
 
  const id = req.params.id;
  const tasks = await Task.find({projectId:id})
  res.status(200).json(tasks);
  
});

const postTask = asyncHandler(async (req, res) => {
  
   const{title ,projectId ,status ,deadline} = req.body;
  
   if (   !title || !projectId || !status) {
    res.status(400);
    throw new Error("Missing body");
  }
  const createTask = await Task.create({ title, projectId, status, deadline: deadline || null });
  res.status(200).json({message:"Task was created "},createTask);
});

const putTask = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { title, status,deadline } = req.body;

  
  const updateData = {};
  if (title) updateData.title = title;
  if (status) updateData.status = status;
  if (deadline !== undefined) updateData.deadline = deadline || null;

  const task = await Task.findByIdAndUpdate(id, updateData, { new: true });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.status(200).json({ message: `Updated task ${id}`, task });
});

const deleteTask = asyncHandler(async (req, res) => {
  const id = req.params.id; //task id

  const task = await Task.findByIdAndDelete(id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.status(200).json({ message: 'Task deleted successfully' });
});

module.exports = {  getTask, postTask, putTask, deleteTask, getPercentageOfTasks };