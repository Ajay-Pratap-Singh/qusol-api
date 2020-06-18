const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const models = require('./models')
if (app.get('env') == 'development') { require('dotenv').config(); }
const userAuth = require('./routes/auth/auth')

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


models.sequelize.sync().then((result) => {

    app.listen(PORT, () => {
        console.log(`on ${PORT}`);
    })
})