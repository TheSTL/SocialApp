const db= require('../models')
const _ = require('underscore')
const formidable = require('formidable');
const fs = require('fs')
const path = require('path')

const list = async (req,res,next)=>{
    const users = await db.User.find().select('username email updated created');

    res.json(users)
}
const addFollowing= async (req,res,next)=>{
    try{
    const {followerId,followingId}= req.body;
    console.log(req.body);
    
    await db.User.findByIdAndUpdate(followerId,{
        $push:{
            following: followingId
        }
    },{new:true})
    res.json({
        sucess:true
    })
    }
    catch(err){
        next(err);
    }
}

const addFollower= async (req,res,next)=>{
    try{
    const {followerId,followingId}= req.body;
    
    
   const tt= await db.User.findByIdAndUpdate(followingId,{
        $push:{
            followers:followerId
        }
    },{new:true})

    
    next()
    
    }
    catch(err){
        next(err);
    }

}

const removeFollowing= async (req,res,next)=>{
    try{
    const {followerId,followingId}=req.body;
    await db.User.findByIdAndUpdate(followerId,{
        $pull:{
            following:followingId
        }
    },{new:true})
        res.json({
            sucess:true
        })
    }
    catch(err){
        next(err);
    }
}
const removeFollower= async(req,res,next)=>{
    try{
    const {followerId,followingId} = req.body;
    await db.User.findByIdAndUpdate(followingId,{
        $pull:{
            followers:followerId
        }
    },{new:true})
    next()
    }
    catch(err){
        next(err);
    }
}

const findPeople= async (req,res,next)=>{
    try{
    const {id}= req.params
    const user= await db.User.findById(id);
    let {following}= user;
    following.push(id);
    const leftUsers= await db.User.find({
        _id:{ $nin: following  }
    }).select('_id username');
    res.json(leftUsers);
    
    }
    catch(err){
        next(err);
    }

    
    
}

const userDetail= async (req,res,next)=>{
    try{
        const {id}=req.params;
        const user= await db.User.findById(id)
                                    .populate('followers','_id username')
                                    .populate('following','_id username')
        user.password='';
        res.json(user)    
    }
    catch(err){
        next(err);
    }
}

const remove=async(req,res,next)=>{
    const{id} = req.params;
    const user= await db.User.findById(id);
    await user.remove()
    res.json(user)
}

const update= async (req,res,next)=>{
    const {id}= req.params
    let user = await db.User.findById(id);
    console.log(req.body);
    
    
   const form = new formidable.IncomingForm()
   form.keepExtensions=true;
    
    const data = await new Promise((resolve,reject)=>{

        
        form.parse(req,(err,fields,files)=>{
        
            
            if(err){
                reject(err);
                return;
            }
            
            resolve({
                fields,
                files
            })
        })
    });
    


    if(data.fields.password==''){
        delete data.fields.password
    }    
    

    user= _.extend(user,data.fields);

    if(data.fields.password){
        await user.hashPassword();
        
    }
    
    if(data.files.photo){
        user.photo.data= await fs.readFileSync(data.files.photo.path)
        user.photo.contentType= data.files.photo.type;
    }
    user.updated= Date.now();

    await user.save();
    
    
   res.json(user)

}


const defaultPhoto= async (req,res,next)=>{
    return res.sendFile( path.join(__dirname,'../','defaultphoto.png'))    
}

const photo = async(req,res,next)=>{
    const {id}= req.params;
    const user= await db.User.findById(id);
    const{photo} = user;
    if(photo.data){
    res.set('Content-Type',photo.contentType);
    return res.send(photo.data)
    }
    next()
    
}


module.exports={
    list,
    addFollower,
    addFollowing,
    removeFollower,
    removeFollowing,
    findPeople,
    userDetail,
    remove,
    update,
    defaultPhoto,
    photo
}