const File = require("../models/fileModel");
const cloudinary = require("cloudinary").v2;

exports.localFileUpload= async(req,res) =>{
    try{

        //fetch data
        const file= req.files.file;
        console.log("File->"+file);

        //set path
        let path=__dirname +"/files/"+Date.now()+`.${file.name.split(".")[1]}`;
        console.log("Path->"+path);

        //move file
        file.mv(path,(err)=>{
            console.log(err);
        });

        res.json({
            success: true,
            message:"Local file uploaded sucessfully",
        });

    }

    catch(error){
        console.log(error);
    }
}

//supporting check function
function fileSupported(fileType,supportedTypes){
    return supportedTypes.includes(fileType);
}

//uploading function

async function uploadToCloudinary(file,folder,quality){
    const options ={folder};
    console.log("temp path "+file.tempFilePath);
    options.resource_type="auto";
    if(quality){options.quality=quality};
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}


exports.imageUpload= async(req,res)=>{
    try{
    //fetch data
    const {name,tags,email}= req.body;
    console.log(name,tags,email);

    const file = req.files.imageFile;
    console.log(file);

    //validation
    const supportedTypes = ["png","jpg","jpeg"];
    const fileType= file.name.split(".")[1].toLowerCase();
    console.log(fileType);

    if(!fileSupported(fileType,supportedTypes)){
        return res.status(400).json({
            success:false,
            message:"your "+ fileType+" File type is not supported",
        });
    }   

    //supported 
    const response = await uploadToCloudinary(file,"fileUploadProject");
    console.log(response);

    //enter data in db
    const data = await File.create({
        name,
        tags,
        email,
        imageUrl:response.secure_url
        
    });

    res.json({
        success:true,
        message:"Image Sucessfully Uploaded",
        imageUrl:response.secure_url
    });
}
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:"Image Uploading Unsuccessful",
        })

    }
}

exports.videoUpload = async (req,res)=>{
    try{
        const {name,tags,email}= req.body;
        console.log(name,tags,email);
    
        const file = req.files.videoFile;
        console.log(file);

        //validation
        const supportedTypes =["mov","mp4"];
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log(fileType);
        
        if(!fileSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"your "+ fileType+" File type is not supported",
            });
        }  

        //if supported then
        const response = await uploadToCloudinary(file,"fileUploadProject");
         console.log(response);

        //  const videoData= file.create({
        //     name,
        //     tags,
        //     email,
        //     videoUrl:response.secure_Url,
        //  });

         res.json({
            success:true,
            message:"Video Sucessfully Uploaded",
            videoUrl:response.secure_url
        });


    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:"Video Uploading Unsuccessful",
        })
    }
}

exports.reducedImageUpload = async (req,res)=>{
    try{
        //fetch data
        const {name,tags,email}= req.body;
        console.log(name,tags,email);
    
        const file = req.files.imageFile;
        console.log(file);
    
        //validation
        const supportedTypes = ["png","jpg","jpeg"];
        const fileType= file.name.split(".")[1].toLowerCase();
        console.log(fileType);
    
        if(!fileSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"your "+ fileType+" File type is not supported",
            });
        }   
    
        //supported //write code to reduce in height wise 
        const response = await uploadToCloudinary(file,"fileUploadProject",60);
        console.log(response);
    
        //enter data in db
        const redimgdata = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url
            
        });
    
        res.json({
            success:true,
            message:"Reduced Image Sucessfully Uploaded",
            imageUrl:response.secure_url
        });
    }
        catch(error){
            console.error(error);
            res.status(400).json({
                success:false,
                message:"Reduced Image Uploading Unsuccessful",
            })
    
        }
}