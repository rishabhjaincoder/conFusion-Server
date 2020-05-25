const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate'); 

// requiring mongoose and promotion model
const mongoose = require('mongoose');
const Promotions = require('../models/promotions');

// this will initialize promoRouter as a express router
const promoRouter = express.Router();

// this will parse the json inside the body
promoRouter.use(bodyParser.json());

promoRouter.route('/') 
    .get((req,res,next)=>{
        Promotions.find({})
        .then((promotions)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(promotions);
        },(err)=> next(err))
        .catch((err)=> next(err));
    })
    .post(authenticate.verifyUser,(req,res,next)=>{
        Promotions.create(req.body)
        .then((promotion)=>{
            console.log(`Promotion Created: ${promotion}`);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion);
        },(err)=> next(err))
        .catch((err)=> next(err));
    })
    .put(authenticate.verifyUser,(req,res,next)=>{
        res.statusCode = 403;
        // 403 means operation not supported
        res.end('PUT operation not supported on /promotions');
    })
    .delete(authenticate.verifyUser,(req,res,next)=>{
        Promotions.remove({})
        .then((response)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(response);
        },(err)=> next(err))
        .catch((err)=> next(err));
    });

promoRouter.route('/:promoId')
    .get((req,res,next)=>{
        Promotions.findById(req.params.promoId)
        .then((promotion)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion);
        },(err)=>next(err))
        .catch((err)=>next(err));
    })
    .post(authenticate.verifyUser,(req,res,next)=>{
        res.statusCode = 403;
        res.end('POST operation is not supported on /promotions/' + req.params.promoId);
    })
    .put(authenticate.verifyUser,(req,res,next)=>{
        Promotions.findByIdAndUpdate(req.params.promoId,{
            $set: req.body},
            { new: true})
            .then((promotion)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(promotion);
            },(err)=>next(err))
            .catch((err)=>next(err));
    })
    .delete(authenticate.verifyUser,(req,res,next)=>{
        Promotions.findByIdAndDelete(req.params.promoId)
        .then((promotion)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion);
        },(err)=>next(err))
        .catch((err)=>{next(err)});
    });

// to export the entire module, we do this
module.exports = promoRouter;