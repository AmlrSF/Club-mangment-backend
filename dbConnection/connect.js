const mongoose = require('mongoose');

const connectToMongoDb = (url)=>{
    return mongoose.connect(url)
}

module.exports = connectToMongoDb;