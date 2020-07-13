const express = require('express')
const Answer = require('../models/answer')
const Question = require('../models/question')
const verifyToken = require('../middlewares/auth')
const router = express.Router()

const { check, validationResult, param } = require('express-validator')
const ObjectId = require('mongoose').Types.ObjectId;

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // return `${location}[${param}]: ${msg}`;
    return msg
};


//for getting all anwsers of a question
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
            const answers = await Answer.find({ questionId: id, isDeleted: false, isPublished: true }).skip((page - 1) * ANSWERS_PER_PAGE).limit(ANSWERS_PER_PAGE)

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
        const ans = await Answer.findOne({ _id, isDeleted: false, isPublished: true })
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
    const { body, isAnonymous = false, questionId, isPublished = false } = req.body

    const ansObject = {
        questionId,
        body,
        author: req.user
    }

    if (isPublished) {
        ansObject.isAnonymous = isAnonymous
        ansObject.isPublished = isPublished
    }

    const ans = new Answer(ansObject)

    try {
        await ans.save()

        res.status(201).send({
            error: false,
            msg: 'Successfully answered',
            body: ans
        })

        // if no bestanswer is present for a question then this answer will be bestAnswer
        const doc = await Question.findOne({ _id: questionId })
        if (!doc.bestAnswer.author && !doc.bestAnswer.body) {
            await Question.updateOne({ _id: questionId }, { 'bestAnswer.author': req.user, 'bestAnswer.body': body }, { new: true })
        }


    } catch (e) {
        res.status(400).send(e)
    }
})

// ============================
// draft routes
// ============================

// @GET /answer/draft get draft of a user for a particular question
router.get('/answer/draft', verifyToken, async (req, res) => {

    const { questionId = null } = req.body

    try {
        const ans = await Answer.findOne({ questionId: ObjectId(questionId), author: req.user, isPublished: false })
        if (!ans) {
            return res.status(404).send()
        }
        res.status(200).send({ error: false, body: ans })
    } catch (e) {
        res.status(500).send()
    }

})

router.patch('/answer/draft', verifyToken, [
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

    const { body, questionId } = req.body
    try {
        await Answer.findOneAndUpdate(
            { questionId: ObjectId(questionId), author: req.user, isPublished: false },
            { body },
            { upsert: true }
        )
        res.status(200).send({ msg: saved })
    } catch (e) {
        console.log(e);
        res.status(500).send()
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