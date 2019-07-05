require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect(process.env.MongoseUrl,{ useNewUrlParser:true },()=>{
    console.log("Database is connected");
    
})

module.exports.User= require('./user');
module.exports.Post= require('./post')


