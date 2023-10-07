const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
require("./db/index");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./router/user");
const dataRoute = require("./router/data");

const app = express();
let PORT = 8000;

app.use(cors({origin:true, credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoute);
app.use("/data", dataRoute);



app.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`);
})