const express = require("express");
const cors = require('cors');
const app =express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());//middleware

const fileupload= require("express-fileupload");
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));//middleware


app.get("/",(req,res)=>{//default route
    res.send("<h1>This is Default Home Page");
});

const dbConnect = require("./config/database");
dbConnect();//connect the database

//cloud connection
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();


//routes
const Upload =require("./routes/fileUpload");

//mount
app.use("/api/v1/upload",Upload);

app.listen(PORT,()=>{
    console.log(`server started on port ${PORT} sucessfully`);
});