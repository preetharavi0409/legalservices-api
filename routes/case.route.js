const express = require ('express');
const app = express();
const caseRoute = express.Router();
const fetch = require('node-fetch');
var where = require('lodash.where');
const json2html = require('node-json2html');
var nodemailer = require('nodemailer');

let template = {'<>':'tr','html':'<td style=\"border: 1px solid black\;\"> ${courtno} </td> <td style=\"border: 1px solid black\;\"> ${serial_no} </td> <td style=\"border: 1px solid black\;\"> ${mcasetype} </td> <td style=\"border: 1px solid black\;\"> ${mcaseno} </td> <td style=\"border: 1px solid black\;\"> ${mcaseyr} </td>  <td style=\"border: 1px solid black\;\"> ${judge1} </td> <td style=\"border: 1px solid black\;\"> ${judge2} </td> '};

//Case Model

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ACCOUNT_NAME,
   // pass: 'admbrc!26'
   pass: process.env.MAIL_ACCOUNT_PASSWORD
  }
});

let Case = require('../model/case');
const { Console } = require('console');

//Add  New Case

// Add Student
caseRoute.route('/add-case').post((req, res, next) => {
    Case.create(req.body, (error, data) => {
      if (error) {
        console.log(error);
        return next(error)
      } else {
        res.json(data)
      }
    })
  });

  // Get all Cases
caseRoute.route('/').get((req, res) => {
    Case.find((error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    })
  })
  
  // Get single student
  caseRoute.route('/read-case/:id').get((req, res) => {
    Case.findById(req.params.id, (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    })
  })

  caseRoute.route('/active-cases').get((req, res) => {
    Case.find({case_status:"Active"},{mcasetype:1,mcaseno:1,mcaseyr:1,_id:0}, (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    })
  })

  function activeList()
  {
    
  }

  caseRoute.route('/list').get(async (req,res)=>{
    var currentDate = new Date();
    var tomorrowDate = new Date();

    if (currentDate.getDay() ==5)
       tomorrowDate.setDate(currentDate.getDate()+3);
    else if (currentDate.getDay() == 6)
      tomorrowDate.setDate(currentDate.getDate()+2);
    else 
      tomorrowDate.setDate(currentDate.getDate()+1);

    var nextDate = ("0" + tomorrowDate.getDate()).slice(-2);
    var month = ("0" + (tomorrowDate.getMonth()+1)).slice(-2);
    var year = tomorrowDate.getFullYear();
    var causeList_URL =  process.env.MHC_CAUSELIST_URL+nextDate+month+year+`.xml`;
    const fetch_response =  await  fetch (causeList_URL);
    const listJson = await fetch_response.json();


    var activeList_URL = process.env.ACTIVE_CASES_URL;
    

    const fetch_response1 =  await  fetch (activeList_URL);
    const filter = await fetch_response1.json();
    var causelist ="";
    for (var key in filter) {
      if (filter.hasOwnProperty(key)) {
        var filtered = "";
        var val = filter[key];
        filtered = where(listJson,val);
        if(filtered != "")
        causelist = causelist+json2html.transform(filtered,template);
        }
    }
  var sub = 'Cause List for ' + tomorrowDate;
  var mailOptions = {
  from: process.env.MAIL_ACCOUNT_NAME,
  //to: ' dravichander@outlook.com,ravichander_adk@yahoo.com,dineshkumarkpk@gmail.com,kumaresan5528@gmail.com,jayanmadhavan1993@gmail.com',
  to: process.env.TO_ADDRESS,
  subject: sub,
  html: `<h1>Cause List for your cases are as below</h1> <table style="border: 1px solid black"> <tr> <td style=\"border: 1px solid black\;\"> Court No. </td> <td style=\"border: 1px solid black\;\"> Item No. </td><td style=\"border: 1px solid black\;\"> Case Type </td> <td style=\"border: 1px solid black\;\"> Case No. </td> <td style=\"border: 1px solid black\;\"> Case Year </td> <td style=\"border: 1px solid black\;\"> Judge 1 </td> <td style=\"border: 1px solid black\;\"> Judge 2 </td> </tr>` + causelist
};
if(causelist!=""){
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
 }

    res.json(causelist);
   });
  
  // Update student
caseRoute.route('/update-case/:id').put((req, res, next) => {
    Case.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, (error, data) => {
      if (error) {
        return next(error);
        console.log(error)
      } else {
        res.json(data)
        console.log('Case successfully updated!')
      }
    })
  })
  
  // Delete student
  caseRoute.route('/delete-case/:id').delete((req, res, next) => {
    Case.findByIdAndRemove(req.params.id, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
          msg: data
        })
      }
    })
  })
  
  module.exports = caseRoute;