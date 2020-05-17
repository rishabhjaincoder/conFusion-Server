const express = require('express');
const bodyParser = require('body-parser');

// this will initialize dishROuter as a express router
const dishRouter = express.Router();

// this will parse the json inside the body
dishRouter.use(bodyParser.json());

// here we have chained all the methods- get post put delete in a single unit and this is the
// use of express router
dishRouter.route('/') // dont use semicolon here coz we want to chain all these here
    .all((req,res,next)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        next(); 
        })
    .get((req,res,next)=>{
        res.end('will send all the dishes to you!');
    })
    .post((req,res,next)=>{
        res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req,res,next)=>{
        res.statusCode = 403;
        // 403 means operation not supported
        res.end('PUT operation not supported on /dishes');
    })
    .delete((req,res,next)=>{
        res.end('Deleting all the dishes!');
    });

dishRouter.route('/:dishId')
.get((req,res,next)=>{
    res.end('will send details of the dish: ' + req.params.dishId + ' to you!');
    // data of dishId will be retrived from the req.params property 
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation is not supported on /dishes/' + req.params.dishId);
})
.put((req,res,next)=>{
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    // req.body.name will give the data using body parser that we have initialized above
    res.end('will update the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.delete((req,res,next)=>{
    res.end('Deleting dish: ' + req.params.dishId);
});

// to export the entire module, we do this
module.exports = dishRouter;