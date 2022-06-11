const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const app = express()
const PORT = process.env.PORT || 3001

const mongoose = require("mongoose");
const { response } = require('express')

const url = process.env.URI

mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

morgan.token('data', (req,res) => JSON.stringify(req.body))

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.static('build'))
app.get('/api/persons',(req,res) => {
    Person.find({}).then(person => {
        res.json(person)
    })
})
app.get('/info',(req, res) => {
    res.send(
        `The amount of entries is: ${data.length}
        ${Date()}`
        )
})

app.get('/api/persons/:id',(req, res)=>{
    Person.findById(req.params.id)
        .then(note => {
            if(note){
                res.json(note)
            } else {
                res.status(404).end()
            }
        }).catch( error => {
            console.log(error)
            res.status(500).end()
        })
})

app.delete('/api/persons/:id', (req,res)=>{
    console.log(req.params.id)
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
        res.status(204).end()
    })
    .catch(error => console.log(error))
})

app.post('/api/persons',(req, res) => {
    
    const person = new Person({
        name: req.body.name,
        number: req.body.number
    })
    if(!person)
        return res.status(400).json({
            error: "content missing"
    })
    person.save().then(savedPerson => res.json(savedPerson))
})
app.put('/api/persons/:id',(req, res) => {
    Person.findByIdAndUpdate(req.params.id, req.body, {number: req.body.number})
    .then(updatedPerson => {
        res.json(updatedPerson)
    })
    .catch(err => console.log(err))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)
app.listen(PORT, () => {
    console.log(`Connected to Port ${PORT}`)
})