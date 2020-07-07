const express = require('express')
const Answer = require('../models/answer')
const verifyToken = require('../middlewares/auth')
const router = express.Router()

const { check, validationResult, param } = require('express-validator')
const ObjectId = require('mongoose').Types.ObjectId;

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // return `${location}[${param}]: ${msg}`;
    return msg
};


//for getting all anwsers of a question
//pagination afterwards
router.get('/question/:id/answer', verifyToken,
    [
        param('id', 'No Id in request parameter')
            .notEmpty()
            .custom(value => {
                if (!ObjectId.isValid(value)) return Promise.reject('Not a valid question Id')
                return true
            })
    ],
    async (req, res) => {

        // error processing
        const errors = validationResult(req).formatWith(errorFormatter);

        if (!errors.isEmpty()) {
            return res.status(422).send({
                error: true,
                msg: 'could not get answers',
                body: errors.mapped()
            });
        }
        // error processing ends here

        const { id } = req.params

        const page = +req.query.page || 1;
        const ANSWERS_PER_PAGE = 10;

        try {
            const answers = await Answer.find({ questionId: id }).skip((page - 1) * ANSWERS_PER_PAGE).limit(ANSWERS_PER_PAGE)

            res.status(200).send({
                error: false,
                body: {
                    questionId: id,
                    page: page,
                    answers: answers
                }
            })
        } catch (e) {
            res.status(500).send()
        }
    })

//to get one particular answer [authentication not needed]
router.get('/answer/:answerId', [
    param('answerId', 'No Id in request parameter')
        .notEmpty()
        .custom(value => {
            if (!ObjectId.isValid(value)) return Promise.reject('Not a valid answer Id')
            return true
        })
], async (req, res) => {
    const _id = req.params.answerId

    try {
        const ans = await Answer.findOne({ _id, isDeleted: false })
        if (!ans) {
            return res.status(404).send()
        }
        res.status(200).send({ error: false, body: ans })
    } catch (e) {
        res.status(500).send()
    }
})

//to post an answer to a question [authentication needed]
router.post('/answer', verifyToken, [
    check('questionId', 'No question id provided')
        .notEmpty()
        .custom(value => {
            if (!ObjectId.isValid(value)) return Promise.reject('Not a valid question Id')
            return true
        }),
    check('body', 'answer cannot be empty').not().isEmpty()

], async (req, res) => {

    // error processing
    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
        return res.status(422).send({
            error: true,
            msg: 'could not save answer',
            body: errors.mapped()
        });
    }
    // error processing ends here
    const { body, isAnonymous = false, questionId } = req.body
    const ans = new Answer({
        questionId,
        body,
        isAnonymous,
        author: req.user
    })
    try {
        await ans.save()
        res.status(201).send({
            error: false,
            msg: 'Successfully answered',
            body: ans
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

//to edit an answer to a question [authentication needed]
router.patch('/answer/:id', verifyToken, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['body', 'isAnonymous']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const ans = await Answer.findOne({ _id: req.params.id, owner: req.user, isDeleted: false })

        if (!ans) {
            return res.status(404).send()
        }

        updates.forEach((update) => ans[update] = req.body[update])
        await ans.save()
        res.send(ans)
    } catch (e) {
        res.status(400).send(e)
    }
})

//to delete an answer to a question [authentication needed]
router.delete('/answer/:id', verifyToken, async (req, res) => {
    try {
        const ans = await Answer.findOneAndUpdate({ _id: req.params.id, author: req.user, isDeleted: false }, { isDeleted: true })

        if (!ans) {
            res.status(404).send()
        }
        res.send(ans)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router