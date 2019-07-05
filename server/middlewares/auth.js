const jwt = require('jsonwebtoken')
const isAuthentication = async (req,res,next)=>{
    try{

    
    const BearerToken = req.headers['authorization'];
    
    if(BearerToken){
        
        const token= BearerToken.split(' ')[1];
        req.decode = await jwt.verify(token,process.env.SECRET);
        next();
    }
    else {
        throw new Error('Not Authorized');
    }

    }
    catch(err){
        next(err)
    }

}
module.exports={
    isAuthentication
}