require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const movieData = require('./movieData.json')

console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})

function handleGetMovie(req, res) {
    const { genre, country, avg_vote } = req.query
    let response = movieData

    if(genre) {
        response = movieData.filter(movie =>
            movie.genre.toLowerCase().includes(genre.toLowerCase())
        )
    }

    if(country) {
        response = movieData.filter(movie =>
            movie.country.toLowerCase().includes(country.toLowerCase())
        )
    }

    if(avg_vote) {
        response = movieData.filter(movie =>
            Number(movie.avg_vote) >= Number(avg_vote)
        )
    }

    res.json(response)
}

app.get('/movie', handleGetMovie)

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
