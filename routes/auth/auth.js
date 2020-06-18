const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs')
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')

const { User } = require('../../models')
const { verifyToken } = require('../../middlewares/auth')


const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // return `${location}[${param}]: ${msg}`;
    return msg
};

// @POST 
// User registration
router.post('/register',

    [
        check('email', 'E-mail is invalid').trim().isEmail().normalizeEmail().custom(value => {
            return User.findOne({ where: { email: value } }).then(user => {
                if (user) {
                    return Promise.reject('E-mail already in use')
                }
            })
        }),
        check('username', 'Username can contain only letters A-Z, numbers 0-9  and length no more than is 15')
            .trim()
            .isLength({ min: 1, max: 15 })
            .custom(value => {
                return User.findOne({ where: { username: value } }).then(user => {
                    if (user) {
                        return Promise.reject('Username already taken')
                    }
                })
            }),
        check('password', 'Password is required').trim()
            .isLength({ min: 8 }).withMessage('Password should be atleast 8')
            .isLength({ max: 40 }).withMessage('Password can not exceed 40 characters')
            .custom((value, { req }) => {
                if (req.body.confirm_password.trim() !== value) {
                    console.log('here');
                    throw new Error('Password confirmation is incorrect')
                } else {
                    return true
                }
            })

    ]
    ,


    (req, res) => {


        // error processing

        const errors = validationResult(req).formatWith(errorFormatter);
        if (!errors.isEmpty()) {
            return res.status(422).send({
                error: true,
                msg: 'Please review the errors',
                body: errors.mapped()
            });
        }
        // error processing ends here

        const { username, email, password } = req.body

        const user = {
            username, email, password
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                user.password = hash
                User.create(user).then((result) => {
                    res.status(201).send({ error: false, msg: "registration successfull" })
                }).catch((err) => {
                    console.log(err);
                });
            })
        })

    }
)



// @POST 
// User Login
router.post('/login', [
    check('username_or_email', 'missing username or email').trim().notEmpty(),
    check('password', 'missing password').trim().notEmpty(),
], (req, res) => {


    // error processing
    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
        return res.status(422).send({
            error: true,
            msg: 'Please review the errors',
            body: errors.mapped()
        });
    }
    // error processing ends here


    const { username_or_email, password } = req.body;

    let foundUser

    User.findOne({
        where: {
            [Op.or]: [{ username: username_or_email }, { email: username_or_email }]
        }
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
        const token = jwt.sign(
            { username: foundUser.username, id: foundUser.id.toString() },
            process.env.SECRET,
            { expiresIn: '1h' }
        )
        console.log(foundUser.id);

        return res.header('Authorization', 'Bearer ' + token).send({
            error: false,
            msg: "login successful",
            body: {
                username: `${foundUser.username}`,
                email: `${foundUser.email}`
            }
        })


    }).catch(err => {
        // console.log(err);
    })

})

router.get('/hello', verifyToken, (req, res) => {
    const username = req.user.username;

    res.send({ msg: `hello, ${username}` })
})


module.exports = router