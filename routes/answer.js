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




// ==============================================
// @GET /question/:id/answers  Getting all answers to a question
// ==============================================
router.get('/question/:id/answers', async (req, res) => {

    const { id } = req.params

    const page = +req.query.page || 1;
    const ANSWERS_PER_PAGE = 10;

    try {
        const answers = await Answer.find({ question: ObjectId(id), isDeleted: false, isPublished: true }).skip((page - 1) * ANSWERS_PER_PAGE).limit(ANSWERS_PER_PAGE)

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






// ==============================================
// @GET /answer/:answerId  to get one particular answer [authentication not needed]
// ==============================================
router.get('/answer/:answerId', async (req, res) => {
    const _id = req.params.answerId
    try {
        const ans = await Answer.findOne({ _id: ObjectId(_id), isDeleted: false, isPublished: true })
        if (!ans) {
            res.status(404).send()
        }
        await ans.populate('question').execPopulate()
        return res.status(200).send({
            error: false,
            body: ans
        })
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }

})






// ==============================================
// @GET /question/:questionId/answer   get draft of a user for a particular question
// ==============================================
router.get('/question/:questionId/answer', verifyToken, async (req, res) => {

    const { questionId } = req.params

    try {
        const ans = await Answer.findOne({ question: ObjectId(questionId), isDeleted: false, author: req.user })
        if (!ans) {
            return res.status(404).send()
        }
        res.status(200).send({ error: false, body: ans })
    } catch (e) {
        res.status(500).send()
    }

})






// ==============================================
// @put /question/:questionId/answer/draft  To make draft of an answer
// ==============================================
router.put('/question/:id/answer/draft', verifyToken, [
    check('body', 'answer cannot be empty').not().isEmpty()
], async (req, res) => {

    const { body, isPublished = false } = req.body

    try {
        await Answer.findOneAndUpdate(
            { question: ObjectId(req.params.id), author: req.user },
            { body, isPublished },
            { upsert: true }
        )
        res.status(200).send({ msg: saved })
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }

})






// ==============================================
// @POST /answer  to post an answer to a question [authentication needed]
// ==============================================
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

    const { body, isAnonymous = false, questionId, isPublished = true } = req.body

    const ans = new Answer({
        question: questionId,
        body,
        author: req.user,
        isAnonymous,
        isPublished
    })

    try {
        const existingAnswer = await Answer.findOne({ question: ObjectId(questionId), isDeleted: false, author: req.user })
        if (existingAnswer) {
            return res.status(302).send({
                error: false,
                msg: 'You have already answered this question',
                body: existingAnswer
            })
        }
        await ans.save()

        res.status(201).send({
            error: false,
            msg: 'Successfully answered',
            body: ans
        })

        // if no bestanswer is present for a question then this answer will be bestAnswer
        const doc = await Question.findOne({ _id: questionId })
        if (!doc.bestAnswer) {
            await Question.updateOne({ _id: questionId }, { bestAnswer: ans._id }, { new: true })
        }


    } catch (e) {
        res.status(400).send(e)
    }
})






// ==============================================
// @PATCH /answer/:id  to edit an answer to a question [authentication needed]
// ==============================================
router.patch('/answer/:id', verifyToken, async (req, res) => {
    const { body } = req.body

    try {
        const ans = await Answer.findOneAndUpdate(
            { _id: req.params.id, author: req.user, isDeleted: false },
            { body },
            { new: true }
        )

        if (!ans) {
            return res.status(404).send()
        }

        res.status(200).send({ error: false, body: ans })
    } catch (e) {
        res.status(400).send(e)
    }
})






// ==============================================
// @DELETE /answer/:id  to delete an answer to a question [authentication needed]
// ==============================================
router.delete('/answer/:id', verifyToken, async (req, res) => {
    try {
        const ans = await Answer.findOneAndUpdate({ _id: req.params.id, author: req.user, isDeleted: false }, { isDeleted: true })

        if (!ans) {
            res.status(404).send()
        }
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router