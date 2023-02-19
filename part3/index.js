
const express = require('express')
const morgan =  require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(express.json())
app.use(morgan(':method :url :body'))
app.use(cors())
app.use(express.static('build'))

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
    


const info = persons.length



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})


app.get('/info', (request, response) => {
    const time = new Date()

    console.log(request.startTime)
    response.send(`<div>Phonebook has info for ${info}  people</div><br><p>${time}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id == id)
    response.json(person)
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id != id)
  
    response.status(204).end()
  })


app.post('/api/persons', (request, response) => {
  const randId = Math.round(Math.random()*100)
  const ids = persons.map(person => person.id)
  const actId = ids.includes(randId)? randId+1: randId
  
  const person = request.body
  person.id = actId
  let phoneNameObject = persons.find(per => per.name == person.name) 
  
  
  if (typeof person.name == "undefined" || typeof person.number =="undefined"){
    response.send("error: Must Include Name and Number")
    response.status(204).end()
  }else if(typeof phoneNameObject != "undefined"){
    response.send("error: Name must be unique")
    response.status(204).end()
  } else{
  persons = persons.concat(person)
  response.json(person)
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})