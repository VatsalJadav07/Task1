const mongoose = require('mongoose')

const dburl = 'mongodb://127.0.0.1:27017/Task';

const mongodb = async () => {
    try {
        await mongoose.connect(dburl,{});
        console.log('connnected to mongodb')
    } catch (e) {
        console.log(e)
    }
}

module.exports = { mongodb }