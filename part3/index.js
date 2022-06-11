const { response } = require('express')
const express = require('express')
const datos = require('./data')
const app = express()

const PORT = 3001

let data = datos.data

app.use(express.json())

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
    person ? res.json(person) : response.status(404).end()
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