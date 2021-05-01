const mongoose = require('mongoose')


const taskSchema = mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

taskSchema.methods.toJSON = function() {
    const task = this
    const taskObject = task.toObject()

    delete taskObject.owner
    return taskObject
}

const Tasks = mongoose.model('Task', taskSchema)

module.exports = Tasks