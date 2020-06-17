const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const models = require('./models')
require('dotenv').config()
const userAuth = require('./routes/auth/auth')

const PORT = process.env.PORT || 3000
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.use(userAuth)

app.get('/', (req, res) => {
    res.status(200).send({
        message: "working"
    })
})

console.log(process.env.NODE_ENV)

models.sequelize.sync().then((result) => {

    app.listen(PORT, () => {
        console.log(`on ${PORT}`);
    })
})