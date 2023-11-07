require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
const Person = require('./models/person')

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError')
    {
        return response.status(400).send({error : 'malformmated id'})
    }
    else if (error.name === 'ValidationError')
    {
        return response.status(400).send({error : error.message})
    }

    next(error)
}

const unknownEndpoint = (request, response) => {
    console.log('this');
    response.status(404).send(
        {
            error: 'unknown endpoint'
        }
    )
}

app.use(errorHandler)

app.get('/api/persons', (request, response) =>
{
    Person.find({})
    .then( persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) =>
{
    const current_Time = new Date()
    Person.find({})
    .then( result => {
        response.send(`<p>
    Phonebook has info for ${result.length} people <br/> <br/>
    ${current_Time}
    </p>`)
    })

})

app.get('/api/persons/:id', (request, response, next) =>
{
    const idToGet = request.params.id

    Person.findById(idToGet)
    .then( person => {
        if(person)
        {
            response.json(person)
        }
        else 
        {
            response.status(404).end()
        }
    })
    .catch( error => next(error))
})


app.delete('/api/persons/:id', (request,response, next) =>
{
    const id = request.params.id

    Person.findByIdAndRemove(id)
    .then( result => {
        response.status(204).end()
    })
    .catch( error => next(error))

})

app.post('/api/persons', (request, response, next) =>
{

   const person = new Person({
    name: request.body.name,
    number: request.body.number
   })

   person.save()
   .then( savedPerson => {
    response.json(savedPerson)
   })
   .catch( error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {

    const id = request.params.id
    console.log(`id is ${request.params.id}`)
    

    const person = {
        name: request.body.name,
        number: request.body.number
    }

    Person.findByIdAndUpdate(id, person, {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))

})




const port = process.env.PORT 

app.listen(port, () => console.log('server is running'))