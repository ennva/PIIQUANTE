const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sauce = require('../models/Sauce');
const User = require('../models/User');
require('dotenv').config()

exports.addSauce = async (req, res) => {

    //verification du token
    jwt.verify(req.token, process.env.APP_SECRET, (err, authData) => {

        if (err) {
            res.sendStatus(403)
        } else {
            //console.log(authData);
            /*
            res.json({
                message: "Welcome",
                userData: userData
            });
            */
        }
    });

    //recuperer la sauce transformer en chaine de caracteres et l'enregistrer dans la base de donnees
    //let sauceObj = JSON.parse(JSON.stringify(req.body));
    const sauceObj = JSON.parse(Object.assign({}, req.body).sauce);
    //verification de l'existance de l'id
    const user = await User.findById(sauceObj.userId);
    //console.log(user);
    if (!user) {
        return res.status(404).send({ error: "User not found!" });
    }

    //console.log(req.file);
    //const path = req.file.path.replace(/\\/g, "/").replace(/\../g, "");
    const path = req.file.destination.replace(/\\/g, "/").replace(/\../g, "") + "/" + req.file.originalname;
    console.log(path);

    const sauceToSave = {
        userId: user._id.toString(),
        name: sauceObj.name,
        manufacturer: sauceObj.manufacturer,
        description: sauceObj.description,
        mainPepper: sauceObj.mainPepper,
        imageUrl: req.protocol + '://' + req.get('host') + "/" + path,
        heat: sauceObj.heat,
        likes: 0,
        dislikes: 0,
        userLiked: [],
        userDisliked: []
    }

    const sauce = new Sauce(sauceToSave);
    sauce.save().then(() => res.status(201).send({ message: "Sauce Saved" }));

}

exports.getAllSauces = async (req, res) => {

    //verification du token
    jwt.verify(req.token, process.env.APP_SECRET, (err, authData) => {

        if (err) {
            res.sendStatus(403)
        } else {
            //console.log(authData);
            /*
            res.json({
                message: "Welcome",
                userData: userData
            });
            */
        }
    });

    Sauce.find()
        .then((sauces) => {
            const mappedSauces = sauces.map((sauce) => {
                return sauce;
            });
            return res.status(200).json(mappedSauces);
        })
        .catch(() => {
            return res.status(500).send({ error: 'Database error' });
        });
}

exports.getSauce = async (req, res) => {
    //verification du token
    jwt.verify(req.token, process.env.APP_SECRET, (err, authData) => {

        if (err) {
            res.sendStatus(403)
        } else {
            //console.log(authData);
            /*
            res.json({
                message: "Welcome",
                userData: userData
            });
            */
        }
    });

    console.log(req.params.id);
    Sauce.findById(req.params.id).then(
        (sauce) => {
            if (!sauce) {
                return res.status(404).send({ error: "Sauce not found!" })
            }

            res.status(200).json(sauce);
        }
    );
}

exports.updateSauce = async (req, res) => {
    //verification du token
    jwt.verify(req.token, process.env.APP_SECRET, (err, authData) => {

        if (err) {
            res.sendStatus(403)
        } else {
            //console.log(authData);
            /*
            res.json({
                message: "Welcome",
                userData: userData
            });
            */
        }
    });


    //console.log(req);
    //Capturer l'image si elle a change
    if (req.file) {
        const sauceObj = JSON.parse(Object.assign({}, req.body).sauce);
        //verification de l'existance de l'utilisateur dans la basse de donnee
        const user = await User.findById(sauceObj.userId);
        if (!user) {
            return res.status(404).send({ error: "User not found!" });
        }

        //Mise a jour de l'image telechargee et des autres informations
        const sauceFound = await Sauce.findById(req.params.id);
        if (sauceFound) {
            const path = req.file.destination.replace(/\\/g, "/").replace(/\../g, "") + "/" + req.file.originalname;
            console.log(path);

            sauceFound.name = sauceObj.name;
            sauceFound.manufacturer = sauceObj.manufacturer;
            sauceFound.description = sauceObj.description;
            sauceFound.mainPepper = sauceObj.mainPepper;
            sauceFound.imageUrl = req.protocol + '://' + req.get('host') + "/" + path;
            sauceFound.heat = sauceObj.heat;

            Sauce.findByIdAndUpdate(req.params.id, sauceFound).then(
                (sauce) => {
                    if (!sauce) {
                        return res.status(404).send({ error: "Sauce not found!" })
                    }

                    res.status(200).json(sauce);
                }
            );
        }
    } else {
        //Aucun fichier fourni, les informations sur la sauce se trouvent directement dans le corps de la requete
        const sauceObj = req.body;
        //verification de l'existance de l'utilisateur dans la basse de donnee
        const user = await User.findById(sauceObj.userId);
        if (!user) {
            return res.status(404).send({ error: "User not found!" });
        }
        //Mise a jour des informations
        const sauceFound = await Sauce.findById(req.params.id);
        if (sauceFound) {

            sauceFound.name = sauceObj.name;
            sauceFound.manufacturer = sauceObj.manufacturer;
            sauceFound.description = sauceObj.description;
            sauceFound.mainPepper = sauceObj.mainPepper;
            sauceFound.heat = sauceObj.heat;

            Sauce.findByIdAndUpdate(req.params.id, sauceFound).then(
                (sauce) => {
                    if (!sauce) {
                        return res.status(404).send({ error: "Sauce not found!" })
                    }

                    res.status(200).json(sauce);
                }
            );
        }
    }

}

exports.deteteSauce = async (req, res) => {
    //verification du token
    jwt.verify(req.token, process.env.APP_SECRET, (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {

        }
    });

    Sauce.findByIdAndDelete(req.params.id).then(
        (sauce) => {
            if (!sauce) {
                return res.status(404).send({ error: "Sauce not found!" })
            }
            res.status(200).send({ message: "Sauce Deleted!" })
        }
    );
}

exports.setLikeDislike = async (req, res) => {
    //verification du token
    jwt.verify(req.token, process.env.APP_SECRET, (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {

        }
    });

    const likeObj = req.body;
    const sauceObj = await Sauce.findById(req.params.id);
    console.log(likeObj);
    console.log(sauceObj);
    if (sauceObj) {
        if (likeObj.like == 1) {
            if (sauceObj.likes >= 0) {
                sauceObj.likes = sauceObj.userLiked.length + 1;
                sauceObj.userLiked.push(likeObj.userId); //j'ajoute userId dans l'array userLiked
                for (let index = 0; index < sauceObj.userDisliked.length; index++) {
                    console.log("LIKE" + sauceObj.userDisliked[index]);
                    if(sauceObj.userDisliked[index] == likeObj.userId){
                        sauceObj.userDisliked.splice(likeObj.userId, 1); //je retire userId dans l'array userDisLiked
                        --sauceObj.dislikes;
                    }
                }
            }
        }
        if (likeObj.like == -1) {
            if (sauceObj.dislikes >= 0) {
                sauceObj.dislikes = sauceObj.userDisliked.length + 1;
                sauceObj.userDisliked.push(likeObj.userId); //j'ajoute userId dans l'array userDisLiked
                for (let index = 0; index < sauceObj.userLiked.length; index++) {
                    console.log("DISLIKE" + sauceObj.userLiked[index]);
                    if(sauceObj.userLiked[index] == likeObj.userId){
                        sauceObj.userLiked.splice(likeObj.userId, 1); //je retire userId dans l'array userLiked
                        --sauceObj.likes;
                    }
                }
            }
        }
        if (likeObj.like == 0) {
            if (sauceObj.userLiked.includes(likeObj.userId)) {
                sauceObj.userLiked.splice(likeObj.userId, 1); //je retire userId dans l'array userLiked
                if(sauceObj.likes > 0){
                    sauceObj.likes -= 1;
                }
            }

            if (sauceObj.userDisliked.includes(likeObj.userId)) {
                sauceObj.userDisliked.splice(likeObj.userId, 1); //je retire userId dans l'array userDisLiked
                if(sauceObj.dislikes > 0){
                    sauceObj.dislikes -= 1;
                }
            }
        }

        Sauce.findByIdAndUpdate(req.params.id, sauceObj).then(
            (sauce) => {
                if (!sauce) {
                    return res.status(404).send({ error: "Sauce not found!" })
                }
                res.status(200).send({ message: "Like Succefull Registered!" })
            }
        );
    }
}