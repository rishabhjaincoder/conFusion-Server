const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const authenticate = require('../authenticate');

// importing cors.js file here
const cors = require('./cors');

const Dishes = require('../models/dishes');

// this will initialize dishROuter as a express router
const dishRouter = express.Router();

// this will parse the json inside the body
dishRouter.use(bodyParser.json());

// here we have chained all the methods- get post put delete in a single unit and this is the
// use of express router
dishRouter.route('/')
    //in options, whenever u need to preflight your request, client will first send the options request message
    // and then obtain the reply from the server side, before sending the actual request
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Dishes.find({})
            .populate('comments.author') // adding this using mongoose population
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.create(req.body)
            .then((dish) => {
                console.log("Dish Created: ", dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        // 403 means operation not supported
        res.end('PUT operation not supported on /dishes');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.remove({})
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

dishRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author') // adding this using mongoose population
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation is not supported on /dishes/${req.params.dishId}`);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// these routes are for performing operations on sub-document, which in our case is comments
dishRouter.route('/:dishId/comments')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author') // adding this using mongoose population
            .then((dish) => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                }
                else {
                    err = new Error("Dish " + req.params.dishId + " not found!");
                    err.status = 404;
                    return next(err); // this will be handled by error handling mechanism in app.js file
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    // this will store the current user id into the author field
                    req.body.author = req.user._id;
                    dish.comments.push(req.body);
                    dish.save()
                        .then((dish) => {
                            Dishes.findById(dish._id)
                                .populate('comments.author')
                                // here users information will get populated first and then returned to user as json string
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(dish);
                                })
                        }, err => next(err));
                }
                else {
                    err = new Error("Dish " + req.params.dishId + " not found!");
                    err.status = 404;
                    return next(err); // this will be handled by error handling mechanism in app.js file
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        // 403 means operation not supported
        res.end(`PUT operation not supported on /dishes/${req.params.dishId}/comments`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    for (var i = (dish.comments.length - 1); i >= 0; i--) {
                        // this will delete all the comments one by one
                        dish.comments.id(dish.comments[i]._id).remove();
                    }
                    dish.save() // here we will save the dish, same thing that we do after pushing the data
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, err => next(err));
                }
                else {
                    err = new Error("Dish " + req.params.dishId + " not found!");
                    err.status = 404;
                    return next(err); // this will be handled by error handling mechanism in app.js file
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

dishRouter.route('/:dishId/comments/:commentId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author') // adding this using mongoose population
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));
                }
                else if (dish == null) {
                    err = new Error("Dish " + req.params.dishId + " not found!");
                    err.status = 404;
                    return next(err); // this will be handled by error handling mechanism in app.js file
                }
                else {
                    err = new Error("Comment " + req.params.commentId + " not found!");
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation is not supported on /dishes/${req.params.dishId}/comments/${req.params.commentId}`);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                // assignment work
                if (dish.comments.id(req.params.commentId).author.toString() != req.user._id.toString()) {
                    err = new Error('You are not authorized to edit this comment');
                    err.status = 403;
                    return next(err);
                }
                if (dish != null && dish.comments.id(req.params.commentId) != null) {

                    if (req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        dish.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    dish.save()
                        .then((dish) => {
                            Dishes.find(dish._id)
                                .populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.header('Content-Type', 'application/json');
                                    res.json(dish);
                                })
                        }, (err) => { next(err) });
                }
                else if (dish == null) {
                    err = new Error("Dish " + req.params.dishId + " not found!");
                    err.status = 404;
                    return next(err); // this will be handled by error handling mechanism in app.js file
                }
                else {
                    err = new Error("Comment " + req.params.commentId + " not found!");
                    err.status = 404;
                    return next(err);
                }

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                // we will check 3 conditions here as follows
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    // assignment work
                    if (dish.comments.id(req.params.commentId).author.toString() != req.user._id.toString()) {
                        err = new Error('You are not authorized to delete this comment');
                        err.status = 403;
                        return next(err);
                    }

                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                        .then((dish) => {
                            Dishes.find(dish._id)
                                .populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.header('Content-Type', 'application/json');
                                    res.json(dish);
                                })
                        }, err => next(err));
                }
                else if (dish == null) {
                    err = new Error("Dish " + req.params.dishId + " not found!");
                    err.status = 404;
                    return next(err); // this will be handled by error handling mechanism in app.js file
                }
                else {
                    err = new Error("Comment " + req.params.commentId + " not found!");
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// to export the entire module, we do this
module.exports = dishRouter;