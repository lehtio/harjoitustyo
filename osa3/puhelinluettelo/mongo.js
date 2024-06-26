const mongoose = require('mongoose')


const password = process.argv[2]

const url = `mongodb+srv://laidmale:${password}@cluster.8ynfaqr.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

//const person = new Person({ name: 'Maija Poppanen', number: '298457767',})

// person.save().then(result => { console.log('person saved!') mongoose.connection.close() })



if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({ name, number })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('incorrect number of arguments')
  mongoose.connection.close()
}
