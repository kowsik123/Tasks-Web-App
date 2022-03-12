const mongoose = require("mongoose")
const Task = require( "./Task" )

const TaskGroupSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: 'Enter Name'
    },
    taskList: [ Task ]
} )

module.exports = TaskGroupSchema