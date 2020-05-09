const mongoose =require("mongoose");
mongoose.connect('mongodb+srv://bulbatm:Kyubatau@123@cluster0-6kjh0.mongodb.net/test',{useNewUrlParser:true,useCreateIndex:true});
var conn =mongoose.connection;
var passdetails=new mongoose.Schema({

    passcat:{
        type:String,
        required:true,
        index:{
            unique:true,
        }
    },
    passdetails:{
        type:String,
        required:true,
        
    },
    project:{
        type:String,
        required:true,
        
    },
  
    date:{
        type:Date,
        default:Date.now
    }
});

var passdetailsModel=mongoose.model('passdetails',passdetails);
module.exports=passdetailsModel;