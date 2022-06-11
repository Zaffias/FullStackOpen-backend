const { response } = require('express')
const express = require('express')
const datos = require('./data')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config({path: __dirname = '/.env'})

const app = express()
const PORT = process.env.PORT || 3001
let data = datos.data
morgan.token('data', (req,res) => JSON.stringify(req.body))

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons',(req,res) => {
    res.json(data)
})
app.get('/info',(req, res) => {
    res.send(
        `The amount of entries is: ${data.length}
        ${Date()}`
        )
})

app.get('/api/persons/:id',(req, res)=>{
    const id = Number(req.params.id)
    const person = data.find(person => person.id === id)
    person ? res.json(person) : res.status(404).end()
})

app.delete('/api/persons/:id', (req,res)=>{
    const id = Number(req.params.id)
    data = data.filter(person => person.id !== id)
    
    res.status(204).end()   
})

app.post('/api/persons',(req, res) => {
    const id = Math.floor(Math.random() * 10000000)
    const person = req.body 
    if(!person)
        return res.status(400).json({
            error: "content missing"
        })
    if(!person.hasOwnProperty('name') || !person.hasOwnProperty('number')){
        return res.status(400).json(
            {error:"content has no name or number entry"})
    }
    data.map(({name})=>{
        if(name === person.name){
            return res.status(400).json({
                error:"name is already in use"}).end()
        }
        return data
    })
    person.id = id
    console.log(person)
    data = [...data, person]
    res.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)
app.listen(PORT, () => {
    console.log(`Connected to Port ${PORT}`)
})