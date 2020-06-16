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


models.sequelize.sync().then((result) => {

    app.listen(PORT, () => {
        console.log(`on ${PORT}`);
    })
})