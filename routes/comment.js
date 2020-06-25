const express = require('express')
const Comment = require('../models/comment')
const verifyToken = require('../middlewares/auth')
const router = new express.Router()

//for getting all comments of an entity
router.get(':parentType/:id/comments', verifyToken, async (req, res) => {
    const parentType = req.params.parentType;
    const pid = req.params.id;

    try {
        const comments = await Comment.find({ pid, parentType })
        if (!comments) {
            return res.status(404).send()
        }
        res.send(comments)
    } catch (e) {
        res.status(500).send()
    }
})

//to get one particular comment [authentication not needed]
router.get('/comment/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const comment = await Comment.findOne({ _id, isDeleted: false })
        if (!comment) {
            return res.status(404).send()
        }
        res.send(comment)
    } catch (e) {
        res.status(500).send()
    }
})

//to post an comment to an entity [authentication needed] [all details should be in post body]
router.post('/comment', verifyToken, async (req, res) => {
    const comment = new Comment({
        ...req.body,
        author: req.user
    })
    try {
        await comment.save()
        res.status(201).send(comment)
    } catch (e) {
        res.status(400).send(e)
    }
})

//to edit an comment to a question [authentication needed] [should get comment body only in req.body]
router.patch('/comment/:id', verifyToken, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['body']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const comment = await Comment.findOne({ _id: req.params.id, owner: req.user, isDeleted: false })
        if (!comment) {
            return res.status(404).send()
        }
        updates.forEach((update) => comment[update] = req.body[update])
        await comment.save()
        res.send(comment)
    } catch (e) {
        res.status(400).send(e)
    }
})

//to delete an comment to a question [authentication needed]
router.delete('/comment/:id', verifyToken, async (req, res) => {
    try {
        const comment = await Comment.findOneAndUpdate({ _id: req.params.id, author: req.user, isDeleted: false }, { isDeleted: true })

        if (!comment) {
            res.status(404).send()
        }
        res.send(comment)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router