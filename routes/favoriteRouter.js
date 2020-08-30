const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

// this is authenticate wali file
const authenticate = require('../authenticate');
const cors = require('./cors');

// importing favorite model
const Favorites = require('../models/favorite');

// configuring favoriteRouter as express router
const favoriteRouter = express.Router();

// using body parser
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({})
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                // extract favorites that match the req.user.id
                if (favorites) {
                    user_favorites = favorites.filter(fav => fav.user._id.toString() === req.user._id.toString())[0];
                    if (!user_favorites) {
                        var err = new Error('You have no favorites!');
                        err.status = 404;
                        return next(err);
                    }
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(user_favorites);
                } else {
                    var err = new Error('There are no favorites');
                    err.status = 404;
                    return next(err);
                }

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser,
        (req, res, next) => {
            Favorites.find({})
                .populate('user')
                .populate('dishes')
                .then((favorites) => {
                    var user;
                    if (favorites)
                        user = favorites.filter(fav => fav.user._id.toString() === req.user._id.toString())[0];
                    if (!user)
                        user = new Favorites({ user: req.user._id });
                    for (let i of req.body) {
                        if (user.dishes.find((d_id) => {
                            if (d_id._id) {
                                return d_id._id.toString() === i._id.toString();
                            }
                        }))
                            continue;
                        user.dishes.push(i._id);
                    }
                    user.save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                        })
                        .catch((err) => next(err));

                })
                .catch((err) => next(err));
        })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({})
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                var favToRemove;
                if (favorites) {
                    favToRemove = favorites.filter(fav => fav.user._id.toString() === req.user._id.toString())[0];
                }
                if (favToRemove) {
                    favToRemove.remove()
                        .then((result) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(result);
                        }, (err) => next(err));

                } else {
                    var err = new Error('You do not have any favorites');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// configuring /:dishId endpoint
favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    // here in get operation we gonna check if the specific dish is present in the favorites or not
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                // checking if the favorites exists or not
                if (!favorites) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({ "exists": false, "favorites": favorites });
                }
                else {
                    // checking if the dishes are present in the favorites or not
                    // if present then the index should be greater than 0 and not -1
                    if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        return res.json({ "exists": false, "favorites": favorites });
                    }
                    else {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        return res.json({ "exists": true, "favorites": favorites });
                    }
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser,
        (req, res, next) => {
            Favorites.find({})
                .populate('user')
                .populate('dishes')
                .then((favorites) => {
                    var user;
                    if (favorites)
                        user = favorites.filter(fav => fav.user._id.toString() === req.user._id.toString())[0];
                    if (!user)
                        user = new Favorites({ user: req.user._id });
                    if (!user.dishes.find((d_id) => {
                        if (d_id._id)
                            return d_id._id.toString() === req.params.dishId.toString();
                    }))
                        user.dishes.push(req.params.dishId);

                    user.save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                        })
                        .catch((err) => next(err));

                })
                .catch((err) => next(err));
        })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /favorites/:dishId');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({})
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                var user;
                if (favorites)
                    user = favorites.filter(fav => fav.user._id.toString() === req.user._id.toString())[0];
                if (user) {
                    user.dishes = user.dishes.filter((dishid) => dishid._id.toString() !== req.params.dishId);
                    user.save()
                        // 
                        .then((result) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(result);
                        }, (err) => next(err))
                    //
                    // .then((favorite) => {
                    //     Favorites.findById(favorite._id)
                    //     .populate('user')
                    //     .populate('dishes')
                    //     .then((favorite) => {
                    //         res.statusCode = 200;
                    //         res.setHeader('Content-Type', 'application/json');
                    //         res.json(favorite);
                    //     })
                    // })

                } else {
                    var err = new Error('you do not have any favorites');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// exporting favoriteRouter
module.exports = favoriteRouter;










// googled version

// const bodyParser = require('body-parser');
// const express = require('express');
// const cors = require('./cors');
// const authenticate = require('../authenticate');
// const Favorites = require('../models/favorite');

// const favoriteRouter = express.Router();
// favoriteRouter.use(bodyParser.json());

// // This function is re-used below
// const addToFavorites = (req, res, next) => {
//     // req.body is [{"_id":"dish ObjectId"}, . . ., {"_id":"dish ObjectId"}]
//     let dishesToAdd = req.body.map((entry) => entry['_id']).filter((id) => id); // remove bad entries
//     dishesToAdd = [...new Set(dishesToAdd)]; // remove duplicates
//     if (dishesToAdd.length) {
//         Favorites.find({ user: req.user._id })
//             .then((favorites) => {
//                 if (favorites.length) {
//                     // Entry exists for user, so add to it
//                     const favorite = favorites[0]; // If multiple entries exist per user just take the first one for now.
//                     const existingDishIds = favorite.dishes.map((object) => object._id.toString());
//                     const newDishesToAdd = dishesToAdd.filter((id) => !existingDishIds.includes(id));
//                     if (newDishesToAdd.length) {
//                         favorite.dishes = existingDishIds.concat(newDishesToAdd);
//                         favorite.save()
//                             .then((favorite) => {
//                                 Favorites.findById(favorite._id)
//                                     .populate('user')
//                                     .populate('dishes')
//                                     .then((favorite) => {
//                                         res.statusCode = 200;
//                                         res.setHeader('Content-Type', 'application/json');
//                                         res.json(favorite);
//                                     })
//                             }, (err) => next(err));
//                     } else {
//                         // No new dishes, just return the existing favorite entry
//                         res.statusCode = 200;
//                         res.setHeader('Content-Type', 'application/json');
//                         res.json(favorite);
//                     }
//                 } else {
//                     // No entry exists for user, create one
//                     newFavorite = {
//                         user: req.user._id,
//                         dishes: dishesToAdd,
//                     };
//                     Favorites.create(newFavorite)
//                         .then((favorite) => {
//                             Favorites.findById(favorite._id)
//                                 .populate('user')
//                                 .populate('dishes')
//                                 .then((favorite) => {
//                                     console.log('Favorite Created ', favorite);
//                                     res.statusCode = 200;
//                                     res.setHeader('Content-Type', 'application/json');
//                                     res.json(favorite);
//                                 })
//                         }, (err) => next(err))
//                         .catch((err) => next(err));
//                 }
//             }, (err) => next(err))
//             .catch((err) => next(err));
//     } else {

//     }
// };

// favoriteRouter.route('/')
//     .options(
//         cors.corsWithOptions,
//         (req, res) => {
//             res.sendStatus(200);
//         }
//     )
//     .get(
//         cors.corsWithOptions,
//         authenticate.verifyUser,
//         (req, res, next) => {
//             Favorites.find({ user: req.user._id })
//                 .populate('user')
//                 .populate('dishes')
//                 .then((favorites) => {
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'application/json');
//                     res.json(favorites);
//                 }, (err) => next(err))
//                 .catch((err) => next(err));
//         }
//     )
//     .post(
//         cors.corsWithOptions,
//         authenticate.verifyUser,
//         addToFavorites,
//     )
//     .put(
//         cors.corsWithOptions,
//         authenticate.verifyUser,
//         (_req, res, _next) => {
//             res.statusCode = 403;
//             res.end('PUT operation not supported on /favorites');
//         }
//     )
//     .delete(
//         cors.corsWithOptions,
//         authenticate.verifyUser,
//         (req, res, next) => {
//             Favorites.remove({ user: req.user._id })
//                 .then((resp) => {
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'application/json');
//                     res.json(resp);
//                 }, (err) => next(err))
//                 .catch((err) => next(err));
//         }
//     );

// favoriteRouter.route('/:dishId')
//     .options(
//         cors.corsWithOptions,
//         (req, res) => {
//             res.sendStatus(200);
//         }
//     )
//     .get(
//         cors.corsWithOptions,
//         authenticate.verifyUser,
//         (_req, res, _next) => {
//             Favorites.findOne({ user: req.user._id })
//                 .then((favorites) => {
//                     const exists = favorites && (favorites.dishes.indexOf(req.params.dishId) >= 0);
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'application/json');
//                     return res.json(
//                         {
//                             "exists": exists,
//                             "favorites": favorites,
//                         }
//                     );
//                 }, (err) => next(err))
//                 .catch((err) => next(err))
//         }
//     )
//     .post(
//         cors.corsWithOptions,
//         authenticate.verifyUser,
//         (req, res, next) => {
//             req.body = [
//                 {
//                     "_id": req.params.dishId,
//                 }
//             ]
//             addToFavorites(req, res, next);
//         }
//     )
//     .put(
//         cors.corsWithOptions,
//         authenticate.verifyUser,
//         (_req, res, _next) => {
//             res.statusCode = 403;
//             res.end(`PUT operation not supported on /favorites/${req.params.dishId}`);
//         }
//     )
//     .delete(
//         cors.corsWithOptions,
//         authenticate.verifyUser,
//         (req, res, next) => {
//             Favorites.find({ user: req.user._id })
//                 .then((favorites) => {
//                     if (favorites.length) {
//                         // Entry exists for user, so remove dishId from it
//                         const favorite = favorites[0]; // If multiple entries exist per user just take the first one for now.
//                         const existingDishIds = favorite.dishes.map((object) => object._id.toString());
//                         if (existingDishIds.includes(req.params.dishId)) {
//                             favorite.dishes = existingDishIds.filter((id) => id != req.params.dishId);
//                             favorite.save()
//                                 .then((favorite) => {
//                                     Favorites.findById(favorite._id)
//                                         .populate('user')
//                                         .populate('dishes')
//                                         .then((favorite) => {
//                                             res.statusCode = 200;
//                                             res.setHeader('Content-Type', 'application/json');
//                                             res.json(favorite);
//                                         })
//                                 }, (err) => next(err));
//                         } else {
//                             // If nothing to delete just return the entry
//                             res.statusCode = 200;
//                             res.setHeader('Content-Type', 'application/json');
//                             res.json(favorite);
//                         }
//                     } else {
//                         // If no entry for user, just return ok
//                         res.sendStatus(200);
//                     }
//                 }, (err) => next(err))
//                 .catch((err) => next(err));
//         }
//     );

// module.exports = favoriteRouter;