const mongoose = require('mongoose')

mongoose.set('strictQuery', true)

console.log(`connecting to ${process.env.MONGODB_URI}`);

mongoose.connect(process.env.MONGODB_URI)
.then(result => {
    console.log(`connected to MongoDB`);
})
.catch(error => {
    console.log(`error connecting to MongoDB: ${error.message}`);
})


const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 4,
        required: true
    },
    number: {
        type: String,
        minLength: 6,
        validate: {
            validator : function(v) {
                return /^(\d{2}|\d{3})-(\d{7,8})$/.test(v)
            }
        }
    }
})


personSchema.set('ToJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)