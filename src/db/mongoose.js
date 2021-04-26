const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true
})

const User = mongoose.model('User', {
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        Validate(value) {
            if(validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age:{
        type: Number,
        Validate(value) {
            if(value < 0) {
                throw new Error('Age must be positive number')
            }
        }

    }
})

const me = new User({
    name: 'Aditya',
    email: 'mike@'
})

console.log(me)

me.save().then((result) => {
    console.log(result)
}).catch((error) => {
    console.log((error))
})

// const Tasks = mongoose.model('Tasks', {
//     description: {
//         type: String,
//         required: true
//     },
//     completed: {
//         type: Boolean
//     }
// })

// new Tasks({
//     description: 'Learn Bluprism RPA',
//     completed: false
// }).save().then(() => {
//     console.log('Sucess')
// }).catch(() => {
//     console.log('Error!')
// })

