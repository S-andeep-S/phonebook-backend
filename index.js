
const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))






let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (request, response) =>
{
    return response.status(200).json(persons)
})

app.get('/info', (request, response) =>
{
    const current_Time = new Date()
    response.send(`<p>
    Phonebook has info for ${persons.length} people <br/> <br/>
    ${current_Time}
    </p>`)
})

app.get('/api/persons/:id', (request, response) =>
{
    const idToGet = Number(request.params.id)

    const person = persons.find( person => idToGet === person.id)

    if(!person)
    {
        return response.status(404).json(
            {
                error: "id not found"
            }
        )
    }

    response.status(200).json(person)
})


app.delete('/api/persons/:id', (request,response) =>
{
    const id = Number(request.params.id)

    persons = persons.filter( person => person.id !== id)

    response.status(202).end()
})

const generatedId = () =>
{
    const maxId = Math.floor(Math.random() * 100) + 4
    return maxId
}

app.post('/api/persons', (request, response) =>
{

    if (!request.body.name || !request.body.number)
    {
       return response.status(400).json(
        {
            error: "name or number are missing"
        }
       )
    }

    const duplicateName = persons.filter(person => person.name === request.body.name)

    if (duplicateName.length > 0)
    {
        return response.status(400).json(
            {
                error: "name must be unique"
            }
        )
    }


    const person = {
        id: generatedId(),
        name: request.body.name,
        number: request.body.number
    
    }

    persons = persons.concat(person)

    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send(
        {
            error: 'unknown endpoint'
        }
    )
}

app.use(unknownEndpoint)




const port = 3001

app.listen(port, () => console.log('server is running'))