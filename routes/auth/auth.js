const express = require('express');

const router = express.Router()
const bcrypt = require('bcryptjs')
const { User } = require('../../models')

const { Op } = require("sequelize");

const jwt = require('jsonwebtoken')

const { verifyToken } = require('../../middlewares/auth')

// @POST 
// User registration
router.post('/register', (req, res) => {
    const { username, email, password, confirm_password } = req.body

    const user = {
        username, email, password
    }


    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            user.password = hash
            User.create(user).then((result) => {
                res.status(201).send({ error: false, message: "registration successfull" })
            }).catch((err) => {
                console.log(err);
            });
        })
    })

})

// @POST 
// User Login
router.post('/login', (req, res) => {
    const { username_or_email, password } = req.body;

    let foundUser

    User.findOne({
        where: {
            [Op.or]: [{ username: username_or_email }, { email: username_or_email }]
        }
    }).then(user => {
        if (!user) {
            return res.status(401).send({ error: true, message: "Invalid Credentials" })
        }
        foundUser = user
        return bcrypt.compare(password, user.password)

    }).then((isEqual) => {
        if (!isEqual) {
            return res.status(401).send({ error: true, message: "Invalid Credentials" })
        }
        //  token generation
        const token = jwt.sign(
            { username: foundUser.username, id: foundUser.id.toString() },
            process.env.SECRET,
            { expiresIn: '1h' }
        )
        console.log(foundUser.id);

        return res.header('Authorization', 'Bearer ' + token).send({
            error: false,
            message: "login successful",
            body: {
                username: `${foundUser.username}`,
                email: `${foundUser.email}`
            }
        })


    }).catch(err => {
        console.log(err);
    })

})

router.get('/hello', verifyToken, (req, res) => {
    const username = req.user.username;

    res.send({ message: `hello, ${username}` })
})


module.exports = router