const mongoose = require('mongoose'),
    bcrypt= require('bcrypt');

const userSchmea = new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
    },
    password:{
        type:String,
        required:true
    },
    updated:{
        type:String,
        default:''
    },
    created:{
        type:Date,
        default:Date.now
    },
    about:{
        type:String,
        trim : true
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]

})


userSchmea.methods.hashPassword=async function(){
    this.password= await bcrypt.hash(this.password,10);
}

userSchmea.methods.comparePassword= async function (password){
    const tell=await bcrypt.compare(password,this.password)
    return tell;
}


module.exports= mongoose.model('User',userSchmea)
