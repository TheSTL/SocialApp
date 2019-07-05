const db= require('../models')
const jwt = require('jsonwebtoken')


const login = async (req,res,next)=>{

    try{
        const {username,password}= req.body;

        const user= await db.User.findOne({username});
        
        if(!user){
            throw new Error('Inavlid Username')
        }
        
        const valid = await user.comparePassword(password);

        if(valid){
            const {_id,username}= user;

            const token = await jwt.sign({_id,username},process.env.SECRET)
        
           return  res.json({
               token
           })

        }

            throw new Error('Inavlid Password')
        


    }
    catch(err){
        next(err)
    }

    


}

const signup= async (req,res,next)=>{
    try{
            const user = await new db.User(req.body);
            await user.hashPassword();
            
            await user.save();
            return res.json(user)

    }
    catch(err){
        next(err);
    }
}

module.exports={
    login,
    signup
}