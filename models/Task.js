const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true
    },
    date: Date,
    time: Date,
    completed: {
        type: Boolean,
        default: false
    },
    detail: String
} )

module.exports = TaskSchema