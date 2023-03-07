require('dotenv').config()
const express = require('express')
const morgan =  require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')





morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(express.json())
app.use(morgan(':method :url :body'))
app.use(cors())
app.use(express.static('build'))

const errorHandler =  (err, request, response, next) => {
  console.log(err.message)
  if (err.name == 'CastError') {
    return response.status(400).json({ err: 'malformatted id' })
  } else if(err.name == 'ValidationError'){
    return response.status(400).json({err: err.message})
  }
  
  next(err)
}

// this has to be the last loaded middleware.



app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(person => response.json(person)).catch(err => {
    console.log(err)
    response.status(400).send({ err: 'malformatted id' })
  }).catch(err => next(err))
})


app.get('/info', (request, response) => {
    const time = new Date()
    Person.find({}).then(person =>{
    response.send(`<div>Phonebook has info for ${person.length}  people</div><br><p>${time}</p>`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
    response.json(person)
  }).catch(err => next(err))
  })





app.put('/api/persons/:id', (request, response) => {

  const updatePerson = new Person ({
    number: request.body.number,
  })

    Person.findOneAndUpdate(request.params.id, {number: updatePerson.number}, {new: true}).then(person => {
    console.log(person)
    response.json(person)
  }).catch(err => next(err))
  })

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(person => {
      response.json(person)
      response.status(204).end()
    }).catch(err => next(err))

  })


app.post('/api/persons', (request, response, next) => {
  const randId = Math.round(Math.random()*10000)
  
  const newPerson = new Person ({
    name: request.body.name,
    number: request.body.number,
    id: randId
  })
  
  
  

  if (typeof newPerson.name == "undefined" || typeof newPerson.number =="undefined"){
    response.status(404).json({err:'content missing'})
  }else{
      Person.find({name: newPerson.name}).then( person => {
        const personList = person.map(person => person.name)
  

        if(personList.length == 0){
            newPerson.save()
            .then( result => {
            console.log("Person Saved")
            Person.find({name: newPerson.name}).then(person => response.json(person))
            })
            .catch(err => next(err))
      }else{
             response.send("err: Name must be unique")
             response.status(204).end()
        }

      })

  }
})



app.use(errorHandler)



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})