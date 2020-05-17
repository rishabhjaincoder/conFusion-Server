const express = require('express');
const bodyParser = require('body-parser');

// this will initialize promoRouter as a express router
const promoRouter = express.Router();

// this will parse the json inside the body
promoRouter.use(bodyParser.json());

promoRouter.route('/') 
    .all((req,res,next)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        next(); 
        })
    .get((req,res,next)=>{
        res.end('will send all the promotions to you!');
    })
    .post((req,res,next)=>{
        res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req,res,next)=>{
        res.statusCode = 403;
        // 403 means operation not supported
        res.end('PUT operation not supported on /promotions');
    })
    .delete((req,res,next)=>{
        res.end('Deleting all the promotions!');
    });

promoRouter.route('/:promoId')
    .get((req,res,next)=>{
        res.end('will send details of the promotion: ' + req.params.promoId + ' to you!');
    })
    .post((req,res,next)=>{
        res.statusCode = 403;
        res.end('POST operation is not supported on /promotions/' + req.params.promoId);
    })
    .put((req,res,next)=>{
        res.write('Updating the promotion: ' + req.params.promoId + '\n');
        res.end('will update the promotion: ' + req.body.name + ' with details: '
        + req.body.description);
    })
    .delete((req,res,next)=>{
        res.end('Deleting promotion: ' + req.params.promoId);
    });

// to export the entire module, we do this
module.exports = promoRouter;