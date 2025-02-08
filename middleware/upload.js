const multer = require('multer');
const path = require('path');
const fs = require('fs');


const uploadfolder = path.join(__dirname,'../public/uploads');
if(!fs.existsSync(uploadfolder)){
    (fs.mkdirSync(uploadfolder,{recursive:true}));
}
const storage = multer.diskStorage({
    destination:function(req,res,cb){
        cb(null, "public/uploads/");
    },
    filename:function(req,file,cb){
        cb(null,`${Date.now()} - ${file.originalname}`);
    },
});

const filefilter = (req,file,cb)=>{
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if(extname && mimetype){
        return cb(null,true);
    }else{
        cb(new Error('only images are allowed'),false);
    }
};

const upload = multer({
    storage:storage,
    limits:{
        fileSize:5*1024*1024
    },
    fileFilter:filefilter,
});

module.exports = upload;