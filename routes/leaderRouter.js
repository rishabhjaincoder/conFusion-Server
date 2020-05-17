const express = require('express');
const bodyParser = require('body-parser');

// this will initialize leaderRouter as a express router
const leaderRouter = express.Router();

// this will parse the json inside the body
leaderRouter.use(bodyParser.json());

leaderRouter.route('/') 
    .all((req,res,next)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        next(); 
        })
    .get((req,res,next)=>{
        res.end('will send all the leaders to you!');
    })
    .post((req,res,next)=>{
        res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req,res,next)=>{
        res.statusCode = 403;
        // 403 means operation not supported
        res.end('PUT operation not supported on /leaders');
    })
    .delete((req,res,next)=>{
        res.end('Deleting all the leaders!');
    });

leaderRouter.route('/:leaderId')
    .get((req,res,next)=>{
        res.end('will send details of the leader: ' + req.params.leaderId + ' to you!');
    })
    .post((req,res,next)=>{
        res.statusCode = 403;
        res.end('POST operation is not supported on /leaders/' + req.params.leaderId);
    })
    .put((req,res,next)=>{
        res.write('Updating the leader: ' + req.params.leaderId + '\n');
        res.end('will update the leader: ' + req.body.name + ' with details: '
        + req.body.description);
    })
    .delete((req,res,next)=>{
        res.end('Deleting leader: ' + req.params.leaderId);
    });

// to export the entire module, we do this
module.exports = leaderRouter;