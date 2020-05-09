const mongoose =require("mongoose");
mongoose.connect('mongodb+srv://bulbatm:Kyubatau@123@cluster0-6kjh0.mongodb.net/test',{useNewUrlParser:true,useCreateIndex:true});
var conn =mongoose.connection;
var passcat=new mongoose.Schema({

    passcat:{
        type:String,
        required:true,
        index:{
            unique:true,
        }
    },
  
    date:{
        type:Date,
        default:Date.now
    }
});

var passcatModel=mongoose.model('passcat',passcat);
module.exports=passcatModel;