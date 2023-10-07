const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    chatName:{
        type: String,
    },
    chatData:[],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, {timestamps: true});


const DataModel = mongoose.model("data", dataSchema);
module.exports = DataModel;