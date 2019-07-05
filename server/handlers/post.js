const db= require('../models'),
        _ = require('underscore'),
        formidable = require('formidable'),
        fs= require('fs');

        
const create= async(req,res,next)=>{
    try{

        const form = new formidable.IncomingForm()
        const data= await new Promise((resolve,reject)=>{
            form.parse(req,(err,fields,files)=>{
                if(err){
                    reject(err);
                    next(err);
                }
                resolve({
                    fields,
                    files
                })
            })
        })

        const {fields,files}= data;
        const newPost = new db.Post(fields);
        if(files.photo){
            newPost.photo.data= await fs.readFileSync(files.photo.path);
            newPost.photo.contentType= files.photo.type;
        }

        await newPost.save();
        res.json(newPost)

    }
    catch(err){
        next(err);
    }
}     

const photo = async (req,res,next)=>{
    try{
        const {postId}= req.params;
        const post= await db.Post.findById(postId)
        if(post.photo){
        res.set('Content-Type',post.photo.contentType);
        res.send(post.photo.data);
        }
        else throw new Error ('No photo exist')
    }
    catch(err){
        next(err);
    }
}

const listByUser = async (req,res,next)=>{
    try{
        const {userId}= req.params;
        
        const posts = await db.Post.find({postedBy:userId})
                                            .populate('comments.postedBy','_id username')
                                            .populate('postedBy','_id username')
                                            .sort({'created':-1})
        
        res.json(posts);

    }
    catch(err){
        next(err);
    }
}

const listNewsFeed = async (req,res)=>{
    const {userId} = req.params;
    const {following}= await db.User.findById(userId);
    following.push(userId);
    
    const posts = await db.Post.find({postedBy:{
            $in: following
        }}).populate('comments.postedBy','_id username')
           .populate('postedBy','_id username')
           .sort({'created':-1})
    res.json(posts)         

}

const like = async( req,res,next)=>{
    const {userId,postId} = req.body; 
    
   const post= await db.Post.findByIdAndUpdate(postId,{
        $push:{
            likes:userId
        }
    },{new:true}).populate('postedBy','_id username')

    
    
    res.json(post)  

}


const unlike = async (req,res,next)=>{
    const {userId,postId}= req.body;
    const post = await db.Post.findByIdAndUpdate(postId,{
        $pull:{
            likes:userId
        }
    },{new:true}).populate('postedBy','_id username')
   
    
    res.json(post)
}
const comment = async (req,res,next)=>{
    try{
    let {comment}= req.body;
    comment.postedBy = req.body.userId;
    comment.created=Date.now()
    const post =await db.Post.findByIdAndUpdate(req.body.postId,{
        $push:{
            comments:comment
        }
    },{new:true}) .populate('comments.postedBy','_id username')
        .populate('postedBy','_id username')

    res.json(post)
    }
    catch(err){
        next(err)
    }


}
const uncomment = async (req,res,next)=>{
    let {comment,postId}= req.body;
    
    const post =await db.Post.findByIdAndUpdate(postId,{
        $pull:{
            comments:{_id:comment._id }
        }
    },{new:true}) .populate('comments.postedBy','_id username')
        .populate('postedBy','_id username')
    res.json(post)
}

const remove = async(req,res,next)=>{
    const {postId}= req.params;
    const post=await db.Post.findByIdAndRemove(postId);
    res.json(post)

}

const postDetails=async (req,res,next)=>{
    const {postId}= req.params;
    const post = await db.Post.findById(postId)
                            .populate('postedBy','_id username')
                            .populate('comments.postedBy','_id username')
    res.json(post);
}


module.exports={
    create,
    photo,
    listByUser,
    listNewsFeed,
    like,
    unlike,
    comment,
    uncomment,
    remove,
    postDetails
}