const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const connectDB = require('./connect/index')
if (app.get('env') == 'development') { require('dotenv').config(); }
const userAuth = require('./routes/auth')

const PORT = process.env.PORT || 3000
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next();
})

app.use(userAuth)

app.get('/', (req, res) => {
    res.status(200).send({
        message: "working"
    })
})


connectDB(() => {
    app.listen(PORT, () => {
        console.log(`server running on ${PORT}`);
    })
})