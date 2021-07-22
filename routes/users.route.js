const express = require ('express');
const app = express();
const userRoute = express.Router();
var User = require ('../model/user');
const jwt = require ('jsonwebtoken');

  userRoute.post('/register',function(req,res,next){
     req.body.password = User.hashPassword(req.body.password);
    User.create(req.body, (error, data) => {
    if (error) {
      console.log(error);
      return next(error)
    } else {
      res.json(data);
    }
  })
});

userRoute.route('/login').post((req, res,next) => {
    User.findOne({email:req.body.email},{password:1,userName:1,_id:0}, (error, data) => {
      if (error) {
        return res.status(500).json({message :'Email id not registered'});
      } else {

        if(data == null){
            return res.status(500).json({message :'Email id not registered'});
        }
        if (data.isValid(req.body.password)){
            let token = jwt.sign({userName:data.userName},process.env.SECRET,{expiresIn:'3h'});
            return res.json(token);
        }
        else{
            return res.status(501).json({message :'Wrong Password!'});
        }
      }
    })
  })
  var decodedToken ='';
  userRoute.route('/username/').get((req, res) => {

    let token = req.query.token;
    jwt.verify(token,process.env.SECRET,function(err,tokendata){
        if(err){
            return res.status(400).json({message:'Unauthorized request'});
        }
        if(tokendata){
            return res.status(200).json(tokendata.userName);
            
        }
    })  })



module.exports = userRoute;