var express = require('express');
var router = express.Router();
var userModule=require('../modules/users');
var passcategory=require('../modules/passcat');
var passdetailModel=require('../modules/passdetails');


var bcrypt=require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
var viewpasscat=passcategory.find({});
var viewpassdetail=passdetailModel.find({});


/* GET home page. */
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexistemail=userModule.findOne({email:email});
  checkexistemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
  return res.render('signup', { title: 'Sign Up',msg:'Email Alraedy Exists' });

    }
    next();
  });
}
function checkUsername(req,res,next){
  var username=req.body.uname;
  var checkexistemail=userModule.findOne({username:username});
  checkexistemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
  return res.render('signup', { title: 'Sign Up',msg:'UserName Alraedy Exists' });

    }
    next();
  });
}
function verifyToken(req,res,next){
  var token=localStorage.getItem('userToken')
  try {
    var decoded = jwt.verify(token, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}
router.get('/', function(req, res, next) {
  var userName=localStorage.getItem('userName')
if(userName){
  res.redirect('/dashboard');

}else{
  res.render('index', { title: 'Login',msg:'' });

}
});
router.post('/', function(req, res, next) {
  var username=req.body.uname;
  var password=req.body.password1;
  var checkUser=userModule.findOne({username:username});
  checkUser.exec((err,doc)=>{
if(err) throw err;
if(doc){
var getpassword=doc.password;

  var getId=doc._id;
  if(bcrypt.compareSync(password,getpassword)){
    var token = jwt.sign({ userId: getId }, 'loginToken');
    
  localStorage.setItem('userToken', token);
  localStorage.setItem('userName', username);
  
  
  
    res.redirect('/dashboard');
  
  }
  else{
    res.render('index', { title: 'Login',msg:'Invalid UserName Or Password' });
  
  }
}else{
  res.render('index', { title: 'Login',msg:'Invalid UserName Or Password' });

}

  });
});
router.get('/dashboard',verifyToken, function(req, res, next) {
  var userName=localStorage.getItem('userName')
  res.render('dashboard', { title: 'DASHBOARD',userName:userName,msg:'' });
});
router.get('/signup', function(req, res, next) {
  var userName=localStorage.getItem('userName')
  if(userName){
    res.redirect('/dashboard');
  
  }else{
    res.render('signup', { title: 'Login',msg:'' });
  
  }
});
router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userName');
  localStorage.removeItem('userToken');

  res.redirect('/');
});
router.post('/signup',checkEmail,checkUsername, function(req, res, next) {

  var username=req.body.uname;
  var email=req.body.email;
  var password=req.body.password1;
  var cpassword=req.body.password2;
if(password != cpassword){
  res.render('signup', { title: 'Sign Up',msg:'Password Not Matched' });

}else{
  password=bcrypt.hashSync(password,10);
  var userDetails=new userModule({
    username:username,
    email:email,
    password:password,

  });

  userDetails.save((err,doc)=>{
    if(err) throw err;
  res.render('signup', { title: 'Sign Up',msg:'User Register Succeessfully' });

  });
}
    

});
router.get('/get-category-name',verifyToken, function(req, res, next) {
  var userName=localStorage.getItem('userName')
  res.render('get-category-name', { title: 'DASHBOARD',userName:userName,errors:'',success:'' });
});
router.post('/get-category-name',verifyToken,  [check('uname','Enter Password Category Name').isLength({ min: 1 })], function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('get-category-name', { title: 'Password Category Name',userName:userName,errors:errors.mapped(),success:'' });

  }else{
  var name=req.body.uname;
var passcatSave=new passcategory(
  {
    passcat:name
  }
);
passcatSave.save((err,doc)=>{
  if(err){
    res.render('get-category-name', { title: 'Password Category Name',userName:userName,errors:'',success:'Something went wrong!' });

  }else{
    res.render('get-category-name', { title: 'Password Category Name',userName:userName,errors:'',success:'Password Category Inserted Successfully!' });

  }
})

  }
  var userName=localStorage.getItem('userName')

});
router.get('/view-category',verifyToken, function(req, res, next) {
  var userName=localStorage.getItem('userName')
  viewpasscat.exec((err,data)=>{
    if(err) throw err;
  res.render('view-category', { title: 'DASHBOARD',userName:userName,errors:false,record:data });

  });
});
router.get('/passcat/delete/:id',verifyToken, function(req, res, next) {
  var userName=localStorage.getItem('userName')
  passcategory.findByIdAndDelete(req.params.id).exec((err,data)=>{
    if(err) throw err;
  res.redirect('/view-category');

  });
  
 
});
router.get('/passcat/edit',verifyToken, function(req, res, next) {
  var userName=localStorage.getItem('userName')
  viewpasscat.exec((err,data)=>{
    if(err) throw err;
  res.render('view-category', { title: 'DASHBOARD',userName:userName,errors:true,record:data });

  });

  });
  router.post('/passcat/edit',verifyToken, function(req, res, next) {
    var userName=localStorage.getItem('userName')
    passcategory.findByIdAndUpdate(req.body.id,{passcat:req.body.passname}).exec((err,data)=>{
  
    
       if(err) throw err;
    res.redirect('/view-category');
  
    });
  
 
});

router.get('/add-new-password', function(req, res, next) {
  var userName=localStorage.getItem('userName')
  viewpasscat.exec((err,data)=>{
    if(err) throw err;
    res.render('add-new-password', { title: 'add-new-password',msg:'' ,errors:'',success:'',record:data,userName:userName});

  })
});
  router.post('/add-new-password', function(req, res, next) {
    var userName=localStorage.getItem('userName')

    var de1=passdetailModel.findOne({passcat:req.body.pass});
    de1.exec((err,doc)=>{
      if(err) throw err;
      if(!doc){
        var userName=localStorage.getItem('userName')
        var passdetail=new passdetailModel({
          passcat:req.body.pass,
          passdetails:req.body.detail,
          project:req.body.project
        });
        
          passdetail.save((err,doc)=>{
            if(err) throw err;
            viewpasscat.exec((err,data)=>{
              if(err) throw err;
            
            res.render('add-new-password', { userName:userName,title: 'add-new-password',msg:'' ,errors:'',success:'Successfull Inserted',record:data});
    
          });
      
        });
      }else{
        viewpasscat.exec((err,data)=>{
          if(err) throw err;
        res.render('add-new-password', { userName:userName,title: 'add-new-password', title: userName,msg:'' ,errors:'Alredy exist',success:'',record:data});
        });
      }

    });
  });
    router.get('/view-password-detail', function(req, res, next) {
      var userName=localStorage.getItem('userName')
      viewpassdetail.exec((err,data)=>{
        if(err) throw err;
        res.render('view-password-detail', { title: 'view-password-detail',userName:userName ,errors:'',success:'',record:data});
    
      });
    });




module.exports = router;
