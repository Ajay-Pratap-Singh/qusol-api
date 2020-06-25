const express = require('express')
const Answer = require('../models/answer')
const verifyToken = require('../middlewares/auth')
const router = express.Router()

//for getting all anwsers of a question
//pagination afterwards
router.get('question/:id/answers', verifyToken, async (req, res) => {
    const question = req.params.id

    try {
        const answers = await Answer.find({ question })
        if (!answers) {
            return res.status(404).send()
        }
        res.send(answers)
    } catch (e) {
        res.status(500).send()
    }
})

//to get one particular answer [authentication not needed]
router.get('/answer/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const ans = await Answer.findOne({ _id, isDeleted: false })
        if (!ans) {
            return res.status(404).send()
        }
        res.send(ans)
    } catch (e) {
        res.status(500).send()
    }
})

//to post an answer to a question [authentication needed]
router.post('/answer', verifyToken, async (req, res) => {
    const ans = new Answer({
        ...req.body,
        author: req.user
    })
    try {
        await ans.save()
        res.status(201).send(ans)
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