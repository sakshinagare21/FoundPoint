const mongoose=require('mongoose')

const register=mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        require:true
    },
    mob:{
        type:Number,
        require:true
    },
    image:{
        type:String,
        require:false
    },
    
},{timestamps:true})

module.exports=mongoose.model('user_regs',register);