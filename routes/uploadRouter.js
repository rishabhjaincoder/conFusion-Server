const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const dishRouter = express.Router();
// require multer middleware here
const multer = require('multer');

// configuring multer so that we can customise the way multer handles uploading files
// dishStorage helps to define storage engine and do configurations
const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null,'public/images');
    },
    filename: (req, file, cb)=>{
        // in cb first parameter is error
        cb(null,file.originalname);
        // this will make sure that the file name will be the same
    } 
    
});

// file filter accepts the file type that we want the user to upload
const imageFileFilter = (req, file, cb) =>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        // if the file extension does not match with the extensions provided above then
        return cb(new Error('You can upload only image files!'),false);
        // in cb first parameter is error, so here we are creating error object
    }
    cb(null, true);
    // here error is null, means the file is an image file and multer can now upload the file 
};

// here we are configuring multer
// first we have configured storage and the imageFileFilter and then used them here
const upload =multer({
    storage: storage,
    fileFilter: imageFileFilter
});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
// here we will allow only post method here 
// get, put and delete are not allowed here
.get(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403;
    // 403 means operation not supported
    res.end('GET operation not supported on /imageUpload');
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,
    upload.single('imageFile'), (req,res)=>{
// here we will add upload.single as a .post parameter after verifying user and admin
// and this allow us to upload a single file here and that file will be specified in the upload form
//         from the client side in the multipart form by using the name 'imageFile' there.
    // and the upload.single() will take care of the errors by its own and then call this callback funn.
    
    // at this point file has been uploaded and we need to handle the uploaded file
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(req.file); // we are passing this object in return to the client
    // this req.file also contain the path of the file which client can fetch from here and
    // store in the dish object image field when creating a dish
    
})
.put(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403;
    // 403 means operation not supported
    res.end('PUT operation not supported on /imageUpload');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403;
    // 403 means operation not supported
    res.end('DELETE operation not supported on /imageUpload');
});



module.exports = uploadRouter;