const express = require('express');
const router = express.Router()

const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')

const User = require('../models/user')
const verifyToken = require('../middlewares/auth')


const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // return `${location}[${param}]: ${msg}`;
    return msg
};

// @POST 
// User registration
router.post('/register',

    [
        check('email', 'E-mail is invalid').trim().isEmail().normalizeEmail().custom(value => {
            return User.findOne({ email: value }).then(user => {
                if (user) {
                    return Promise.reject('E-mail already in use')
                }
            })
        }),
        check('username', 'Username can contain only letters A-Z, numbers 0-9  and length no more than is 15')
            .trim()
            .isLength({ min: 1, max: 15 })
            .custom(value => {
                return User.findOne({ username: value }).then(user => {
                    if (user) {
                        return Promise.reject('Username already taken')
                    }
                })
            }),
        check('password', 'Password is required').trim()
            .isLength({ min: 8 }).withMessage('Password should be atleast 8')
            .isLength({ max: 40 }).withMessage('Password can not exceed 40 characters')
    ]
    ,

    (req, res) => {


        // error processing
        console.log(validationResult(req).array())

        const errors = validationResult(req).formatWith(errorFormatter);
        if (!errors.isEmpty()) {
            return res.status(422).send({
                error: true,
                msg: 'Registration failed',
                body: errors.mapped()
            });
        }
        // error processing ends here

        const { username, email, password } = req.body

        const newUser = new User({
            username, email, password
        })

        newUser.save().then((user) => {
            const token = user.generateAuthToken()

            return res.status(201)
                .send({
                    error: false, msg: "Registration successful",
                    body: {
                        token
                    }
                })
        }).catch((e) => {
            console.log(e);
        })

    }
)



// @POST 
// User Login
router.post('/login', (req, res) => {

    const { username_or_email = "", password = "" } = req.body;

    let foundUser

    User.findOne({
        $or: [{ username: username_or_email }, { email: username_or_email }]
    }).then(user => {
        if (!user) {
            return res.status(401).send({ error: true, msg: "Invalid Credentials" })
        }
        foundUser = user
        return bcrypt.compare(password, user.password)

    }).then((isEqual) => {
        if (!isEqual) {
            return res.status(401).send({ error: true, msg: "Invalid Credentials" })
        }
        //  token generation
        const token = foundUser.generateAuthToken()

        return res.status(200).send({
            error: false,
            msg: "Login successful",
            body: {
                token
            }
        })


    }).catch(e => {
        console.log(e);
    })

})

router.get('/profile', verifyToken, (req, res) => {

    User.findById(req.user.uid).then(user => {
        if (!user) {
            res.status(404).send({ error: true, msg: "no user found" })
        }
        res.status(200).send({ error: false, body: user })
    }).catch(e => {
        console.log(e);
    })
})


module.exports = router