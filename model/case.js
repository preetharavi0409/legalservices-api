const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Case = new Schema({
  mcasetype: {
    type: String
  },
  sr_number: {
    type: Number
  },
  mcaseno: {
    type: String
  },
  mcaseyr: {
    type: String
  },
  filed_by:{
      type:String
  },
  appearing_for: {
    type: String
  },
  case_filed_on: {
    type: Date
  },
  bata_filed_on: {
    type: Date
  }, 
  bata_SR_number: {
    type: Number
  },
  corum: {
    type: String
  },
  client_name: {
    type: String
  },
  client_address: {
    type: String
  },
  client_ph: {
    type: Number
  },
  client_email: {
    type: String
  },
  records_received_date:{
      type: Date
  },
  lower_court_details:{
    type: String
},
referrer_name:{
    type: String
},
referrer_email:{
    type: String
},
referrer_ph:{
    type: Number
},
referrer_address:{
    type: String
},
case_status:{
    type: String
},
result:{
    type: String
},
copy_app_interim_date:{
    type: Date
},
copy_app_final_date:{
    type: Date
},
copy_app_final_type:{
    type: String
},
copy_app_final_no:{
    type: Number
},
copy_app_received:{
    type:Date
},
case_progress:{
    type: String
}
}, {
  collection: 'Cases'
})

module.exports = mongoose.model('Case', Case)
