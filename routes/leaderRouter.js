const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

// requiring mongoose and leader model
const mongoose = require('mongoose');
const Leaders = require('../models/leaders');

// this will initialize leaderRouter as a express router
const leaderRouter = express.Router();

// this will parse the json inside the body
leaderRouter.use(bodyParser.json());

leaderRouter.route('/') 
    .get((req,res,next)=>{
        Leaders.find({})
        .then((leaders)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(leaders);
        },(err)=> next(err))
        .catch((err)=> next(err));
    })
    .post(authenticate.verifyUser, (req,res,next)=>{
        Leaders.create(req.body)
        .then((leader)=>{
            console.log(`Leader Created: ${leader}`);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leader);
        },(err)=> next(err))
        .catch((err)=> next(err));
    })
    .put(authenticate.verifyUser, (req,res,next)=>{
        res.statusCode = 403;
        // 403 means operation not supported
        res.end('PUT operation not supported on /leaders ');
    })
    .delete(authenticate.verifyUser, (req,res,next)=>{
        Leaders.remove({})
        .then((response)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(response);
        },(err)=> next(err))
        .catch((err)=> next(err));
    });

leaderRouter.route('/:leaderId')
    .get((req,res,next)=>{
        Leaders.findById(req.params.leaderId)
        .then((leader)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leader);
        },(err)=>next(err))
        .catch((err)=>next(err));
    })
    .post(authenticate.verifyUser, (req,res,next)=>{
        res.statusCode = 403;
        res.end('POST operation is not supported on /leaders/' + req.params.leaderId);
    })
    .put(authenticate.verifyUser, (req,res,next)=>{
        Leaders.findByIdAndUpdate(req.params.leaderId,{
            $set: req.body},
            { new: true})
            .then((leader)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(leader);
            },(err)=>next(err))
            .catch((err)=>next(err));
    })
    .delete(authenticate.verifyUser, (req,res,next)=>{
        Leaders.findByIdAndDelete(req.params.leaderId)
        .then((leader)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leader);
        },(err)=>next(err))
        .catch((err)=>{next(err)});
    });

// to export the entire module, we do this
module.exports = leaderRouter;