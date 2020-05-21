const express = require('express');
const bodyParser = require('body-parser');

// requiring mongoose and dish model
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

// this will initialize dishROuter as a express router
const dishRouter = express.Router();

// this will parse the json inside the body
dishRouter.use(bodyParser.json());

// here we have chained all the methods- get post put delete in a single unit and this is the
// use of express router
dishRouter.route('/') 
    .get((req,res,next)=>{
        Dishes.find({})
        .then((dishes)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dishes);
        },(err)=> next(err))
        .catch((err)=> next(err));
    })
    .post((req,res,next)=>{
        Dishes.create(req.body)
        .then((dish)=>{
            console.log("Dish Created: ",dish);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish);
        },(err)=>next(err))
        .catch((err)=> next(err));
    })
    .put((req,res,next)=>{
        res.statusCode = 403;
        // 403 means operation not supported
        res.end('PUT operation not supported on /dishes');
    })
    .delete((req,res,next)=>{
        Dishes.remove({})
        .then((response)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(response);
        },(err)=> next(err))
        .catch((err)=>next(err));
    });

dishRouter.route('/:dishId')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=> next(err));
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end(`POST operation is not supported on /dishes/${req.params.dishId}`);
})
.put((req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set: req.body
    },{ new : true })   
    .then((dish)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=> next(err));
})
.delete((req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((dish)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=> next(err));
});

// these routes are for performing operations on sub-document, which in our case is comments
dishRouter.route('/:dishId/comments') 
    .get((req,res,next)=>{
        Dishes.findById(req.params.dishId)
        .then((dish)=>{
            if (dish!= null){
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish.comments);
            }
            else{
                err = new Error("Dish " + req.params.dishId + " not found!");
                err.status = 404; 
                return next(err); // this will be handled by error handling mechanism in app.js file
            }
        },(err)=> next(err))
        .catch((err)=> next(err));
    })
    .post((req,res,next)=>{
        Dishes.findById(req.params.dishId)
        .then((dish)=>{
            if (dish!= null){
                dish.comments.push(req.body);
                dish.save()
                .then((dish)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
                },err => next(err));
            }
            else{
                err = new Error("Dish " + req.params.dishId + " not found!");
                err.status = 404; 
                return next(err); // this will be handled by error handling mechanism in app.js file
            }
        },(err)=>next(err))
        .catch((err)=> next(err));
    })
    .put((req,res,next)=>{
        res.statusCode = 403;
        // 403 means operation not supported
        res.end(`PUT operation not supported on /dishes/${req.params.dishId}/comments`);
    })
    .delete((req,res,next)=>{
        Dishes.findById(req.params.dishId)
        .then((dish)=>{
            if (dish!= null){
                for(var i = (dish.comments.length -1) ; i>=0 ; i--){
                    // this will delete all the comments one by one
                    dish.comments.id(dish.comments[i]._id).remove();   
                }
                dish.save() // here we will save the dish, same thing that we do after pushing the data
                .then((dish)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
                },err => next(err));
            }
            else{
                err = new Error("Dish " + req.params.dishId + " not found!");
                err.status = 404; 
                return next(err); // this will be handled by error handling mechanism in app.js file
            }
        },(err)=> next(err))
        .catch((err)=>next(err));
    });

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if (dish!= null && dish.comments.id(req.params.commentId) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish ==  null){
            err = new Error("Dish " + req.params.dishId + " not found!");
            err.status = 404; 
            return next(err); // this will be handled by error handling mechanism in app.js file
        }
        else{
            err = new Error("Comment " + req.params.commentId + " not found!");
            err.status = 404; 
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=> next(err));
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end(`POST operation is not supported on /dishes/${req.params.dishId}/comments/${req.params.commentId}`);
})
.put((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if (dish!= null && dish.comments.id(req.params.commentId) != null){

            // we cannot update a subDocument inside a document by some pre defined function, so we do
            //      the things like this
            if(req.body.rating){ // this will check if the user wants to update the rating or not
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if(req.body.comment){ // this will check if user wants to update the comment or not
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }

            dish.save()
            .then((dish)=>{
                res.statusCode=200;
                res.header('Content-Type','application/json');
                res.json(dish);
            },(err)=>{next(err)});
        }
        else if (dish ==  null){
            err = new Error("Dish " + req.params.dishId + " not found!");
            err.status = 404; 
            return next(err); // this will be handled by error handling mechanism in app.js file
        }
        else{
            err = new Error("Comment " + req.params.commentId + " not found!");
            err.status = 404; 
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=> next(err));
})
.delete((req,res,next)=>{
        Dishes.findById(req.params.dishId)
        .then((dish)=>{
            // we will check 3 conditions here as follows
            if (dish!= null && dish.comments.id(req.params.commentId) != null){
                dish.comments.id(req.params.commentId).remove();   
                dish.save()
                .then((dish)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
                },err => next(err));
            }
            else if (dish ==  null){
                err = new Error("Dish " + req.params.dishId + " not found!");
                err.status = 404; 
                return next(err); // this will be handled by error handling mechanism in app.js file
            }
            else{
                err = new Error("Comment " + req.params.commentId + " not found!");
                err.status = 404; 
                return next(err);
            }
        },(err)=> next(err))
        .catch((err)=>next(err));
});

// to export the entire module, we do this
module.exports = dishRouter;