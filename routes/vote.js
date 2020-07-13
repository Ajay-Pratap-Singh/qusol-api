const express = require('express');
const router = express.Router()

const { check, validationResult, param } = require('express-validator')
const ObjectId = require('mongoose').Types.ObjectId;

const Vote = require('../models/vote')
const verifyToken = require('../middlewares/auth');

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // return `${location}[${param}]: ${msg}`;
    return msg
};

// @POST /upvote
router.post('/:type/:id/upvote',
    verifyToken, [
    param('type', 'type not presented in parameter, allowded types [article,question,answer,comment,post] ')
        .trim()
        .notEmpty()
        .isIn(['article', 'question', 'answer', 'comment', 'post']),
    param('id', 'ID of the item is required')
        .notEmpty()
        .custom(value => {
            if (!ObjectId.isValid(value)) return Promise.reject('invalid item ID')
            return true
        })
], async (req, res) => {

    // error processing starts here
    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
        return res.status(422).send({
            error: true,
            msg: 'Please review the errors',
            body: errors.mapped()
        });
    }
    // error processing ends here

    const { pid, parentType } = req.params
    try {
        let vote = await Vote.findOneAndUpdate({ user: req.user, pid, parentType }, { value: true })
        if (!vote) {
            vote = new Vote({
                user: req.user,
                pid,
                parentType,
                value: true
            })
            await vote.save()
            res.send(vote)
        }
        res.send({ ...vote, value: true })
    } catch (e) {
        res.status(400).send(e)
    }
})

// @POST /downvote
router.post('/:type/:id/downvote',
    verifyToken, [
    param('type', 'type not presented in parameter, allowded types [article,question,answer,comment,post] ')
        .trim()
        .notEmpty()
        .isIn(['article', 'question', 'answer', 'comment', 'post']),
    param('id', 'ID of the item is required')
        .notEmpty()
        .custom(value => {
            if (!ObjectId.isValid(value)) return Promise.reject('invalid item ID')
            return true
        })
], async (req, res) => {

    // error processing starts here
    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
        return res.status(422).send({
            error: true,
            msg: 'Please review the errors',
            body: errors.mapped()
        });
    }
    // error processing ends here

    const { pid, parentType } = req.params
    try {
        let vote = await Vote.findOneAndUpdate({ user: req.user, pid, parentType }, { value: false })
        if (!vote) {
            vote = new Vote({
                user: req.user,
                pid,
                parentType,
                value: false
            })
            await vote.save()
            res.send(vote)
        }
        res.send({ ...vote, value: false })
    } catch (e) {
        res.status(400).send(e)
    }
})

// @DELETE /upvote
router.delete('/upvote/:id',
    verifyToken, [
    param('id', 'ID of the item is required')
        .notEmpty()
        .custom(value => {
            if (!ObjectId.isValid(value)) return Promise.reject('invalid item ID')
            return true
        })
], async (req, res) => {

    // error processing starts here
    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
        return res.status(422).send({
            error: true,
            msg: 'Please review the errors',
            body: errors.mapped()
        });
    }
    // error processing ends here

    const { id } = req.params

    try {
        const vote = await Vote.findOneAndDelete({ _id: id, user: req.user })
        if (!vote) {
            res.status(404).send()
        }
        res.send(vote)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router