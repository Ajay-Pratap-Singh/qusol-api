const mongoose = require('mongoose')

// using builtin promise library
mongoose.Promise = global.Promise;
mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

let url;

if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
    url = process.env.MONGODB_URI
} else {
    url = 'mongodb://localhost:27017/qusol'
}

const connectDB = (cb) => {
    mongoose.connect(url).then(() => {
        console.log("connected to database");
        cb()
    }).catch(() => {
        console.log("unable to connect to database");
    })
}

module.exports = connectDB