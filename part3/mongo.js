const mongoose = require('mongoose')


const personSchema = new mongoose.Schema({
    name: String,
    number: String
})


const Person = mongoose.model('Person',personSchema)

const password = encodeURIComponent(process.argv[2])
const url = `mongodb+srv://kbteye:${password}@cluster0.utrnaf0.mongodb.net/?retryWrites=true&w=majority`


if(process.argv.length == 5){
  const name = process.argv[3]
  const phoneno = process.argv[4]
  mongoose.set('strictQuery',false)
  mongoose.connect(url)

  const person = new Person({
    name: name,
    number: phoneno,
  })
  
  person.save().then(result => {
    console.log(`Added ${name} number ${phoneno} to phonebook`)
    mongoose.connection.close()
  })
} else if(process.argv.length == 3){
  mongoose.set('strictQuery',false)
  mongoose.connect(url)

  Person
  .find({})
  .then(persons=> {
    persons.forEach(person => {
      console.log(person.name, person.number)
      mongoose.connection.close()
    })
   
  })
}




  