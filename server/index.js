require('dotenv').config()
const express= require('express'),
    bodyParser= require('body-parser'),
    cors= require('cors');

const db= require('./models')   

//db.User.db.dropDatabase();




const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true} ))
app.use(cors())

app.use('/',require('./routes'))

app.use((req,res,next)=>{
    const err= new Error('Not found');
    next(err);
})

app.use((err,req,res,next)=>{
    res.json({
        err:err.message || 'Something went wrong'
    })

})


app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`);
    
})



