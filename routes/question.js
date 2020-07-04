const express = require('express');
const router = express.Router()

const { check, validationResult, param } = require('express-validator')
const ObjectId = require('mongoose').Types.ObjectId;

const Question = require('../models/question')
const Answer = require('../models/answer')
const User = require('../models/user')
const verifyToken = require('../middlewares/auth');



const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // return `${location}[${param}]: ${msg}`;
    return msg
};

// @GET /question
router.get('/question', (req, res) => {
    const page = +req.query.page || 1;
    const QUESTIONS_PER_PAGE = 10;

    Question.find().skip((page - 1) * QUESTIONS_PER_PAGE).limit(QUESTIONS_PER_PAGE)
        .then(questions => {
            res.status(200).send({
                error: false,
                body: {
                    page: page,
                    questions: questions
                }
            })
        }).catch(e => {
            console.log(e);
        })
})

// @GET /question/:id

router.get('/question/:id', [
    param('id', 'No id in request parameter')
        .notEmpty()
        .custom(value => {
            if (!ObjectId.isValid(value)) return Promise.reject('Not a valid question id')
            return true
        })
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

    const page = +req.query.page || 1;
    const ANSWERS_PER_PAGE = 10;

    let foundQuestion

    Question.findById(id).then(question => {
        if (!question) {
            return res.status(422).send({
                error: true,
                msg: "question not found"
            })
        }
        foundQuestion = question
        return Answer.find({ question: id }).skip((page - 1) * ANSWERS_PER_PAGE).limit(ANSWERS_PER_PAGE)
    }).then((answers) => {
        return res.status(200).send({
            error: false,
            body: {
                question,
                page: page,
                answers: answers
            }
        })
    }).catch((e) => {
        console.log(e);
    })

})

// @POST /question

router.post('/question', verifyToken, [
    check('title', 'This field is required').notEmpty().trim()
        .isLength({ min: 10, max: 140 }).withMessage("Lenght should be in range 10 to 140 characters"),
    check('tags').optional().isArray().withMessage("tags should be an array")
        .custom(value => {
            if (value.length > 5) throw new Error("only 5 tags allowded")
            return true
        })
        .customSanitizer(value => {
            const newArr = value.filter(tag => tag.trim().length !== 0)
            console.log(newArr);
            return newArr

        })
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

    const { title, description = null, isAnonymous = false, tags = [] } = req.body
    console.log(tags);

    const newQuestion = new Question({
        title,
        description,
        isAnonymous,
        author: req.user,
        tags
    })

    newQuestion.save().then((ques) => {

        return res.status(200).send({
            error: false,
            msg: "question saved successfully",
            body: ques
        })


    }).catch(e => {
        console.log(e);
    })

})


module.exports = router