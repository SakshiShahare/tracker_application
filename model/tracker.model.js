const mongoose = require('mongoose');


const trackerSchema = new mongoose.Schema({
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },

    title : {
        type : String,
        required : true
    }, 

    sponsor : {
        type : String,
    }, 
    manager : {
        type : String,
    },
    report : {
        type : String,
    },
    report_Number : {
        type : String
    },
    RAG_status : {
        type :String,
        possibleValues : ['red', 'amber' , 'green'],
    },
    headline : {
        type : String
    },
    tasks: {
        type : String
    },
    comment : {
        type : String
    },
    completion_date_plan : {
        type :Date
    },
    completion_date_acutal : {
        type : Date
    },
    add_more : {
        type : String
    },
    risk : {
        type : String
    }
});


const Tracker = mongoose.model("Tracker" , trackerSchema);

module.exports = Tracker;