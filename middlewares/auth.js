const jwt = require('jsonwebtoken');


verifyToken = (req, res, next) => {
    const headerBody = req.header('Authorization')

    if (!headerBody) {
        return res.status(401).send({ error: true, message: "No token , authorization denied" });
    }

    const token = headerBody.split(' ')[1]
    // console.log(token);

    try {
        jwt.verify(token, process.env.SECRET, (error, decoded) => {
            if (error) {
                return res.status(401).json({ error: true, message: 'Token is not valid' });
            } else {
                req.user = { username: decoded.username, _id: decoded._id };
                next();
            }
        });

    } catch (error) {
        console.log(error);

    }


}

module.exports = {
    verifyToken
}