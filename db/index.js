const mongoose = require("mongoose");

mongoose.connect("mongodb://0.0.0.0:27017/chatgpt")
.then(()=>{
    console.log("db connected!");
})
.catch((err)=>{
    console.log(err.message);
})


// apikey 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 