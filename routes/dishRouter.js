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
    res.end('POST operation is not supported on /dishes/' + req.params.dishId);
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

// to export the entire module, we do this
module.exports = dishRouter;