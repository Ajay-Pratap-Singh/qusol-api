const connectDB = (cb) => {

    const mongoose = require('mongoose')

    mongoose.Promise = global.Promise;
    mongoose.Promise = global.Promise;
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);

    mongoose.connect(`${process.env.MONGODB_URI}`).then(() => {
        console.log("connected to database");
        return cb()
    }).catch((e) => {
        console.log(e);
        console.log("unable to connect to database");
    })
}

module.exports = connectDB