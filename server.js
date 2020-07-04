const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const connectDB = require('./connect/index')
if (app.get('env') == 'development') { require('dotenv').config(); }


const authRoutes = require('./routes/auth')
const commentRoutes = require('./routes/comment')
const upvoteRoutes = require('./routes/upvote')
const quesRoutes = require('./routes/question')
const ansRoutes = require('./routes/answer')

const PORT = process.env.PORT || 8000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next();
})


app.use(authRoutes)
app.use(commentRoutes)
app.use(upvoteRoutes)
app.use(quesRoutes)
app.use(ansRoutes)

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