const mongoose =require('mongoose');


const commentSchema = new mongoose.Schema({
    text:{
        type:String
    },
    created:{
        type:Date,
        default:Date.now
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})


const postSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    comments :[ commentSchema ],
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    created:{
        type:Date,
        default:Date.now
    }
})

module.exports= mongoose.model('Post',postSchema)