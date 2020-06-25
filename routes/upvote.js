const express = require('express');
const router = express.Router()

const { check, validationResult, param } = require('express-validator')
const ObjectId = require('mongoose').Types.ObjectId;

const Question = require('../models/question')
const Answer = require('../models/answer')
const Post = require('../models/post')
const Article = require('../models/article')
const Comment = require('../models/comment')
const User = require('../models/user')
const verifyToken = require('../middlewares/auth');



const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // return `${location}[${param}]: ${msg}`;
    return msg
};


const ModelResolve = {
    'article': Article,
    'answer': Answer,
    'comment': Comment,
    'post': Post,
    'question': Question
}


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
], (req, res) => {

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

    const { id, type } = req.body

    const Model = ModelResolve[type]

    Model.update({ _id: id }, {
        $push: {
            upvotes: req.user
        }
    }).then((result) => {
        if (!result) {
            return res.status(400).send({ error: true, msg: 'unable to upvote' })
        }

        return res.status(201).send({
            error: false,
            msg: `successfully upvoted ${type}`
        })
    }).catch(e => {
        console.log(e);
    })


})

// @DELETE /upvote
router.delete('/:type/:id/upvote',
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
], (req, res) => {

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

    const { id, type } = req.body

    const Model = ModelResolve[type]

    Model.update({ _id: id }, {
        $pull: {
            upvotes: {
                uid: req.user.uid
            }
        }
    }).then((result) => {
        if (!result) {
            return res.status(400).send({ error: true, msg: 'unable to remove upvote' })
        }

        return res.status(201).send({
            error: false,
            msg: `successfully removed upvoted from ${type}`
        })
    }).catch(e => {
        console.log(e);
    })


})


module.exports = router