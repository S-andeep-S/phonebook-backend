const mongoose = require('mongoose')

const password = process.argv[2]

const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://sandss482:${password}@cluster0.1mkbogi.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if( process.argv[3] === "delete")
{
    Person.deleteMany({})
    .then( result => {
        console.log(Person);
        console.log("deleted all the documents from collection Person");
        console.log(result);
        mongoose.connection.close()
    })
}

if (process.argv.length < 4)
{
    console.log("phonebook:");
    Person.find({})
    .then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length > 4)
{
const person = new Person({
    name: name,
    number: number
})

person.save()
.then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
    
})

}
