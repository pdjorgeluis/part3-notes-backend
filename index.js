require('dotenv').config()
const express = require('express')
const app = express()

const Note = require('./models/note')
//Mongoose definitions
const mongoose = require('mongoose')

const password = 'alohomora'//process.argv[2]
/*
// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url =
  `mongodb+srv://lajito:${password}@cluster0.9amvxup.mongodb.net/noteApp?
  retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', noteSchema)
*/

//Notes
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-01-10T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-01-10T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-01-10T19:20:14.298Z",
    important: true
  }
]

app.use(express.json())


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

/*app.get('/api/notes', (request, response) => {
response.json(notes)
})*/

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


