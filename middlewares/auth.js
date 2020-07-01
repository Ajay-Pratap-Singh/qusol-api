const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


verifyToken = (req, res, next) => {
    const headerBody = req.header('Authorization')

    if (!headerBody) {
        return res.status(401).send({ error: true, msg: "no token , authorization denied" });
    }

    const token = headerBody.split(' ')[1]
    // console.log(token);

    try {
        jwt.verify(token, process.env.SECRET, (error, decoded) => {
            if (error) {
                return res.status(401).json({ error: true, msg: 'token is not valid' });
            } else {
                req.user = {
                    uid: mongoose.Types.ObjectId(decoded.uid),
                    username: decoded.username,
                    displayname: decoded.displayname,
                    profileImageUrl: decoded.profileImageUrl
                };
                next();
            }
        });

    } catch (error) {
        console.log(error);
    }
}

module.exports = verifyToken